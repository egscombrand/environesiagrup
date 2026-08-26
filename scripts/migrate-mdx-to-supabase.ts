// Migrates the existing content/**/*.mdx collections into Supabase. Safe to
// re-run: every collection upserts on its natural unique key (slug, or
// label+value for stats which has no slug), so nothing is duplicated.
//
// Usage: npx tsx scripts/migrate-mdx-to-supabase.ts

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/database.types';

process.loadEnvFile?.('.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

type Report = { collection: string; upserted: number; skipped: number; notes: string[] };
const reports: Report[] = [];

function readCollection(name: string): { slug: string; data: Record<string, unknown>; content: string }[] {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx')) // _TEMPLATE.md is .md, excluded by construction
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx$/, ''), data, content: content.trim() };
    });
}

/** Uploads a public/<localPath> asset to Storage media/<destFolder>/<filename>, returns the stored path. */
async function uploadPublicAsset(localPath: string | undefined, destFolder: string): Promise<string | undefined> {
  if (!localPath) return undefined;
  const relPath = localPath.replace(/^\/+/, '');
  const absPath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(absPath)) return undefined;

  const fileName = path.basename(absPath);
  const storagePath = `${destFolder}/${fileName}`;
  const ext = path.extname(fileName).toLowerCase();
  const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';

  const { error } = await supabase.storage
    .from('media')
    .upload(storagePath, fs.readFileSync(absPath), { contentType, upsert: true });

  if (error) throw new Error(`Upload failed for ${absPath}: ${error.message}`);
  return storagePath;
}

async function migrateEntities() {
  const entries = readCollection('entities');
  const report: Report = { collection: 'entities', upserted: 0, skipped: 0, notes: [] };
  const slugToId = new Map<string, string>();

  for (const entry of entries) {
    const d = entry.data as Record<string, string | string[] | number | undefined>;
    const logoPath = await uploadPublicAsset(d.logo as string | undefined, 'logos');

    const { data, error } = await supabase
      .from('entities')
      .upsert(
        {
          slug: entry.slug,
          name: (d.nama as string) ?? entry.slug,
          tagline: (d.tagline as string) ?? null,
          lini: (d.lini as string) ?? null,
          accent_color: (d.warnaAksen as string) ?? null,
          short_description: (d.deskripsi as string) ?? null,
          description: entry.content || null,
          services: (d.layanan as string[]) ?? [],
          legalitas: (d.legalitas as string[]) ?? [],
          website: (d.website as string) ?? null,
          logo_path: logoPath ?? null,
          sort_order: Number(d.urutan ?? 0),
          status: 'published',
        },
        { onConflict: 'slug' }
      )
      .select('id, slug')
      .single();

    if (error) {
      report.notes.push(`${entry.slug}: ${error.message}`);
      report.skipped += 1;
      continue;
    }
    slugToId.set(data.slug, data.id);
    report.upserted += 1;
  }

  reports.push(report);
  return slugToId;
}

async function migrateHero() {
  const entries = readCollection('hero');
  const report: Report = { collection: 'hero_slides', upserted: 0, skipped: 0, notes: [] };

  for (const entry of entries) {
    const d = entry.data as Record<string, string | number | undefined>;
    const desktopImagePath =
      d.type === 'image' ? await uploadPublicAsset(d.src as string | undefined, 'hero') : undefined;
    const videoPosterPath = await uploadPublicAsset(d.poster as string | undefined, 'hero');
    const mobileImagePath = await uploadPublicAsset(d.srcMobile as string | undefined, 'hero');

    // hero_slides has no natural unique key in the original MDX (no slug),
    // so identify existing rows by title to keep this idempotent.
    const title = (d.headline as string) ?? entry.slug;
    const { data: existing } = await supabase.from('hero_slides').select('id').eq('title', title).maybeSingle();

    const payload = {
      type: (d.type as string) ?? 'image',
      title,
      subtitle: null,
      eyebrow: (d.eyebrow as string) ?? null,
      description: (d.subheadline as string) ?? null,
      desktop_image_path: desktopImagePath ?? null,
      mobile_image_path: mobileImagePath ?? null,
      video_url: d.type === 'video' ? (d.src as string) ?? null : null,
      video_poster_path: videoPosterPath ?? null,
      cta_label: (d.ctaLabel as string) ?? null,
      cta_url: (d.ctaUrl as string) ?? null,
      accent_color: (d.accentColor as string) ?? null,
      sort_order: Number(d.urutan ?? 0),
      status: 'published' as const,
    };

    const { error } = existing
      ? await supabase.from('hero_slides').update(payload).eq('id', existing.id)
      : await supabase.from('hero_slides').insert(payload);

    if (error) {
      report.notes.push(`${entry.slug}: ${error.message}`);
      report.skipped += 1;
      continue;
    }
    report.upserted += 1;
  }

  reports.push(report);
}

async function migratePillars(entitySlugToId: Map<string, string>) {
  const entries = readCollection('pillars');
  const report: Report = { collection: 'business_pillars', upserted: 0, skipped: 0, notes: [] };

  for (const entry of entries) {
    const d = entry.data as Record<string, string | string[] | number | undefined>;

    const { data, error } = await supabase
      .from('business_pillars')
      .upsert(
        {
          slug: entry.slug,
          name: (d.nama as string) ?? entry.slug,
          icon: (d.ikon as string) ?? null,
          short_description: (d.deskripsi as string) ?? null,
          description: entry.content || null,
          services: (d.layanan as string[]) ?? [],
          sort_order: Number(d.urutan ?? 0),
          status: 'published',
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (error) {
      report.notes.push(`${entry.slug}: ${error.message}`);
      report.skipped += 1;
      continue;
    }

    const relatedSlugs = (d.entitasTerkait as string[]) ?? [];
    const entityIds = relatedSlugs.map((slug) => entitySlugToId.get(slug)).filter((id): id is string => Boolean(id));

    await supabase.from('pillar_entities').delete().eq('pillar_id', data.id);
    if (entityIds.length > 0) {
      await supabase.from('pillar_entities').insert(entityIds.map((entity_id) => ({ pillar_id: data.id, entity_id })));
    }

    report.upserted += 1;
  }

  reports.push(report);
}

async function migrateStats() {
  const entries = readCollection('stats');
  const report: Report = { collection: 'stats', upserted: 0, skipped: 0, notes: [] };

  for (const entry of entries) {
    const d = entry.data as Record<string, string | number | undefined>;
    const label = (d.label as string) ?? entry.slug;

    // stats has no slug in the original MDX; identify existing rows by label.
    const { data: existing } = await supabase.from('stats').select('id').eq('label', label).maybeSingle();

    const payload = {
      label,
      value: Number(d.nilai ?? 0),
      suffix: (d.satuan as string) || null,
      sort_order: Number(d.urutan ?? 0),
      status: 'published' as const,
    };

    const { error } = existing
      ? await supabase.from('stats').update(payload).eq('id', existing.id)
      : await supabase.from('stats').insert(payload);

    if (error) {
      report.notes.push(`${entry.slug}: ${error.message}`);
      report.skipped += 1;
      continue;
    }
    report.upserted += 1;
  }

  reports.push(report);
}

async function main() {
  const entitySlugToId = await migrateEntities();
  await migrateHero();
  await migratePillars(entitySlugToId);
  await migrateStats();

  console.log('\nMigration report');
  console.log('=================');
  for (const report of reports) {
    console.log(`${report.collection}: ${report.upserted} upserted, ${report.skipped} skipped`);
    for (const note of report.notes) console.log(`  ! ${note}`);
  }

  const emptyCollections = ['posts', 'projects', 'leadership', 'milestones', 'documents', 'jobs'].filter(
    (name) => readCollection(name).length === 0
  );
  if (emptyCollections.length > 0) {
    console.log(
      `\nNo MDX content found yet for: ${emptyCollections.join(', ')} (only _TEMPLATE.md exists). Nothing to migrate — add these from /wp-admin going forward.`
    );
  }
}

main();

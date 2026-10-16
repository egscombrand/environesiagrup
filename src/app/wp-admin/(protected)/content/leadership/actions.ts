'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { slugify, ensureUniqueSlug } from '@/lib/admin/slug';

/**
 * Saves one leadership record: its basic fields and its profile (education,
 * experience, stats, contribution, teaching). The profile arrives as one JSON
 * payload. Each logo is read from the form field named for its item's stable key,
 * so reordering or removing an item never mixes up two logos.
 */

const ROLES = ['direktur_utama', 'direksi', 'entitas_grup', 'komisaris', 'lainnya'] as const;
const STATUSES = ['draft', 'published', 'archived'] as const;
const STORAGE_PATH = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,300}$/;

const text = (max: number) => z.string().trim().max(max);

const profileSchema = z.object({
  descriptor: text(200).default(''),
  photo: z.object({ width: z.coerce.number().int().positive().max(10000), height: z.coerce.number().int().positive().max(10000) }),
  education: z
    .array(
      z.object({
        key: z.string().min(1).max(64),
        level: text(200),
        institution: text(200),
        degree: text(100).default(''),
        scholarship: text(200).default(''),
        note: text(500).default(''),
      })
    )
    .max(20)
    .default([]),
  experience: z.array(text(1000)).max(20).default([]),
  stats: z.array(z.object({ value: text(40), label: text(120) })).max(12).default([]),
  contributionLabel: text(120).default(''),
  contribution: z.array(text(1000)).max(10).default([]),
  teaching: z
    .array(
      z.object({
        key: z.string().min(1).max(64),
        institution: text(200),
        program: text(200),
        description: text(1000).default(''),
      })
    )
    .max(20)
    .default([]),
});

const basicSchema = z.object({
  name: z.string().trim().min(1, 'Nama tidak boleh kosong.').max(200),
  // Blank (the default, while the slug follows the name automatically) or a
  // person-chosen value from the "Edit URL/Slug" action — either way it's
  // re-run through slugify() below, so no format is enforced here.
  slug: z.string().trim().max(120).default(''),
  position: z.string().trim().min(1, 'Jabatan tidak boleh kosong.').max(200),
  role: z.enum(ROLES),
  status: z.enum(STATUSES),
  sort_order: z.coerce.number().int().min(0).max(10000).default(0),
  bio: text(4000).default(''),
});

/** A stored logo or portrait path, or null. Anything outside what an upload can produce is dropped. */
function pathOrNull(value: FormDataEntryValue | null): string | null {
  const v = typeof value === 'string' ? value.trim() : '';
  return v && STORAGE_PATH.test(v) && !v.includes('..') ? v : null;
}

export async function saveLeadershipAction(id: string | null, formData: FormData) {
  const { supabase } = await requireRole(['super_admin', 'editor']);

  const basic = basicSchema.safeParse({
    name: formData.get('name') ?? '',
    slug: formData.get('slug') ?? '',
    position: formData.get('position') ?? '',
    role: formData.get('role') ?? '',
    status: formData.get('status') ?? 'draft',
    sort_order: formData.get('sort_order') ?? 0,
    bio: formData.get('bio') ?? '',
  });
  if (!basic.success) return { error: basic.error.issues[0]?.message ?? 'Data tidak valid.' };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get('profile') ?? '{}'));
  } catch {
    return { error: 'Profil tidak dapat dibaca. Muat ulang halaman dan coba lagi.' };
  }
  const profile = profileSchema.safeParse(raw);
  if (!profile.success) return { error: profile.error.issues[0]?.message ?? 'Profil tidak valid.' };
  const p = profile.data;

  const entityId = typeof formData.get('entity_id') === 'string' ? String(formData.get('entity_id')).trim() : '';

  // Auto-derive the slug from the name unless a custom one was set via
  // "Edit URL/Slug" (basic.data.slug is '' in auto mode — see SlugField).
  const slugBase = slugify(basic.data.slug || basic.data.name);
  const slug = await ensureUniqueSlug(supabase, 'leadership', slugBase, id ?? undefined);

  const photoPath = pathOrNull(formData.get('photo_path'));
  const row = {
    name: basic.data.name,
    slug,
    position: basic.data.position,
    type: basic.data.role,
    status: basic.data.status,
    sort_order: basic.data.sort_order,
    bio: basic.data.bio || null,
    photo_path: photoPath,
    entity_id: entityId || null,
    profile: {
      descriptor: p.descriptor || undefined,
      photo: p.photo,
      education: p.education.map((item) => ({
        level: item.level,
        institution: item.institution,
        degree: item.degree || undefined,
        scholarship: item.scholarship || undefined,
        note: item.note || undefined,
        logoPath: pathOrNull(formData.get(`logo_${item.key}`)) ?? undefined,
      })),
      experience: p.experience.filter(Boolean),
      stats: p.stats.filter((s) => s.value && s.label),
      contributionLabel: p.contributionLabel || undefined,
      contribution: p.contribution.filter(Boolean),
      teaching: p.teaching.map((item) => ({
        institution: item.institution,
        program: item.program,
        description: item.description,
        logoPath: pathOrNull(formData.get(`logo_${item.key}`)) ?? undefined,
      })),
    },
  };

  const { error } = id
    ? await supabase.from('leadership').update(row).eq('id', id)
    : await supabase.from('leadership').insert(row);

  if (error) {
    console.error('[leadership] save failed', { id, code: error.code, message: error.message, details: error.details });
    if (error.code === '23505') return { error: 'Slug sudah dipakai orang lain. Pilih slug lain.' };
    return { error: `Gagal menyimpan: ${error.message}${error.code ? ` (kode ${error.code})` : ''}` };
  }

  revalidatePublicSite();
  return { ok: true as const };
}

'use server';

import { createHash } from 'node:crypto';
import { requireRole } from '@/lib/admin/auth';
import { writeAuditLog } from '@/lib/admin/audit';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { slugify } from '@/lib/admin/slug';
import { buildNewsPreview, detectNewsColumns, type NewsPreviewItem, type NewsPreviewSummary } from '@/lib/admin/news-import';
import { readSpreadsheetRows } from '@/lib/admin/news-import-server';

// Same roles that can create posts manually.
const ALLOWED_ROLES = ['super_admin', 'editor', 'author'] as const;

const MAX_IMPORT_BYTES = 20 * 1024 * 1024;
const INSERT_CHUNK = 500;
const PREVIEW_LIMIT = 50;

export type NewsPreviewResult =
  | {
      ok: true;
      fileName: string;
      columns: { title: boolean; owner: boolean; media: boolean; published_at: boolean; source_url: boolean };
      summary: NewsPreviewSummary;
      sample: NewsPreviewItem[];
    }
  | { ok: false; error: string };

export type NewsImportResult = { ok: true; imported: number; failed: number } | { ok: false; error: string };

/** Only reads files the upload step put under this prefix — never arbitrary storage paths. */
function isImportPath(path: string): boolean {
  return path.startsWith('news-imports/') && !path.includes('..');
}

async function loadPreview(supabase: Awaited<ReturnType<typeof requireRole>>['supabase'], storagePath: string, fileName: string) {
  const { data: file, error } = await supabase.storage.from('media').download(storagePath);
  if (error || !file) return { ok: false as const, error: `Gagal membaca file: ${error?.message ?? 'file tidak ditemukan'}` };
  if (file.size > MAX_IMPORT_BYTES) return { ok: false as const, error: 'Ukuran file maksimal 20 MB.' };

  if (fileName.toLowerCase().endsWith('.xls')) {
    return {
      ok: false as const,
      error: 'File .xls belum dapat dibaca oleh importer ini. Simpan ulang file sebagai .xlsx atau .csv, lalu unggah kembali.',
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let parsed: Awaited<ReturnType<typeof readSpreadsheetRows>>;
  try {
    parsed = await readSpreadsheetRows(bytes, fileName);
  } catch {
    return { ok: false as const, error: 'File tidak dapat dibaca. Pastikan file tidak rusak dan sesuai formatnya.' };
  }
  const { rows, links } = parsed;
  if (rows.length === 0) return { ok: false as const, error: 'File tidak berisi data.' };

  const [header, ...dataRows] = rows;
  const detected = detectNewsColumns(header);
  if (!detected.ok) return { ok: false as const, error: detected.message };

  const { data: existing, error: existingError } = await supabase
    .from('posts')
    .select('title, source_url')
    .is('deleted_at', null);
  if (existingError) return { ok: false as const, error: existingError.message };

  const preview = buildNewsPreview(dataRows, detected.map, existing ?? [], 2, links.slice(1));
  return { ok: true as const, map: detected.map, ...preview, dataRows, links: links.slice(1) };
}

export async function previewNewsImportAction(storagePath: string, fileName: string): Promise<NewsPreviewResult> {
  if (!isImportPath(storagePath)) return { ok: false, error: 'Lokasi file tidak valid.' };
  const { supabase } = await requireRole([...ALLOWED_ROLES]);

  const result = await loadPreview(supabase, storagePath, fileName);
  if (!result.ok) return result;

  return {
    ok: true,
    fileName,
    columns: {
      title: true,
      owner: result.map.owner !== undefined,
      media: result.map.media !== undefined,
      published_at: result.map.published_at !== undefined,
      source_url: result.map.source_url !== undefined,
    },
    summary: result.summary,
    sample: result.items.slice(0, PREVIEW_LIMIT),
  };
}

/**
 * Imports every ready and need-review row in one go. Duplicates and rows
 * without a title are never imported. Rows are inserted in chunks, so a
 * large file never becomes one oversized statement.
 */
export async function importNewsAction(storagePath: string, fileName: string): Promise<NewsImportResult> {
  if (!isImportPath(storagePath)) return { ok: false, error: 'Lokasi file tidak valid.' };
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const result = await loadPreview(supabase, storagePath, fileName);
  if (!result.ok) return result;

  const importable = result.items.filter((item) => item.status === 'ready' || item.status === 'need_review');
  let imported = 0;
  let failed = 0;

  for (let start = 0; start < importable.length; start += INSERT_CHUNK) {
    const chunk = importable.slice(start, start + INSERT_CHUNK).map((item) => {
      const hash = createHash('sha1').update(`${item.title}\u0001${item.source_url ?? ''}`).digest('hex').slice(0, 8);
      return {
        title: item.title,
        slug: `${slugify(item.title).slice(0, 80) || 'berita'}-${hash}`,
        owner: item.owner,
        media: item.media,
        source_url: item.source_url,
        published_at: item.published_at,
        category: 'berita-perusahaan',
        status: 'published',
        needs_review: item.status === 'need_review',
        thumbnail_status: 'pending',
        created_by: user.id,
      };
    });

    const { data, error } = await supabase.from('posts').insert(chunk).select('id');
    if (error) {
      failed += chunk.length;
    } else {
      imported += data?.length ?? 0;
    }
  }

  await writeAuditLog(supabase, {
    userId: user.id,
    action: 'create',
    resource: 'posts',
    resourceId: 'news-import',
    newData: { file: fileName, imported, failed },
  });
  revalidatePublicSite();

  return { ok: true, imported, failed };
}

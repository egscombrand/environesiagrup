'use server';

import { requireRole } from '@/lib/admin/auth';
import { extractProjectsFromPdf, findPossibleDuplicate, type ExtractedProject } from '@/lib/admin/pdf-import';
import { slugify, ensureUniqueSlug } from '@/lib/admin/slug';
import { writeAuditLog } from '@/lib/admin/audit';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { SECTOR_VALUES, COMPANY_VALUES } from '@/lib/admin/project-options';

// Mirrors projectsResource.authorScoped in src/lib/admin/resources/projects.ts
// — anyone who can use "Add Project" manually can also use Import PDF.
const ALLOWED_ROLES = ['super_admin', 'editor', 'author'] as const;

const MAX_PDF_SIZE = 20 * 1024 * 1024;

export type ReviewCandidate = ExtractedProject & {
  possibleDuplicateOf: { id: string; title: string } | null;
};

export type StartImportResult =
  | { ok: true; batchId: string; sourceDocument: string; candidates: ReviewCandidate[] }
  | { ok: false; error: string };

export async function startImportAction(formData: FormData): Promise<StartImportResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Tidak ada file yang diunggah.' };
  if (file.type !== 'application/pdf') return { ok: false, error: 'Hanya file PDF yang didukung.' };
  if (file.size > MAX_PDF_SIZE) return { ok: false, error: 'Ukuran file maksimal 20 MB.' };

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const storagePath = `project-imports/${Date.now()}-${safeName}`;

  // The batch record is created up front, as "uploading", before the file
  // even reaches storage — status always reflects real DB state, never an
  // assumption the frontend makes on its own.
  const { data: batch, error: batchError } = await supabase
    .from('import_batches')
    .insert({ source_document: storagePath, status: 'uploading', imported_by: user.id })
    .select('id')
    .single();
  if (batchError || !batch) return { ok: false, error: batchError?.message ?? 'Gagal membuat batch import.' };

  const { error: uploadError } = await supabase.storage.from('media').upload(storagePath, bytes, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (uploadError) {
    await supabase.from('import_batches').update({ status: 'failed' }).eq('id', batch.id);
    return { ok: false, error: `Gagal mengunggah PDF: ${uploadError.message}` };
  }

  await supabase.from('import_batches').update({ status: 'processing' }).eq('id', batch.id);

  const result = await extractProjectsFromPdf(bytes);

  if (!result.ok) {
    await supabase.from('import_batches').update({ status: 'failed' }).eq('id', batch.id);
    return { ok: false, error: result.message };
  }

  const { data: existingProjects } = await supabase
    .from('projects')
    .select('id, title, client, city, year')
    .is('deleted_at', null);

  const candidates: ReviewCandidate[] = result.projects.map((p) => {
    const duplicate = findPossibleDuplicate(p, existingProjects ?? []);
    return { ...p, possibleDuplicateOf: duplicate ? { id: duplicate.id, title: duplicate.title } : null };
  });

  // "review" — extraction is done, nothing is saved to `projects` yet; the
  // batch only reaches "completed" once the admin actually saves a
  // selection (saveImportAction), or "cancelled" if they back out instead.
  await supabase
    .from('import_batches')
    .update({ status: 'review', projects_found: candidates.length })
    .eq('id', batch.id);

  return { ok: true, batchId: batch.id, sourceDocument: storagePath, candidates };
}

export async function cancelImportAction(batchId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireRole([...ALLOWED_ROLES]);

  // Projects already created from this batch (if any) are untouched —
  // cancelling only marks the batch itself, never deletes or reverts rows.
  const { error } = await supabase
    .from('import_batches')
    .update({ status: 'cancelled' })
    .eq('id', batchId)
    .eq('status', 'review');

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type SelectedProject = {
  project_name: string;
  client: string | null;
  sector: string;
  location: string | null;
  year: number | null;
  service: string | null;
  brand: string;
  description: string | null;
  source_page: number | null;
  confidence: string;
};

export type SaveImportResult = { ok: true; savedCount: number } | { ok: false; error: string };

/**
 * Saves one chunk of selected rows as Draft projects. Bulk import calls
 * this repeatedly with the next slice of selected rows so the wizard can
 * show real, non-fabricated "125 / 302" progress between calls — this
 * function itself never touches the batch's own status/imported_count;
 * call completeImportAction once, after the last chunk, for that.
 */
export async function saveImportChunkAction(
  batchId: string,
  sourceDocument: string,
  selected: SelectedProject[]
): Promise<SaveImportResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  if (selected.length === 0) return { ok: false, error: 'Tidak ada proyek yang dipilih.' };

  let savedCount = 0;

  for (const p of selected) {
    // The one true requirement: a name to recognize this as a project at
    // all. Every other field — client, sector, location, year, service,
    // description — may be missing; an incomplete project is still
    // imported as Draft and can be completed later from the normal Edit
    // screen, same as any other Draft project. This is PDF Import's own
    // insert path (not the generic admin resource form), so relaxing this
    // here never touches "Add Project"'s own required-field validation.
    if (!p.project_name?.trim()) continue;

    const slug = await ensureUniqueSlug(supabase, 'projects', slugify(p.project_name));
    const brand = (COMPANY_VALUES as readonly string[]).includes(p.brand) ? p.brand : 'Environesia Company Group';
    const sector = (SECTOR_VALUES as readonly string[]).includes(p.sector) ? p.sector : null;

    const values = {
      title: p.project_name,
      slug,
      client: p.client?.trim() || null,
      sector,
      city: p.location?.trim() || null,
      year: p.year ?? null,
      services: p.service || null,
      company: brand,
      content: p.description || null,
      status: 'draft',
      source_document: sourceDocument,
      source_page: p.source_page ?? null,
      extraction_method: 'pdf_text',
      confidence: p.confidence,
      import_batch_id: batchId,
      created_by: user.id,
    };

    const { data, error } = await supabase.from('projects').insert(values).select('id').single();
    // One row failing to save (e.g. a transient DB error) never loses the
    // rest of the batch — keep going, the admin can retry just that row later.
    if (error || !data) continue;

    savedCount += 1;
    await writeAuditLog(supabase, {
      userId: user.id,
      action: 'create',
      resource: 'projects',
      resourceId: data.id,
      newData: values,
    });
  }

  if (savedCount === 0) {
    return { ok: false, error: 'Tidak ada proyek yang berhasil disimpan — periksa kembali data yang dipilih.' };
  }

  return { ok: true, savedCount };
}

/** Marks the batch "completed" with the real cumulative count and revalidates the public site — call once, after all chunks have been saved. */
export async function completeImportAction(
  batchId: string,
  totalImported: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireRole([...ALLOWED_ROLES]);

  const { error } = await supabase
    .from('import_batches')
    .update({ status: 'completed', imported_count: totalImported })
    .eq('id', batchId);
  if (error) return { ok: false, error: error.message };

  revalidatePublicSite();
  return { ok: true };
}

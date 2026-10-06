'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import { requireRole } from '@/lib/admin/auth';
import { writeAuditLog } from '@/lib/admin/audit';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

// Mirrors projectsResource.authorScoped — anyone who can use "Add Project" /
// Import PDF can also edit the table inline.
const ALLOWED_ROLES = ['super_admin', 'editor', 'author'] as const;

// A field name chosen at runtime (e.g. `field: ProjectTextField`) can't be
// checked against the generated Update type's exact literal keys, so
// Supabase's excess-property check rejects `{ [field]: value }` even though
// every possible field is a real, valid column. Same escape hatch as
// crud.ts's `dyn()` — a typing convenience, not a safety relaxation; `field`
// is still restricted to TEXT_FIELDS before this is ever used.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentional escape hatch, see comment above
function dyn(supabase: SupabaseClient<any, any, any>) {
  return supabase;
}

export type FieldResult = { ok: true } | { ok: false; error: string };
export type BulkResult = { ok: true; count: number } | { ok: false; error: string };

const TEXT_FIELDS = ['client', 'sector', 'city', 'services', 'company'] as const;
export type ProjectTextField = (typeof TEXT_FIELDS)[number];

export async function updateProjectTitleAction(id: string, title: string): Promise<FieldResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const trimmed = title.trim();
  if (!trimmed) return { ok: false, error: 'Nama proyek tidak boleh kosong.' };

  const { error } = await supabase.from('projects').update({ title: trimmed }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, { userId: user.id, action: 'update', resource: 'projects', resourceId: id, newData: { title: trimmed } });
  revalidatePublicSite();
  return { ok: true };
}

/** Any of the free-text fields — Klien, Sektor, Lokasi, Layanan, Perusahaan. Never constrained to a fixed list: empty clears to null, anything else is accepted as typed. */
export async function updateProjectTextFieldAction(
  id: string,
  field: ProjectTextField,
  value: string
): Promise<FieldResult> {
  if (!TEXT_FIELDS.includes(field)) return { ok: false, error: 'Field tidak dikenali.' };
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const normalized = value.trim() || null;
  const { error } = await dyn(supabase).from('projects').update({ [field]: normalized }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, { userId: user.id, action: 'update', resource: 'projects', resourceId: id, newData: { [field]: normalized } });
  revalidatePublicSite();
  return { ok: true };
}

export async function updateProjectYearAction(id: string, year: number | null): Promise<FieldResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  if (year !== null && (!Number.isInteger(year) || year < 1900 || year > 2100)) {
    return { ok: false, error: 'Tahun tidak valid.' };
  }

  const { error } = await supabase.from('projects').update({ year }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, { userId: user.id, action: 'update', resource: 'projects', resourceId: id, newData: { year } });
  revalidatePublicSite();
  return { ok: true };
}

export async function updateProjectStatusAction(id: string, status: 'draft' | 'published'): Promise<FieldResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const { error } = await supabase.from('projects').update({ status }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, {
    userId: user.id,
    action: status === 'published' ? 'publish' : 'unpublish',
    resource: 'projects',
    resourceId: id,
    newData: { status },
  });
  revalidatePublicSite();
  return { ok: true };
}

export async function bulkSetStatusAction(ids: string[], status: 'draft' | 'published'): Promise<BulkResult> {
  if (ids.length === 0) return { ok: false, error: 'Tidak ada proyek yang dipilih.' };
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const { data, error } = await supabase.from('projects').update({ status }).in('id', ids).select('id');
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, {
    userId: user.id,
    action: status === 'published' ? 'publish' : 'unpublish',
    resource: 'projects',
    resourceId: ids.join(','),
    newData: { status, count: ids.length },
  });
  revalidatePublicSite();
  return { ok: true, count: data?.length ?? 0 };
}

/** Bulk "Ubah Sektor" / "Ubah Perusahaan" — overwrites the field for every selected row with one typed-or-picked value. */
export async function bulkSetTextFieldAction(
  ids: string[],
  field: 'sector' | 'company',
  value: string
): Promise<BulkResult> {
  if (ids.length === 0) return { ok: false, error: 'Tidak ada proyek yang dipilih.' };
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const normalized = value.trim() || null;
  const { data, error } = await dyn(supabase).from('projects').update({ [field]: normalized }).in('id', ids).select('id');
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, {
    userId: user.id,
    action: 'update',
    resource: 'projects',
    resourceId: ids.join(','),
    newData: { [field]: normalized, count: ids.length },
  });
  revalidatePublicSite();
  return { ok: true, count: data?.length ?? 0 };
}

export async function bulkDeleteAction(ids: string[]): Promise<BulkResult> {
  if (ids.length === 0) return { ok: false, error: 'Tidak ada proyek yang dipilih.' };
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const { data, error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)
    .select('id');
  if (error) return { ok: false, error: error.message };

  await writeAuditLog(supabase, {
    userId: user.id,
    action: 'delete',
    resource: 'projects',
    resourceId: ids.join(','),
    newData: { count: ids.length },
  });
  revalidatePublicSite();
  return { ok: true, count: data?.length ?? 0 };
}

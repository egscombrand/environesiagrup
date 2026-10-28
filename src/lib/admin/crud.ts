import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { ResourceConfig, FieldConfig } from './resources/types';
import { slugify, ensureUniqueSlug } from './slug';
import { sanitizeRichTextHtml } from './sanitize-html';
import { writeAuditLog } from './audit';
import { revalidatePublicSite } from './revalidate';

export type ActionResult = { error?: string };

// This module operates on table names chosen at runtime (from ResourceConfig),
// which the strictly-typed Database generic can't express — every .from(x)
// would otherwise collapse to `never` on writes. `dyn()` opts a single call
// site out of that generic, exactly like Supabase's own docs recommend for
// building a generic table-agnostic CRUD layer; every table this actually
// touches still goes through RLS on the caller's session, so this is a
// typing convenience, not a safety relaxation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentional escape hatch, see comment above
type DynClient = SupabaseClient<any, any, any>;
function dyn(supabase: SupabaseClient<Database>): DynClient {
  return supabase as unknown as DynClient;
}

function parseFormData(fields: FieldConfig[], formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    switch (field.type) {
      case 'boolean':
        result[field.name] = formData.has(field.name);
        break;
      case 'tags': {
        const raw = String(formData.get(field.name) ?? '');
        result[field.name] = raw
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
        break;
      }
      case 'entity-multiselect':
        result[field.name] = formData.getAll(field.name).map(String);
        break;
      case 'number': {
        const raw = formData.get(field.name);
        result[field.name] = raw === null || raw === '' ? undefined : raw;
        break;
      }
      case 'html': {
        // Sanitized again here regardless of what the editor's own client-side
        // output already was — a save action is never trusted to have come
        // only from that editor. See lib/admin/sanitize-html.ts.
        const raw = formData.get(field.name);
        result[field.name] = raw === null ? undefined : sanitizeRichTextHtml(String(raw));
        break;
      }
      default: {
        const raw = formData.get(field.name);
        result[field.name] = raw === null ? undefined : String(raw);
      }
    }
  }

  return result;
}

/** Rows visible to the current session per RLS: admin roles see everything, author sees their own + published. */
export async function listResourceRows(resource: ResourceConfig, supabase: SupabaseClient<Database>) {
  let query = dyn(supabase).from(resource.table).select('*');
  if (resource.softDelete) query = query.is('deleted_at', null);
  if (resource.scope) query = query.eq(resource.scope.column, resource.scope.value);
  query = query.order(resource.defaultSort.column, { ascending: resource.defaultSort.ascending });

  const { data, error } = await query;
  if (error) {
    // Table name, column, and the PostgREST error code/message are safe to
    // log (no row data, no credentials) — this is what actually shows up
    // in Vercel's Runtime Logs, since the thrown Error below is what a
    // production error.tsx boundary sees (message redacted client-side,
    // but this line is the one that survives server-side either way).
    console.error('[admin/crud] listResourceRows failed', {
      table: resource.table,
      code: error.code,
      message: error.message,
      hint: error.hint,
    });
    throw new Error(`Failed to load ${resource.table}: ${error.message}`);
  }
  return (data ?? []) as Record<string, unknown>[];
}

export async function getResourceRow(
  resource: ResourceConfig,
  id: string,
  supabase: SupabaseClient<Database>
): Promise<Record<string, unknown> | null> {
  let query = dyn(supabase).from(resource.table).select('*').eq('id', id);
  if (resource.scope) query = query.eq(resource.scope.column, resource.scope.value);
  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('[admin/crud] getResourceRow failed', {
      table: resource.table,
      id,
      code: error.code,
      message: error.message,
      hint: error.hint,
    });
    throw new Error(`Failed to load ${resource.singular}: ${error.message}`);
  }
  if (!data) return null;

  const row = data as Record<string, unknown>;

  if (resource.relation) {
    const { data: relations } = await dyn(supabase)
      .from(resource.relation.table)
      .select('*')
      .eq(resource.relation.thisKey, id);
    row[resource.relation.fieldName] = (relations ?? []).map(
      (r) => (r as Record<string, unknown>)[resource.relation!.otherKey]
    );
  }

  return row;
}

async function syncRelation(
  resource: ResourceConfig,
  rowId: string,
  otherIds: string[],
  supabase: SupabaseClient<Database>
) {
  if (!resource.relation) return;
  const { table, thisKey, otherKey } = resource.relation;

  await dyn(supabase).from(table).delete().eq(thisKey, rowId);
  if (otherIds.length > 0) {
    await dyn(supabase)
      .from(table)
      .insert(otherIds.map((otherId) => ({ [thisKey]: rowId, [otherKey]: otherId })));
  }
}

export async function createResourceRow(
  resource: ResourceConfig,
  formData: FormData,
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ActionResult & { id?: string }> {
  const parsed = resource.schema.safeParse(parseFormData(resource.fields, formData));
  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(', ') };
  }

  const values = { ...(parsed.data as Record<string, unknown>) };
  const relatedIds = resource.relation ? (values[resource.relation.fieldName] as string[]) : undefined;
  if (resource.relation) delete values[resource.relation.fieldName];

  if (resource.slugSource) {
    const base = slugify(String(values.slug || values[resource.slugSource] || ''));
    values.slug = await ensureUniqueSlug(supabase, resource.table, base);
  }

  // Forced, never taken from the submitted form — this is what keeps a
  // split resource (e.g. Siaran Pers vs Berita Perusahaan, both on "posts")
  // from ever creating a row as the other one's type.
  if (resource.scope) values[resource.scope.column] = resource.scope.value;

  if (resource.authorScoped) values.created_by = userId;

  const { data, error } = await dyn(supabase).from(resource.table).insert(values).select('id').single();
  if (error) return { error: error.message };

  const id = (data as { id: string }).id;
  if (resource.relation && relatedIds) await syncRelation(resource, id, relatedIds, supabase);

  await writeAuditLog(supabase, { userId, action: 'create', resource: resource.table, resourceId: id, newData: values });
  revalidatePublicSite();
  return { id };
}

export async function updateResourceRow(
  resource: ResourceConfig,
  id: string,
  formData: FormData,
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ActionResult> {
  const parsed = resource.schema.safeParse(parseFormData(resource.fields, formData));
  if (!parsed.success) {
    return { error: parsed.error.issues.map((issue) => issue.message).join(', ') };
  }

  const values = { ...(parsed.data as Record<string, unknown>) };
  const relatedIds = resource.relation ? (values[resource.relation.fieldName] as string[]) : undefined;
  if (resource.relation) delete values[resource.relation.fieldName];

  if (resource.slugSource) {
    const base = slugify(String(values.slug || values[resource.slugSource] || ''));
    values.slug = await ensureUniqueSlug(supabase, resource.table, base, id);
  }

  // Forced, never taken from the submitted form — see createResourceRow.
  // Also used to scope the row lookup and the update's WHERE clause below,
  // so a crafted request can never reach into, let alone change, a row that
  // belongs to the other resource sharing this table.
  if (resource.scope) values[resource.scope.column] = resource.scope.value;

  let beforeQuery = dyn(supabase).from(resource.table).select('*').eq('id', id);
  if (resource.scope) beforeQuery = beforeQuery.eq(resource.scope.column, resource.scope.value);
  const { data: before } = await beforeQuery.maybeSingle();

  let updateQuery = dyn(supabase).from(resource.table).update(values).eq('id', id);
  if (resource.scope) updateQuery = updateQuery.eq(resource.scope.column, resource.scope.value);
  const { error } = await updateQuery;
  if (error) return { error: error.message };

  if (resource.relation && relatedIds) await syncRelation(resource, id, relatedIds, supabase);

  await writeAuditLog(supabase, {
    userId,
    action: 'update',
    resource: resource.table,
    resourceId: id,
    oldData: before,
    newData: values,
  });
  revalidatePublicSite();
  return {};
}

export async function deleteResourceRow(
  resource: ResourceConfig,
  id: string,
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ActionResult> {
  let beforeQuery = dyn(supabase).from(resource.table).select('*').eq('id', id);
  if (resource.scope) beforeQuery = beforeQuery.eq(resource.scope.column, resource.scope.value);
  const { data: before } = await beforeQuery.maybeSingle();

  let deleteQuery = resource.softDelete
    ? dyn(supabase).from(resource.table).update({ deleted_at: new Date().toISOString() }).eq('id', id)
    : dyn(supabase).from(resource.table).delete().eq('id', id);
  if (resource.scope) deleteQuery = deleteQuery.eq(resource.scope.column, resource.scope.value);
  const { error } = await deleteQuery;

  if (error) return { error: error.message };

  await writeAuditLog(supabase, { userId, action: 'delete', resource: resource.table, resourceId: id, oldData: before });
  revalidatePublicSite();
  return {};
}

export async function setResourceStatus(
  resource: ResourceConfig,
  id: string,
  status: 'draft' | 'published' | 'archived',
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ActionResult> {
  let query = dyn(supabase).from(resource.table).update({ status }).eq('id', id);
  if (resource.scope) query = query.eq(resource.scope.column, resource.scope.value);
  const { error } = await query;
  if (error) return { error: error.message };

  await writeAuditLog(supabase, {
    userId,
    action: status === 'published' ? 'publish' : 'unpublish',
    resource: resource.table,
    resourceId: id,
    newData: { status },
  });
  revalidatePublicSite();
  return {};
}

export async function reorderResourceRows(
  resource: ResourceConfig,
  orderedIds: string[],
  supabase: SupabaseClient<Database>
): Promise<ActionResult> {
  await Promise.all(
    orderedIds.map((id, index) => dyn(supabase).from(resource.table).update({ sort_order: index }).eq('id', id))
  );
  revalidatePublicSite();
  return {};
}

'use server';

import { requireRole } from '@/lib/admin/auth';
import { getResource } from '@/lib/admin/resources';
import * as crud from '@/lib/admin/crud';

function resolveResource(slug: string) {
  const resource = getResource(slug);
  if (!resource) throw new Error(`Unknown resource: ${slug}`);
  return resource;
}

function allowedRoles(resourceSlug: string): Array<'super_admin' | 'editor' | 'author'> {
  const resource = resolveResource(resourceSlug);
  return resource.authorScoped ? ['super_admin', 'editor', 'author'] : ['super_admin', 'editor'];
}

export async function createAction(resourceSlug: string, formData: FormData) {
  const resource = resolveResource(resourceSlug);
  const { supabase, user } = await requireRole(allowedRoles(resourceSlug));

  const result = await crud.createResourceRow(resource, formData, supabase, user.id);
  if (result.error) return result;
  return {};
}

export async function updateAction(resourceSlug: string, id: string, formData: FormData) {
  const resource = resolveResource(resourceSlug);
  const { supabase, user } = await requireRole(allowedRoles(resourceSlug));

  const result = await crud.updateResourceRow(resource, id, formData, supabase, user.id);
  if (result.error) return result;
  return {};
}

export async function deleteAction(resourceSlug: string, id: string) {
  const resource = resolveResource(resourceSlug);
  const { supabase, user } = await requireRole(allowedRoles(resourceSlug));
  return crud.deleteResourceRow(resource, id, supabase, user.id);
}

export async function setStatusAction(
  resourceSlug: string,
  id: string,
  status: 'draft' | 'published' | 'archived'
) {
  const resource = resolveResource(resourceSlug);
  const { supabase, user } = await requireRole(['super_admin', 'editor']);
  return crud.setResourceStatus(resource, id, status, supabase, user.id);
}

export async function reorderAction(resourceSlug: string, orderedIds: string[]) {
  const resource = resolveResource(resourceSlug);
  const { supabase } = await requireRole(['super_admin', 'editor']);
  return crud.reorderResourceRows(resource, orderedIds, supabase);
}

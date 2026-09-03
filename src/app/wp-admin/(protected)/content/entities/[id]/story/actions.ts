'use server';

import { requireRole, type Role } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { validateReorderScope } from '@/lib/admin/navigation-reorder';
import { storySceneSchema } from '@/lib/admin/resources/story-scenes';

const ROLES: Role[] = ['super_admin', 'editor'];

function parseSceneForm(formData: FormData) {
  return storySceneSchema.safeParse({
    headline: formData.get('headline') || undefined,
    description: formData.get('description') || undefined,
    image_path: formData.get('image_path') || undefined,
    cta_label: formData.get('cta_label') || undefined,
    cta_url: formData.get('cta_url') || undefined,
    status: formData.get('status'),
  });
}

export async function createStorySceneAction(entityId: string, formData: FormData) {
  const { supabase } = await requireRole(ROLES);
  const parsed = parseSceneForm(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((issue) => issue.message).join(', ') };

  const { count } = await supabase
    .from('story_scenes')
    .select('id', { count: 'exact', head: true })
    .eq('entity_id', entityId);

  const { error } = await supabase.from('story_scenes').insert({ ...parsed.data, entity_id: entityId, sort_order: count ?? 0 });
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function updateStorySceneAction(entityId: string, sceneId: string, formData: FormData) {
  const { supabase } = await requireRole(ROLES);
  const parsed = parseSceneForm(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((issue) => issue.message).join(', ') };

  const { error } = await supabase
    .from('story_scenes')
    .update(parsed.data)
    .eq('id', sceneId)
    .eq('entity_id', entityId);
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function deleteStorySceneAction(entityId: string, sceneId: string) {
  const { supabase } = await requireRole(ROLES);
  const { error } = await supabase.from('story_scenes').delete().eq('id', sceneId).eq('entity_id', entityId);
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function reorderStorySceneAction(entityId: string, orderedIds: string[]) {
  const { supabase } = await requireRole(ROLES);

  const { data: rows, error: fetchError } = await supabase
    .from('story_scenes')
    .select('id')
    .eq('entity_id', entityId);
  if (fetchError) return { error: fetchError.message };

  const existingIds = (rows ?? []).map((row) => row.id);
  if (!validateReorderScope(existingIds, orderedIds)) {
    return { error: 'Scene order is out of date. Refresh and try again.' };
  }

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('story_scenes').update({ sort_order: index }).eq('id', id).eq('entity_id', entityId)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePublicSite();
  return {};
}

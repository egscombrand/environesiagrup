import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type StorySceneRow = Database['public']['Tables']['story_scenes']['Row'];

export type StoryScene = StorySceneRow & {
  imageUrl?: string;
};

function mapScene(row: StorySceneRow): StoryScene {
  return {
    ...row,
    imageUrl: publicMediaUrl(row.image_path),
  };
}

/**
 * Public: every published scene for the given entities, in `sort_order`,
 * grouped by `entity_id` — one query for the whole deck rather than one per
 * company. Entities with no scenes simply don't appear as a key; callers
 * fall back to a single implicit scene from the entity's own short_description.
 */
export async function getPublishedStoryScenesByEntity(entityIds: string[]): Promise<Record<string, StoryScene[]>> {
  if (entityIds.length === 0) return {};

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('story_scenes')
    .select('*')
    .in('entity_id', entityIds)
    .eq('status', 'published')
    .order('entity_id', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load story scenes: ${error.message}`);

  const grouped: Record<string, StoryScene[]> = {};
  for (const row of data ?? []) {
    const scene = mapScene(row);
    (grouped[scene.entity_id] ??= []).push(scene);
  }
  return grouped;
}

/** Admin: every non-deleted scene for one entity (RLS-scoped session), in `sort_order`. */
export async function listStoryScenesForAdmin(entityId: string): Promise<StoryScene[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('story_scenes')
    .select('*')
    .eq('entity_id', entityId)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load story scenes: ${error.message}`);
  return (data ?? []).map(mapScene);
}

export async function getStorySceneByIdForAdmin(id: string): Promise<StoryScene | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('story_scenes').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load story scene: ${error.message}`);
  return data ? mapScene(data) : null;
}

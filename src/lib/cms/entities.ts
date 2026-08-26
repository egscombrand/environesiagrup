import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type EntityRow = Database['public']['Tables']['entities']['Row'];

export type Entity = EntityRow & {
  logoUrl?: string;
  coverImageUrl?: string;
};

function mapEntity(row: EntityRow): Entity {
  return {
    ...row,
    logoUrl: publicMediaUrl(row.logo_path),
    coverImageUrl: publicMediaUrl(row.cover_image_path),
  };
}

/** Public: all published, non-deleted entities, in admin-defined order. */
export async function getPublishedEntities(): Promise<Entity[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load entities: ${error.message}`);
  return (data ?? []).map(mapEntity);
}

/** Public: a single published entity by slug, or null if not found/not published. */
export async function getPublishedEntityBySlug(slug: string): Promise<Entity | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(`Failed to load entity "${slug}": ${error.message}`);
  return data ? mapEntity(data) : null;
}

/** All slugs of published entities, for generateStaticParams / sitemap. */
export async function getPublishedEntitySlugs(): Promise<string[]> {
  const entities = await getPublishedEntities();
  return entities.map((entity) => entity.slug);
}

/** Admin: every non-deleted entity visible to the current session (RLS-scoped). */
export async function listEntitiesForAdmin(): Promise<Entity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load entities: ${error.message}`);
  return (data ?? []).map(mapEntity);
}

export async function getEntityByIdForAdmin(id: string): Promise<Entity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('entities').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load entity: ${error.message}`);
  return data ? mapEntity(data) : null;
}

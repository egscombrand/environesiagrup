import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';
import { ENTITY_EXPLORER_FALLBACK } from './entity-explorer-content';

type EntityRow = Database['public']['Tables']['entities']['Row'];

export type Entity = EntityRow & {
  logoUrl?: string;
  coverImageUrl?: string;
  /** The Entity Explorer card (src/components/bisnis-layanan/ecosystem-exhibition.tsx), one field at a time falling back to the hardcoded profile until the database column is filled in (migration 0044). */
  explorerCategory: string;
  explorerDescription: string;
  explorerContribution: string;
  explorerFocus: string[];
  explorerServices: string[];
  explorerRole: string;
  explorerImageSrc?: string;
  /** "Visit {name}" link: the entity's own website, with its protocol. Undefined when it has none. */
  explorerCtaUrl?: string;
  /** Professional/platform links shown as icons in the exhibition card — each only when the entity actually has one set. */
  socialYoutubeUrl?: string;
  socialTiktokUrl?: string;
};

function mapEntity(row: EntityRow): Entity {
  const fallback = ENTITY_EXPLORER_FALLBACK[row.slug];
  const website = row.website?.trim();
  const youtube = row.social_youtube?.trim();
  const tiktok = row.social_tiktok?.trim();
  return {
    ...row,
    logoUrl: publicMediaUrl(row.logo_path),
    coverImageUrl: publicMediaUrl(row.cover_image_path),
    explorerCategory: row.explorer_category?.trim() || fallback?.category || '',
    explorerDescription: row.explorer_description?.trim() || fallback?.description || '',
    explorerContribution: row.explorer_contribution?.trim() || fallback?.contribution || '',
    explorerFocus: row.explorer_focus.length > 0 ? row.explorer_focus : (fallback?.focus ?? []),
    explorerServices: row.explorer_services.length > 0 ? row.explorer_services : (fallback?.services ?? []),
    explorerRole: row.explorer_role?.trim() || fallback?.roleInGroup || '',
    explorerImageSrc: publicMediaUrl(row.explorer_image_path) ?? publicMediaUrl(fallback?.imagePath),
    explorerCtaUrl: website ? `https://${website}` : undefined,
    socialYoutubeUrl: youtube || undefined,
    socialTiktokUrl: tiktok || undefined,
  };
}

/**
 * Entities shown on every general "our entities" surface — the ecosystem
 * diagram, the homepage Capabilities grid, Entitas Kami, and the
 * Organization JSON-LD's subOrganization list. Excludes Bangsap: it's a
 * media/education brand that appears only in the "Kenali Perusahaan dalam
 * Ekosistem Kami" showcase (see BRAND_ORDER in ecosystem-exhibition.tsx),
 * not alongside the five core/supporting operating entities everywhere
 * else on the site.
 */
const EXCLUDED_FROM_GENERAL_LISTING = new Set(['bangsap']);

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

/** Same as getPublishedEntities(), minus brands scoped to one specific showcase — see EXCLUDED_FROM_GENERAL_LISTING. */
export async function getPublishedCoreEntities(): Promise<Entity[]> {
  const entities = await getPublishedEntities();
  return entities.filter((entity) => !EXCLUDED_FROM_GENERAL_LISTING.has(entity.slug));
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

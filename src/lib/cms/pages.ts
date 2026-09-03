import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

type PageSectionRow = Database['public']['Tables']['page_sections']['Row'];

export type SectionKey =
  | 'hero'
  | 'stats'
  | 'entities'
  | 'pillars'
  | 'projects_showcase'
  | 'milestones'
  | 'leadership'
  | 'map'
  | 'leadership_message'
  | 'sustainability'
  | 'clients'
  | 'documents'
  | 'green_business'
  | 'news'
  | 'cta';

export type PageSection = PageSectionRow & { section_key: SectionKey };

/** Enabled sections for a page, in admin-defined order. Homepage renders by
 * mapping this list through a section_key -> component registry. */
export async function getPublishedPageSections(pageSlug: string): Promise<PageSection[]> {
  const supabase = createPublicClient();
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', pageSlug)
    .maybeSingle();

  if (pageError) throw new Error(`Failed to load page "${pageSlug}": ${pageError.message}`);
  if (!page) return [];

  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load sections for "${pageSlug}": ${error.message}`);
  return (data ?? []) as PageSection[];
}

export async function listPageSectionsForAdmin(pageSlug: string): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', pageSlug)
    .maybeSingle();

  if (pageError) throw new Error(`Failed to load page "${pageSlug}": ${pageError.message}`);
  if (!page) return [];

  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load sections for "${pageSlug}": ${error.message}`);
  return (data ?? []) as PageSection[];
}

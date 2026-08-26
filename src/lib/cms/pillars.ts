import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

type PillarRow = Database['public']['Tables']['business_pillars']['Row'];

export type Pillar = PillarRow & {
  relatedEntityIds: string[];
};

async function attachRelatedEntities(
  supabase: SupabaseClient<Database>,
  pillars: PillarRow[]
): Promise<Pillar[]> {
  if (pillars.length === 0) return [];

  const { data: relations, error } = await supabase
    .from('pillar_entities')
    .select('pillar_id, entity_id')
    .in(
      'pillar_id',
      pillars.map((p) => p.id)
    );

  if (error) throw new Error(`Failed to load pillar-entity relations: ${error.message}`);

  const byPillar = new Map<string, string[]>();
  for (const relation of relations ?? []) {
    const list = byPillar.get(relation.pillar_id) ?? [];
    list.push(relation.entity_id);
    byPillar.set(relation.pillar_id, list);
  }

  return pillars.map((pillar) => ({ ...pillar, relatedEntityIds: byPillar.get(pillar.id) ?? [] }));
}

export async function getPublishedPillars(): Promise<Pillar[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('business_pillars')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load pillars: ${error.message}`);
  return attachRelatedEntities(supabase, data ?? []);
}

export async function getPublishedPillarBySlug(slug: string): Promise<Pillar | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('business_pillars')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new Error(`Failed to load pillar "${slug}": ${error.message}`);
  if (!data) return null;
  const [pillar] = await attachRelatedEntities(supabase, [data]);
  return pillar;
}

export async function getPublishedPillarSlugs(): Promise<string[]> {
  const pillars = await getPublishedPillars();
  return pillars.map((pillar) => pillar.slug);
}

export async function listPillarsForAdmin(): Promise<Pillar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('business_pillars')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load pillars: ${error.message}`);
  return attachRelatedEntities(supabase, data ?? []);
}

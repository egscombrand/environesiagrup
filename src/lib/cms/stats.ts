import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

export type Stat = Database['public']['Tables']['stats']['Row'];

export async function getPublishedStats(): Promise<Stat[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load stats: ${error.message}`);
  return data ?? [];
}

export async function listStatsForAdmin(): Promise<Stat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('stats').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load stats: ${error.message}`);
  return data ?? [];
}

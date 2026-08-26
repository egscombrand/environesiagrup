import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

export type Job = Database['public']['Tables']['jobs']['Row'];

/** Public: published jobs whose deadline (if set) hasn't passed. */
export async function getOpenPublishedJobs(): Promise<Job[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .or(`deadline.is.null,deadline.gte.${today}`)
    .order('published_at', { ascending: false });

  if (error) throw new Error(`Failed to load jobs: ${error.message}`);
  return data ?? [];
}

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(`Failed to load job "${slug}": ${error.message}`);
  return data;
}

export async function listJobsForAdmin(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load jobs: ${error.message}`);
  return data ?? [];
}

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type JobRow = Database['public']['Tables']['jobs']['Row'];

export type Job = JobRow & { coverImageUrl?: string };

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  internship: 'Internship',
  fulltime: 'Fulltime',
};

/** "internship" → "Internship", or the raw value for anything unrecognized — never blank. */
export function employmentTypeLabel(value: string | null): string | null {
  if (!value) return null;
  return EMPLOYMENT_TYPE_LABELS[value] ?? value;
}

function mapJob(row: JobRow): Job {
  return { ...row, coverImageUrl: publicMediaUrl(row.cover_image_path) };
}

/** Public: published jobs whose close date (if set) hasn't passed — the listing follows that period on its own, regardless of `status`. */
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
  return (data ?? []).map(mapJob);
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
  return data ? mapJob(data) : null;
}

export async function getPublishedJobSlugs(): Promise<string[]> {
  const jobs = await getOpenPublishedJobs();
  return jobs.map((job) => job.slug);
}

export async function listJobsForAdmin(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load jobs: ${error.message}`);
  return (data ?? []).map(mapJob);
}

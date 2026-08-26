import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type MilestoneRow = Database['public']['Tables']['milestones']['Row'];

export type Milestone = MilestoneRow & { imageUrl?: string };

function mapMilestone(row: MilestoneRow): Milestone {
  return { ...row, imageUrl: publicMediaUrl(row.image_path) };
}

export async function getPublishedMilestones(): Promise<Milestone[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load milestones: ${error.message}`);
  return (data ?? []).map(mapMilestone);
}

export async function listMilestonesForAdmin(): Promise<Milestone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('milestones').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load milestones: ${error.message}`);
  return (data ?? []).map(mapMilestone);
}

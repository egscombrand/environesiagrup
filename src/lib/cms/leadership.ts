import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type LeadershipRow = Database['public']['Tables']['leadership']['Row'];

export type LeadershipMember = LeadershipRow & { photoUrl?: string };

function mapLeadership(row: LeadershipRow): LeadershipMember {
  return { ...row, photoUrl: publicMediaUrl(row.photo_path) };
}

export async function getPublishedLeadership(type?: 'direksi' | 'komisaris' | 'lainnya'): Promise<LeadershipMember[]> {
  const supabase = createPublicClient();
  let query = supabase.from('leadership').select('*').eq('status', 'published');
  if (type) query = query.eq('type', type);
  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load leadership: ${error.message}`);
  return (data ?? []).map(mapLeadership);
}

export async function listLeadershipForAdmin(): Promise<LeadershipMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leadership').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load leadership: ${error.message}`);
  return (data ?? []).map(mapLeadership);
}

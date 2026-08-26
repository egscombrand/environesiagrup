import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export type ActivityItem = {
  id: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: string;
};

const RESOURCE_LABELS: Record<string, string> = {
  entities: 'Entity',
  business_pillars: 'Business Pillar',
  hero_slides: 'Hero Slide',
  stats: 'Stat',
  projects: 'Project',
  posts: 'Post',
  leadership: 'Leadership',
  milestones: 'Milestone',
  documents: 'Document',
  jobs: 'Job',
  navigation_items: 'Navigation Item',
  site_settings: 'Site Settings',
  page_sections: 'Page Section',
  media: 'Media',
};

/** Real recent-activity feed, sourced from audit_logs — never fabricated. */
export async function getRecentActivity(supabase: SupabaseClient<Database>, limit = 8): Promise<ActivityItem[]> {
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('id, user_id, action, resource, resource_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !logs || logs.length === 0) return [];

  const userIds = Array.from(new Set(logs.map((l) => l.user_id).filter((id): id is string => Boolean(id))));
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, username').in('id', userIds)
    : { data: [] as { id: string; username: string }[] };

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.username]));

  return logs.map((log) => ({
    id: log.id,
    actorName: (log.user_id && nameById.get(log.user_id)) || 'Someone',
    action: log.action,
    resource: RESOURCE_LABELS[log.resource] ?? log.resource,
    resourceId: log.resource_id,
    createdAt: log.created_at,
  }));
}

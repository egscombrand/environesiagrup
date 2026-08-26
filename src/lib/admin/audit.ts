import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export async function writeAuditLog(
  supabase: SupabaseClient<Database>,
  entry: {
    userId: string;
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
    resource: string;
    resourceId: string;
    oldData?: unknown;
    newData?: unknown;
  }
) {
  const { error } = await supabase.from('audit_logs').insert({
    user_id: entry.userId,
    action: entry.action,
    resource: entry.resource,
    resource_id: entry.resourceId,
    old_data: (entry.oldData as never) ?? null,
    new_data: (entry.newData as never) ?? null,
  });

  // Audit logging must never block or fail the actual mutation the admin
  // just performed — log and move on.
  if (error) console.error(`Failed to write audit log for ${entry.resource}:${entry.resourceId}`, error);
}

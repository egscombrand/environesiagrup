import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- table name is dynamic; see src/lib/admin/crud.ts's dyn()
type DynClient = SupabaseClient<any, any, any>;
function dyn(supabase: SupabaseClient<Database>): DynClient {
  return supabase as unknown as DynClient;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/** Appends -2, -3, ... until the slug is unique in `table`, excluding `excludeId` (the row being edited). */
export async function ensureUniqueSlug(
  supabase: SupabaseClient<Database>,
  table: string,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let candidate = baseSlug || 'item';
  let suffix = 2;

  for (;;) {
    let query = dyn(supabase).from(table).select('id').eq('slug', candidate).limit(1);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query;

    if (!data || data.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

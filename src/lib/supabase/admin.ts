import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { SUPABASE_URL } from './env';

// Service-role client. Bypasses RLS entirely — every call site using this
// must do its own authorization check first. The `server-only` import above
// makes any accidental import from a Client Component a build-time error,
// and SUPABASE_SERVICE_ROLE_KEY is never exposed via NEXT_PUBLIC_*, so it
// cannot end up in the browser bundle.
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createAdminClient() {
  if (cached) return cached;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }

  cached = createSupabaseClient<Database>(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

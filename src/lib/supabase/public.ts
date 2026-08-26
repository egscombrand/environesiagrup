import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Cookie-less, anon-key client for public (published-only) reads. Every
// public.* RLS policy grants `anon` the same access as a logged-out visitor,
// so this needs no session — which is exactly why it's usable from contexts
// that have no request (generateStaticParams, sitemap.ts, robots.ts, and any
// standalone script), unlike src/lib/supabase/server.ts's cookie-bound
// client (that one calls next/headers cookies(), which throws outside an
// active request). Never use this for admin reads that must respect the
// caller's session-scoped RLS (draft visibility, author-owned rows) — use
// server.ts's createClient() for those.
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createPublicClient() {
  if (cached) return cached;
  cached = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

/**
 * A plain (non-SSR) Supabase client, used only by the reset-password page.
 *
 * The app's normal browser client (src/lib/supabase/client.ts, via
 * @supabase/ssr) hardcodes the PKCE auth flow so sessions sync to cookies
 * for the server to read — but this project is on Supabase's free tier,
 * which locks out custom email templates, so the password-recovery and
 * invite emails always use Supabase's default template: a link that hits
 * Supabase's own hosted /auth/v1/verify endpoint and redirects back with
 * session tokens in the URL *hash fragment* (the older "implicit" flow
 * shape) — servers never see hash fragments, and a PKCE-configured client
 * does not auto-adopt them. This client uses the implicit flow instead,
 * specifically so it *can* pick up that hash fragment client-side. The
 * resulting session only needs to live long enough to call
 * `auth.updateUser({ password })`, then the page signs out and sends the
 * user to a normal cookie-based login — so not syncing to cookies here is
 * fine.
 */
export function createRecoveryClient() {
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true },
  });
}

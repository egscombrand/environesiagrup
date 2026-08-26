import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Server Component / Server Action / Route Handler client. Runs with the
// caller's session (anon key + cookies), so RLS applies exactly as it would
// for that logged-in user — this is deliberate, never a privilege escalation
// path. Writing cookies from a Server Component (not an action/handler) is a
// no-op that Next.js allows only because middleware refreshes the session on
// every request; the try/catch mirrors the Supabase SSR reference pattern.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render — middleware keeps the
          // session cookie fresh, so this is safe to ignore.
        }
      },
    },
  });
}

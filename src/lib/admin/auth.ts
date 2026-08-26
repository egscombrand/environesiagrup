import 'server-only';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Role } from './roles';

export type { Role } from './roles';
export { ROLE_LABELS } from './roles';

/** Redirects to /wp-admin/login if nobody is signed in. Use in every protected layout/page. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/wp-admin/login');
  return { supabase, user };
}

/** requireUser() plus the caller's profile (role, username). */
export async function requireProfile() {
  const { supabase, user } = await requireUser();
  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error || !profile) redirect('/wp-admin/unauthorized');
  return { supabase, user, profile };
}

/** requireProfile() plus a role check. Redirects to /wp-admin/unauthorized if the role doesn't match. */
export async function requireRole(allowed: Role[]) {
  const result = await requireProfile();
  if (!allowed.includes(result.profile.role)) redirect('/wp-admin/unauthorized');
  return result;
}

/**
 * Resolves a wp-admin username to the real email Supabase Auth has on file
 * for that account, so the login form can stay username-first while
 * password reset/recovery emails still land somewhere real. Uses the
 * service-role client because an anonymous, not-yet-authenticated login
 * attempt has no session for RLS to scope `profiles` to — this lookup only
 * ever returns an email string consumed server-side for signInWithPassword,
 * never sent back to the client, so it isn't an enumeration surface.
 */
export async function resolveLoginEmail(username: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('profiles')
    .select('email')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle();
  return data?.email ?? null;
}

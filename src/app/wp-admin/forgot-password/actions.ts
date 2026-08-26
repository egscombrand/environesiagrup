'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { resolveLoginEmail } from '@/lib/admin/auth';

export type ForgotPasswordState = { error?: string; sent?: boolean };

export async function requestPasswordResetAction(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const username = String(formData.get('username') ?? '').trim();
  if (!username) return { error: 'Masukkan username Anda.' };

  const email = await resolveLoginEmail(username);

  // Always report success, whether or not the username exists — otherwise
  // this form becomes a username-enumeration oracle. If it does exist, a
  // real reset email goes out; if not, nothing happens silently.
  if (email) {
    // Built from the live request rather than a configured SITE_URL: the
    // project has no confirmed production domain yet (project.md §6), and
    // Supabase's redirect allowlist is keyed by exact origin, so this must
    // match whatever host actually served the request (localhost:PORT in
    // dev, the real domain once deployed — add it to the Supabase Auth
    // redirect allowlist when that happens).
    const requestHeaders = await headers();
    const origin =
      requestHeaders.get('origin') ??
      `${requestHeaders.get('x-forwarded-proto') ?? 'http'}://${requestHeaders.get('host')}`;

    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/wp-admin/reset-password`,
    });
  }

  return { sent: true };
}

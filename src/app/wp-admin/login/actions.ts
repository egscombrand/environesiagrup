'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { resolveLoginEmail } from '@/lib/admin/auth';

// Failure never returns a value for a hook to pick up — it redirects back
// to this same page with the message in a query param, which the page
// reads and renders server-side. No useActionState, no client state, no
// object to serialize across the server/client boundary at all.
function backToLoginWithError(next: string, error: string): never {
  const params = new URLSearchParams({ error, next });
  redirect(`/wp-admin/login?${params.toString()}`);
}

// Bound directly to <form action={loginAction}> — no useActionState
// wrapper, so its signature is exactly (formData) => Promise<void>, not
// (prevState, formData). Every path ends in redirect(); nothing here is
// wrapped in try/catch, since redirect() works by throwing and a catch
// around it would turn a successful redirect into a caught "error".
export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/wp-admin/dashboard');

  if (!username || !password) {
    backToLoginWithError(next, 'Username dan password wajib diisi.');
  }

  const email = await resolveLoginEmail(username);
  if (!email) {
    // Deliberately the same message as a wrong password — confirming a
    // username exists is exactly the enumeration this avoids.
    backToLoginWithError(next, 'Username atau password salah.');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    backToLoginWithError(next, 'Username atau password salah.');
  }

  redirect(next.startsWith('/wp-admin') ? next : '/wp-admin/dashboard');
}

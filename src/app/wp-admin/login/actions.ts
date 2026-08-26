'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { resolveLoginEmail } from '@/lib/admin/auth';

export type LoginState = { error?: string };

export async function signInAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/wp-admin/dashboard');

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  const email = await resolveLoginEmail(username);
  if (!email) {
    // Deliberately the same message as a wrong password — confirming a
    // username exists is exactly the enumeration this avoids.
    return { error: 'Username atau password salah.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Username atau password salah.' };
  }

  redirect(next.startsWith('/wp-admin') ? next : '/wp-admin/dashboard');
}

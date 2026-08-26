'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { requireRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

async function resetRedirectUrl() {
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get('origin') ??
    `${requestHeaders.get('x-forwarded-proto') ?? 'http'}://${requestHeaders.get('host')}`;
  return `${origin}/wp-admin/reset-password`;
}

const createSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^[a-z0-9._-]+$/, 'Hanya huruf kecil, angka, titik, garis bawah, dan tanda hubung.'),
  email: z.string().email('Email tidak valid.'),
  full_name: z.string().optional(),
  role: z.enum(['super_admin', 'editor', 'author']),
});

export type CreateUserState = { error?: string; invited?: boolean };

// No password is ever generated or handled by this app: inviteUserByEmail
// creates the account with no password set and emails the person a real
// Supabase-issued link that lands on /wp-admin/reset-password, where they
// choose their own password.
export async function createUserAction(_prev: CreateUserState, formData: FormData): Promise<CreateUserState> {
  await requireRole(['super_admin']);

  const parsed = createSchema.safeParse({
    username: String(formData.get('username') ?? '').trim().toLowerCase(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    full_name: String(formData.get('full_name') ?? '') || undefined,
    role: formData.get('role'),
  });
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const admin = createAdminClient();
  const { username, email, full_name, role } = parsed.data;

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { username, full_name, role },
    redirectTo: await resetRedirectUrl(),
  });

  if (error) return { error: error.message };
  return { invited: true };
}

export async function updateUserRoleAction(userId: string, role: 'super_admin' | 'editor' | 'author') {
  const { supabase, user } = await requireRole(['super_admin']);
  if (userId === user.id) return { error: 'Tidak dapat mengubah role akun sendiri.' };

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: error.message };
  return {};
}

export async function deleteUserAction(userId: string) {
  const { user } = await requireRole(['super_admin']);
  if (userId === user.id) return { error: 'Tidak dapat menghapus akun sendiri.' };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  return {};
}

// Lets a super_admin trigger a real password-reset email for someone else's
// account (e.g. they're locked out) — still entirely through Supabase Auth,
// never a password this app generates or sees.
export async function resetUserPasswordAction(userId: string) {
  const { supabase: callerClient, user } = await requireRole(['super_admin']);
  if (userId === user.id) {
    return { error: 'Gunakan "Lupa password?" di halaman login untuk akun sendiri.' };
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile?.email) return { error: 'Email akun ini tidak ditemukan.' };

  const { error } = await callerClient.auth.resetPasswordForEmail(profile.email, {
    redirectTo: await resetRedirectUrl(),
  });
  if (error) return { error: error.message };
  return { sent: true };
}

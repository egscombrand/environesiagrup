import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { AuthShell } from '@/components/admin/auth-shell';
import { ForgotPasswordForm } from '@/components/admin/forgot-password-form';

export const metadata: Metadata = { title: 'Reset Password' };

export default async function ForgotPasswordPage() {
  const entities = await getPublishedEntities();

  return (
    <AuthShell
      eyebrow="Admin Workspace"
      title="Reset your password"
      subtitle="Masukkan username Anda, kami kirimkan link reset ke email terdaftar."
      accentColors={entities.map((e) => e.accent_color).filter((c): c is string => Boolean(c))}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

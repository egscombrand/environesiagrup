import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { AuthShell } from '@/components/admin/auth-shell';
import { ResetPasswordForm } from '@/components/admin/reset-password-form';

export const metadata: Metadata = { title: 'Set New Password' };

export default async function ResetPasswordPage() {
  const entities = await getPublishedEntities();

  return (
    <AuthShell
      eyebrow="Admin Workspace"
      title="Set a new password"
      subtitle="Buat password baru untuk akun Anda."
      accentColors={entities.map((e) => e.accent_color).filter((c): c is string => Boolean(c))}
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}

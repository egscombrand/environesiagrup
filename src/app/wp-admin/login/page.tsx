import type { Metadata } from 'next';
import { getPublishedEntities } from '@/lib/cms/entities';
import { AuthShell } from '@/components/admin/auth-shell';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = { title: 'Sign In' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const entities = await getPublishedEntities();

  return (
    <AuthShell
      eyebrow="Admin Workspace"
      title="Welcome back"
      subtitle="Masuk untuk melanjutkan ke workspace Anda."
      accentColors={entities.map((e) => e.accent_color).filter((c): c is string => Boolean(c))}
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}

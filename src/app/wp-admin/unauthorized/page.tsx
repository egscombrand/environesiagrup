import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedEntities } from '@/lib/cms/entities';
import { AuthShell } from '@/components/admin/auth-shell';

export const metadata: Metadata = { title: 'Unauthorized' };

export default async function UnauthorizedPage() {
  const entities = await getPublishedEntities();

  return (
    <AuthShell
      eyebrow="Admin Workspace"
      title="Not authorized"
      subtitle="Akun Anda tidak memiliki akses ke halaman ini."
      accentColors={entities.map((e) => e.accent_color).filter((c): c is string => Boolean(c))}
    >
      <Link
        href="/wp-admin/dashboard"
        className="block w-full rounded-[10px] bg-forest px-4 py-3 text-center text-small font-medium text-paper transition-opacity hover:opacity-90"
      >
        Kembali ke Dashboard
      </Link>
    </AuthShell>
  );
}

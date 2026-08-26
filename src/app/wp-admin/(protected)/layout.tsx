import type { ReactNode } from 'react';
import { requireProfile } from '@/lib/admin/auth';
import { getRecentActivity } from '@/lib/admin/activity';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { supabase, profile } = await requireProfile();
  const activity = await getRecentActivity(supabase);

  return (
    <AdminShell username={profile.username} role={profile.role} activity={activity}>
      {children}
    </AdminShell>
  );
}

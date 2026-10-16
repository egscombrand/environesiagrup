import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { CreateUserForm } from '@/components/admin/create-user-form';
import { UserRow } from '@/components/admin/user-row';

export const metadata: Metadata = { title: 'Users' };

export default async function UsersPage() {
  const { supabase, profile, user } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name, role, created_at')
    .order('created_at', { ascending: true });

  return (
    <div>
      <PageHeader eyebrow="System" title="Users" description="Manage who can access wp-admin and what they can do." />

      <div className="mt-6 overflow-x-auto rounded-[12px] border border-[#e3e8ee] bg-white">
        <table className="w-full min-w-[560px] text-left text-small">
          <thead>
            <tr className="border-b border-[#e3e8ee]">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Username</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Name</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Role</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <UserRow key={p.id} profile={p} isSelf={p.id === user.id} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-md rounded-[16px] border border-[#e3e8ee] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="font-display text-h3 text-ink">Invite a User</p>
        <p className="mt-1 text-small text-[#64748b]">They&apos;ll receive an email to set their own password.</p>
        <div className="mt-5">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}

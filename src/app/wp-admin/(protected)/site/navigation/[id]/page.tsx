import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { listNavigationForAdmin } from '@/lib/cms/navigation';
import { NavigationForm } from '@/components/admin/navigation-form';
import { updateNavigationAction } from '../actions';

export const metadata: Metadata = { title: 'Edit Menu' };

export default async function EditNavigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { id } = await params;
  const items = await listNavigationForAdmin();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();

  const hasChildren = items.some((i) => i.parent_id === item.id);
  const topLevelSiblings = items.filter((i) => i.menu === item.menu && i.parent_id === null && i.id !== item.id);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Website / Navigation</p>
        <h1 className="mt-2 font-display text-h2 text-ink">Edit Item Menu</h1>
      </div>
      <div className="mt-8 min-h-0 flex-1">
        <NavigationForm
          initialValues={item}
          siblingOptions={topLevelSiblings.map((i) => ({ id: i.id, label: i.label }))}
          disableParentSelect={hasChildren}
          action={updateNavigationAction.bind(null, id)}
        />
      </div>
    </div>
  );
}

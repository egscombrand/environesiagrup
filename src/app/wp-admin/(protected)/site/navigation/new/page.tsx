import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { listNavigationForAdmin } from '@/lib/cms/navigation';
import { NavigationForm } from '@/components/admin/navigation-form';
import { createNavigationAction } from '../actions';

export const metadata: Metadata = { title: 'Tambah Menu' };

export default async function NewNavigationPage({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string; parent_id?: string }>;
}) {
  const { profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { menu, parent_id } = await searchParams;
  const items = await listNavigationForAdmin();
  const menuValue = menu === 'footer' ? 'footer' : 'header';

  const topLevelInMenu = items.filter((i) => i.menu === menuValue && i.parent_id === null);
  const parentId = topLevelInMenu.some((i) => i.id === parent_id) ? (parent_id as string) : null;

  return (
    <div>
      <p className="font-mono text-label uppercase text-slate">Website / Navigation</p>
      <h1 className="mt-2 font-display text-h2 text-ink">Tambah Item Menu</h1>
      <div className="mt-8">
        <NavigationForm
          initialValues={{
            label: '',
            label_en: null,
            label_zh: null,
            url: '',
            slug: null,
            parent_id: parentId,
            menu: menuValue,
            status: 'published',
            open_new_tab: false,
            sort_order: items.filter((i) => i.menu === menuValue && i.parent_id === parentId).length,
          }}
          siblingOptions={topLevelInMenu.map((i) => ({ id: i.id, label: i.label }))}
          action={createNavigationAction}
        />
      </div>
    </div>
  );
}

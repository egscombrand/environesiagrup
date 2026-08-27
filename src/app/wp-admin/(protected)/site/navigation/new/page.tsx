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
  searchParams: Promise<{ menu?: string }>;
}) {
  const { profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { menu } = await searchParams;
  const items = await listNavigationForAdmin();
  const menuValue = menu === 'footer' ? 'footer' : 'header';

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
            parent_id: null,
            menu: menuValue,
            status: 'published',
            open_new_tab: false,
            sort_order: items.filter((i) => i.menu === menuValue).length,
          }}
          siblingOptions={items.filter((i) => i.menu === menuValue).map((i) => ({ id: i.id, label: i.label }))}
          action={createNavigationAction}
        />
      </div>
    </div>
  );
}

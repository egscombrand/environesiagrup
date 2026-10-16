import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Waypoints } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { listNavigationForAdmin, buildTree } from '@/lib/cms/navigation';
import { PageHeader } from '@/components/admin/page-header';
import { NavigationList } from '@/components/admin/navigation-list';
import { EmptyState } from '@/components/admin/empty-state';

export const metadata: Metadata = { title: 'Navigation' };

function MenuSection({
  title,
  items,
  menu,
}: {
  title: string;
  items: Awaited<ReturnType<typeof listNavigationForAdmin>>;
  menu: 'header' | 'footer';
}) {
  const roots = buildTree(items.filter((item) => item.menu === menu));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 text-ink">{title}</h2>
        <Link
          href={`/wp-admin/site/navigation/new?menu=${menu}`}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#e3e8ee] px-3 py-1.5 text-small text-ink hover:bg-[#f4f6f9]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Item
        </Link>
      </div>
      {roots.length === 0 ? (
        <div className="mt-3">
          <EmptyState icon={Waypoints} title="No items yet" description={`Items you add will appear in the ${title.toLowerCase()}.`} />
        </div>
      ) : (
        <div className="mt-3">
          <NavigationList menu={menu} roots={roots} />
        </div>
      )}
    </div>
  );
}

export default async function NavigationPage() {
  const { profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const items = await listNavigationForAdmin();

  return (
    <div>
      <PageHeader eyebrow="Website" title="Navigation" description="Manage the header and footer menus." />
      <div className="mt-8 space-y-10">
        <MenuSection title="Header Menu" items={items} menu="header" />
        <MenuSection title="Footer Menu" items={items} menu="footer" />
      </div>
    </div>
  );
}

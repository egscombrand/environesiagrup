import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Waypoints } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { listNavigationForAdmin } from '@/lib/cms/navigation';
import { PageHeader } from '@/components/admin/page-header';
import { NavigationRow } from '@/components/admin/navigation-row';
import { EmptyState } from '@/components/admin/empty-state';

export const metadata: Metadata = { title: 'Navigation' };

function MenuTable({ title, items, menu }: { title: string; items: Awaited<ReturnType<typeof listNavigationForAdmin>>; menu: 'header' | 'footer' }) {
  const filtered = items.filter((item) => item.menu === menu);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 text-ink">{title}</h2>
        <Link
          href={`/wp-admin/site/navigation/new?menu=${menu}`}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-line px-3 py-1.5 text-small text-ink hover:bg-stone"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Item
        </Link>
      </div>
      {filtered.length === 0 ? (
        <div className="mt-3">
          <EmptyState icon={Waypoints} title="No items yet" description={`Items you add will appear in the ${title.toLowerCase()}.`} />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-[14px] border border-line bg-paper">
          <table className="w-full min-w-[520px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-mono text-label uppercase text-slate">Label</th>
                <th className="px-4 py-3 font-mono text-label uppercase text-slate">URL</th>
                <th className="px-4 py-3 font-mono text-label uppercase text-slate">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <NavigationRow
                  key={item.id}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === filtered.length - 1}
                />
              ))}
            </tbody>
          </table>
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
        <MenuTable title="Header Menu" items={items} menu="header" />
        <MenuTable title="Footer Menu" items={items} menu="footer" />
      </div>
    </div>
  );
}

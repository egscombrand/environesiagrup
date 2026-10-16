import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getSiteSettings } from '@/lib/cms/settings';
import { PageHeader } from '@/components/admin/page-header';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata: Metadata = { title: 'Site Settings' };

export default async function SiteSettingsPage() {
  const { profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const settings = await getSiteSettings();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader eyebrow="Website" title="Site Settings" description="General information, social links, SEO defaults, and footer content." />
      </div>
      <div className="mt-8 min-h-0 flex-1">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}

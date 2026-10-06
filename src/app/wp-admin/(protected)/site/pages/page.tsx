import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { listPageSectionsForAdmin } from '@/lib/cms/pages';
import { PageHeader } from '@/components/admin/page-header';
import { SectionRow } from '@/components/admin/section-row';

export const metadata: Metadata = { title: 'Homepage Sections' };

export default async function PagesAdminPage() {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { data: page } = await supabase.from('pages').select('id, title').eq('slug', 'home').single();
  const sections = page ? await listPageSectionsForAdmin('home') : [];

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Homepage Sections"
        description={`The ${page?.title ?? 'Beranda'} page, top to bottom — enable/disable and reorder sections here (changes go live immediately, no redeploy needed), then use each row's "Manage Content" button to edit what's actually inside it.`}
      />

      <div className="mt-6 space-y-3">
        {sections.map((section, index) => (
          <SectionRow
            key={section.id}
            section={section}
            pageId={page!.id}
            isFirst={index === 0}
            isLast={index === sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

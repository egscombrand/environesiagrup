import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { listPageSectionsForAdmin } from '@/lib/cms/pages';
import { PageHeader } from '@/components/admin/page-header';
import { SectionRow } from '@/components/admin/section-row';

export const metadata: Metadata = { title: 'Pages' };

export default async function PagesAdminPage() {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== 'super_admin') redirect('/wp-admin/unauthorized');

  const { data: page } = await supabase.from('pages').select('id, title').eq('slug', 'home').single();
  const sections = page ? await listPageSectionsForAdmin('home') : [];

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Pages"
        description={`Enable/disable and reorder sections on the ${page?.title ?? 'Beranda'} page. Disabled sections are hidden from the live site immediately — no redeploy needed.`}
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

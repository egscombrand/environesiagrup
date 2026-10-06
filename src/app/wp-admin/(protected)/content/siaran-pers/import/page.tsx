import type { Metadata } from 'next';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { SiaranPersTabs } from '@/components/admin/siaran-pers-tabs';
import { NewsImportWizard } from '@/components/admin/news-import-wizard';

export const metadata: Metadata = { title: 'Import Siaran Pers' };

export default async function BeritaImportPage() {
  await requireProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Siaran Pers"
        description="Import berita dan siaran pers dari file Excel atau CSV. Data yang tidak lengkap tetap diimport dan ditandai Need Review."
      />
      <SiaranPersTabs active="import" />
      <NewsImportWizard />
    </div>
  );
}

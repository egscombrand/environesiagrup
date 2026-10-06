import type { Metadata } from 'next';
import { requireRole } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { PdfImportWizard } from '@/components/admin/pdf-import-wizard';

export const metadata: Metadata = { title: 'Import Projects from PDF' };

export default async function ImportProjectsPdfPage() {
  await requireRole(['super_admin', 'editor', 'author']);

  return (
    <div>
      <PageHeader
        eyebrow="Content / Projects"
        title="Import Projects from PDF"
        description="Upload dokumen portofolio proyek dan biarkan sistem membaca serta mengekstrak data proyek secara otomatis."
      />

      <div className="mt-6">
        <PdfImportWizard />
      </div>
    </div>
  );
}

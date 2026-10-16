import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { narrativeFormValue, narrativePageFor } from '@/lib/admin/narrative-pages';
import { PageHeader } from '@/components/admin/page-header';
import { NarrativeForm } from '@/components/admin/narrative-form';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: narrativePageFor(slug)?.label ?? 'Konten' };
}

export default async function NarrativeEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = narrativePageFor(slug);
  if (!page) notFound();

  const { supabase, profile } = await requireProfile();
  const { data } = await supabase.from('page_content').select('*').eq('slug', page.slug).maybeSingle();

  const canWrite = ['super_admin', 'editor'].includes(profile.role);
  const initial = narrativeFormValue(page, data as Record<string, unknown> | null);


  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={page.sectionLabel}
        title={page.label}
        description={
          page.localized
            ? 'Isi halaman ini ditampilkan di website. Bahasa Indonesia wajib diisi. English dan 中文 bersifat opsional: kolom yang dikosongkan memakai teks Bahasa Indonesia. Simpan sebagai Draft untuk menyimpannya tanpa menayangkan.'
            : 'Isi halaman ini ditampilkan di website. Simpan sebagai Draft untuk menyimpannya tanpa menayangkan.'
        }
      />
      <NarrativeForm page={page} initial={initial} canWrite={canWrite} />
    </div>
  );
}

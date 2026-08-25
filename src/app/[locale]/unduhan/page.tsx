import type { Metadata } from 'next';
import { PendingContent } from '@/components/layout/pending-content';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Unduhan',
    description: 'Dokumen resmi Environesia Company Group.',
    locale,
    path: '/unduhan',
  });
}

export default async function UnduhanPage() {
  return (
    <PendingContent
      eyebrow="Unduhan"
      title="Unduhan"
      description="Dokumen resmi grup untuk keperluan tender dan prakualifikasi."
    />
  );
}

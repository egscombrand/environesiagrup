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
    title: 'Karier',
    description: 'Peluang berkarier bersama Environesia Company Group.',
    locale,
    path: '/karier',
  });
}

export default async function KarierPage() {
  return (
    <PendingContent
      eyebrow="Karier"
      title="Karier"
      description="Peluang berkarier bersama grup."
    />
  );
}

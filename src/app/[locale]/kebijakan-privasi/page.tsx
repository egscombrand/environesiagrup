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
    title: 'Kebijakan Privasi',
    description: 'Kebijakan privasi Environesia Company Group.',
    locale,
    path: '/kebijakan-privasi',
  });
}

export default async function KebijakanPrivasiPage() {
  return (
    <PendingContent
      eyebrow="Legal"
      title="Kebijakan Privasi"
      description="Bagaimana kami menangani data yang Anda berikan."
      note="Naskah kebijakan privasi sedang disusun bersama tim legal."
    />
  );
}

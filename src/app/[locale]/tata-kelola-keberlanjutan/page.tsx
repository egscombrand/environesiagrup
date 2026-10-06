import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TataKelolaHero } from '@/components/tata-kelola-keberlanjutan/hero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Tata Kelola & Keberlanjutan',
    description: 'Menjaga kepercayaan dan memastikan Environesia tumbuh melalui tata kelola perusahaan yang kuat, bertanggung jawab, dan berorientasi pada keberlanjutan.',
    locale,
    path: '/tata-kelola-keberlanjutan',
  });
}

export default function TataKelolaKeberlanjutanPage() {
  return <TataKelolaHero />;
}

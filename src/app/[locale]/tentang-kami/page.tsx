import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Tentang Kami',
    description:
      'Environesia Company Group bergerak di bidang lingkungan dan manufaktur terintegrasi.',
    locale,
    path: '/tentang-kami',
  });
}

export default async function TentangKamiPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const search = searchParams ? await searchParams : undefined;
  const initialTab = search?.tab || 'sejarah';

  return await TentangKamiHubView({ locale, initialTab });
}

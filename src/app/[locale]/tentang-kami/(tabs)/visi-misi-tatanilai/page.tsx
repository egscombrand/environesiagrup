import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';

const ROUTE = findTentangKamiRoute('visi-misi-tatanilai');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ title: ROUTE.label, description: ROUTE.metaDescription, locale, path: `/tentang-kami/${ROUTE.slug}` });
}

export default async function VisiMisiTataNilaiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

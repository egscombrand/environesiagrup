import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { getLegalitasPage } from '@/lib/cms/legalitas-page';

const ROUTE = findTentangKamiRoute('legalitas');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getLegalitasPage();
  return buildMetadata({ title: content.metaTitle, description: content.metaDescription, locale, path: `/tentang-kami/${ROUTE.slug}` });
}

export default async function LegalitasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

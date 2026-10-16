import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { getStruktur } from '@/lib/cms/struktur-organisasi';

const ROUTE = findTentangKamiRoute('struktur-organisasi');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getStruktur();
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    locale,
    path: `/tentang-kami/${ROUTE.slug}`,
  });
}

export default async function StrukturOrganisasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

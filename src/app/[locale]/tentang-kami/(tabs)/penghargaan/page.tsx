import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { getPenghargaan } from '@/lib/cms/penghargaan';

const ROUTE = findTentangKamiRoute('penghargaan');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getPenghargaan();
  return buildMetadata({ title: content.metaTitle, description: content.metaDescription, locale, path: `/tentang-kami/${ROUTE.slug}` });
}

export default async function PenghargaanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

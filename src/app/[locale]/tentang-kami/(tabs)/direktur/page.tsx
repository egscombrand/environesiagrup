import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { getDirektur } from '@/lib/cms/leadership-profile';

const ROUTE = findTentangKamiRoute('direktur');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getDirektur();
  return buildMetadata({ title: content.metaTitle, description: content.metaDescription, locale, path: `/tentang-kami/${ROUTE.slug}` });
}

export default async function DirekturPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

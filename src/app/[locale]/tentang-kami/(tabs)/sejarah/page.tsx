import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { TentangKamiHubView } from '@/components/tentang-kami/hub-view';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { getSejarah } from '@/lib/cms/sejarah';

// URL stays /tentang-kami/sejarah — it renders the same shared Tentang Kami
// experience as the hub, just pre-selected to this tab, so a direct link,
// bookmark, or refresh never shows a bare standalone page.
const ROUTE = findTentangKamiRoute('sejarah');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getSejarah();
  return buildMetadata({ title: content.metaTitle, description: content.metaDescription, locale, path: `/tentang-kami/${ROUTE.slug}` });
}

export default async function SejarahPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await TentangKamiHubView({ locale, initialTab: ROUTE.slug });
}

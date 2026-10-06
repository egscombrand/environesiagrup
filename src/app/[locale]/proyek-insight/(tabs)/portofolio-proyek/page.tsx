import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { ProyekInsightHubView } from '@/components/proyek-insight/hub-view';
import { findProyekInsightRoute } from '@/lib/proyek-insight-routes';

// URL stays /proyek-insight/portofolio-proyek — it renders the same shared
// Proyek & Insight experience as the hub, just pre-selected to this tab, so
// a direct link (the real CMS nav item), bookmark, or refresh never shows a
// bare standalone page. Same pattern as Tentang Kami's own tab pages
// (src/app/[locale]/tentang-kami/(tabs)/sejarah/page.tsx).
const ROUTE = findProyekInsightRoute('portofolio-proyek');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ title: ROUTE.label, description: ROUTE.metaDescription, locale, path: `/proyek-insight/${ROUTE.slug}` });
}

export default async function PortofolioProyekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await ProyekInsightHubView({ locale, initialTab: ROUTE.slug });
}

import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { ProyekInsightHubView } from '@/components/proyek-insight/hub-view';
import { findProyekInsightRoute } from '@/lib/proyek-insight-routes';

const ROUTE = findProyekInsightRoute('berita-perusahaan');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ title: ROUTE.label, description: ROUTE.metaDescription, locale, path: `/proyek-insight/${ROUTE.slug}` });
}

export default async function BeritaPerusahaanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return await ProyekInsightHubView({ locale, initialTab: ROUTE.slug });
}

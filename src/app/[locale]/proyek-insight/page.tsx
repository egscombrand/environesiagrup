import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { ProyekInsightHubView } from '@/components/proyek-insight/hub-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Proyek & Insight',
    description: 'Portofolio proyek, klien dan mitra, serta berita Environesia.',
    locale,
    path: '/proyek-insight',
  });
}

export default async function ProyekInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const search = searchParams ? await searchParams : undefined;
  const initialTab = search?.tab || 'portofolio-proyek';

  return await ProyekInsightHubView({ locale, initialTab });
}

import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { HeroSection } from '@/components/home/hero-section';
import { KeyStatsSection } from '@/components/home/key-stats-section';
import { EntityCards } from '@/components/home/entity-cards';
import { BusinessPillars } from '@/components/home/business-pillars';
import { CountryMapSection } from '@/components/home/country-map-section';
import { GreenBusinessSplit } from '@/components/home/green-business-split';
import { NewsCards } from '@/components/home/news-cards';
import { CTASection } from '@/components/home/cta-section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Deliberately a complete title, not the layout's %s template: Next skips
  // template propagation when layout and page share a folder (as here), and
  // a site root should lead with the brand, not the word "Beranda".
  return buildMetadata({
    title:
      'Environesia Company Group — Konsultasi, Pengujian, Pelatihan & Sertifikasi Lingkungan',
    description:
      'Environesia Company Group menaungi empat entitas layanan lingkungan dan satu unit penunjang.',
    locale,
    path: '/',
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <KeyStatsSection />
      <EntityCards locale={locale} />
      <BusinessPillars />
      <CountryMapSection />
      <GreenBusinessSplit />
      <NewsCards locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}

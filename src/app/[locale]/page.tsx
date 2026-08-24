import { HeroSection } from '@/components/home/hero-section';
import { KeyStatsSection } from '@/components/home/key-stats-section';
import { EntityCards } from '@/components/home/entity-cards';
import { BusinessPillars } from '@/components/home/business-pillars';
import { CountryMapSection } from '@/components/home/country-map-section';
import { GreenBusinessSplit } from '@/components/home/green-business-split';
import { NewsCards } from '@/components/home/news-cards';
import { CTASection } from '@/components/home/cta-section';

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

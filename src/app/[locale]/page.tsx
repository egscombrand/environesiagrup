import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { BRAND_TAGLINE } from '@/lib/site';
import { getPublishedPageSections, type SectionKey } from '@/lib/cms/pages';
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
    description: `${BRAND_TAGLINE}. Environesia Company Group menaungi lima entitas di bidang lingkungan dan manufaktur apparel.`,
    locale,
    path: '/',
  });
}

// Homepage is a guarded, admin-toggleable section builder (§18): the fixed
// component set below never changes, but which sections render — and in
// what order — comes from page_sections. No free-form HTML/JS is ever
// accepted from the admin, only enable/disable, reorder, and a title/
// subtitle override on the sections that have one.
type SectionProps = { locale: string; title?: string; subtitle?: string };

const SECTION_REGISTRY: Record<SectionKey, (props: SectionProps) => React.ReactNode> = {
  hero: ({ locale }) => <HeroSection locale={locale} />,
  stats: () => <KeyStatsSection />,
  entities: ({ locale, title }) => <EntityCards locale={locale} title={title} />,
  pillars: ({ title }) => <BusinessPillars title={title} />,
  map: ({ title }) => <CountryMapSection title={title} />,
  green_business: () => <GreenBusinessSplit />,
  news: ({ locale, title }) => <NewsCards locale={locale} title={title} />,
  cta: ({ locale, title, subtitle }) => <CTASection locale={locale} title={title} subtitle={subtitle} />,
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const sections = await getPublishedPageSections('home');

  return (
    <>
      {sections.map((section) => {
        const render = SECTION_REGISTRY[section.section_key];
        if (!render) return null;
        return (
          <div key={section.id}>
            {render({
              locale,
              title: section.title_override ?? undefined,
              subtitle: section.subtitle_override ?? undefined,
            })}
          </div>
        );
      })}
    </>
  );
}

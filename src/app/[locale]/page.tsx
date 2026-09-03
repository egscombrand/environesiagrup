import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { BRAND_TAGLINE } from '@/lib/site';
import { getPublishedPageSections, type SectionKey } from '@/lib/cms/pages';
import { HeroSection } from '@/components/home/hero-section';
import { KeyStatsSection } from '@/components/home/key-stats-section';
import { EcosystemDiagram } from '@/components/home/ecosystem-diagram';
import { BusinessPillars } from '@/components/home/business-pillars';
import { ProjectsShowcase } from '@/components/home/projects-showcase';
import { MilestonesTimeline } from '@/components/home/milestones-timeline';
import { LeadershipRoster } from '@/components/home/leadership-roster';
import { CountryMapSection } from '@/components/home/country-map-section';
import { LeadershipMessage } from '@/components/home/leadership-message';
import { SustainabilitySection } from '@/components/home/sustainability-section';
import { ClientsPartners } from '@/components/home/clients-partners';
import { CorporateInformation } from '@/components/home/corporate-information';
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
  hero: () => <HeroSection />,
  stats: ({ locale, title }) => <KeyStatsSection locale={locale} title={title} />,
  entities: ({ locale, title }) => <EcosystemDiagram locale={locale} title={title} />,
  pillars: ({ locale, title }) => <BusinessPillars locale={locale} title={title} />,
  projects_showcase: ({ locale, title }) => <ProjectsShowcase locale={locale} title={title} />,
  milestones: ({ locale, title }) => <MilestonesTimeline locale={locale} title={title} />,
  leadership: ({ locale, title }) => <LeadershipRoster locale={locale} title={title} />,
  map: ({ locale, title }) => <CountryMapSection locale={locale} title={title} />,
  leadership_message: ({ locale, title }) => <LeadershipMessage locale={locale} title={title} />,
  sustainability: ({ locale, title }) => <SustainabilitySection locale={locale} title={title} />,
  clients: ({ locale, title }) => <ClientsPartners locale={locale} title={title} />,
  documents: ({ locale, title }) => <CorporateInformation locale={locale} title={title} />,
  green_business: ({ locale }) => <GreenBusinessSplit locale={locale} />,
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

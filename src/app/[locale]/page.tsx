import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { BRAND_TAGLINE } from '@/lib/site';
import { getPublishedPageSections, type SectionKey } from '@/lib/cms/pages';
import { HeroSection } from '@/components/home/hero-section';
import { KeyStatsSection } from '@/components/home/key-stats-section';
import { CapabilitiesGrid } from '@/components/home/capabilities-grid';
import { GroupEcosystemBanner } from '@/components/home/group-ecosystem-banner';
import { BusinessProjectsDeck } from '@/components/home/business-projects-deck';
import { StandardsSection } from '@/components/tentang-kami/standards-section';
import { TrustedPartnersSection } from '@/components/home/trusted-partners';
import { CountryMapSection } from '@/components/home/country-map-section';
import { LeadershipMessage } from '@/components/home/leadership-message';
import { ClientsPartners } from '@/components/home/clients-partners';
import { GreenBusinessSplit } from '@/components/home/green-business-split';

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
      'Environesia — Konsultasi, Pengujian, Pelatihan & Sertifikasi Lingkungan',
    description: `${BRAND_TAGLINE}. Environesia menaungi lima entitas di bidang lingkungan dan manufaktur apparel.`,
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
  entities: ({ locale, title }) => <CapabilitiesGrid locale={locale} title={title} />,
  group_ecosystem: ({ locale, title }) => <GroupEcosystemBanner locale={locale} title={title} />,
  business_projects: ({ locale, title }) => <BusinessProjectsDeck locale={locale} title={title} />,
  standards: ({ locale, title }) => <StandardsSection locale={locale} title={title} />,
  trusted_partners: ({ locale, title }) => <TrustedPartnersSection locale={locale} title={title} />,
  // Permanently removed from the frontend — Kapabilitas, Proyek Unggulan,
  // Perjalanan Kami/Pencapaian & Tonggak Sejarah, Pimpinan, Keberlanjutan &
  // Dampak, Berita & Wawasan, and Informasi Korporat. Their page_sections
  // rows and CMS content stay in the database untouched; these keys just
  // render nothing, ever, regardless of admin toggle state, and the
  // components themselves are deleted so nothing here is even loaded.
  pillars: () => null,
  projects_showcase: () => null,
  milestones: () => null,
  leadership: () => null,
  map: ({ locale, title }) => <CountryMapSection locale={locale} title={title} />,
  leadership_message: ({ locale, title }) => <LeadershipMessage locale={locale} title={title} />,
  sustainability: () => null,
  clients: ({ locale, title }) => <ClientsPartners locale={locale} title={title} />,
  documents: () => null,
  green_business: ({ locale }) => <GreenBusinessSplit locale={locale} />,
  news: () => null,
  // Also permanently removed: the closing "Mari berdiskusi tentang
  // kebutuhan Anda" contact CTA banner. Same pattern as the other removed
  // sections above — page_sections row and CMS content stay in the
  // database untouched, this key just renders nothing.
  cta: () => null,
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const sections = await getPublishedPageSections('home');

  return (
    <>
      {sections.map((section) => {
        const render = SECTION_REGISTRY[section.section_key];
        if (!render) return null;
        const content = render({
          locale,
          title: section.title_override ?? undefined,
          subtitle: section.subtitle_override ?? undefined,
        });
        // A removed section resolves to null — skip the wrapper entirely so
        // it leaves no element in the DOM at all, not even an empty <div>.
        if (content === null) return null;
        return <div key={section.id}>{content}</div>;
      })}
    </>
  );
}

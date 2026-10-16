import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getGovernanceContent } from '@/lib/cms/governance-content';
import { GovernanceNav } from '@/components/tata-kelola-keberlanjutan/governance-nav';
import { GovernanceOverview } from '@/components/tata-kelola-keberlanjutan/governance-overview';
import { GovernanceHero } from '@/components/tata-kelola-keberlanjutan/governance-hero';
import { TataKelolaGovernanceSection } from '@/components/tata-kelola-keberlanjutan/governance-section';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getGovernanceContent(locale);

  return buildMetadata({
    title: pages['tata-kelola'].metaTitle,
    description: pages['tata-kelola'].metaDescription,
    locale,
    path: '/tata-kelola-keberlanjutan/tata-kelola',
  });
}

export default async function TataKelolaPerusahaanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getGovernanceContent(locale);
  const page = content.pages['tata-kelola'];

  return (
    <>
      {/* Section 1: hero */}
      <GovernanceHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        desktopImage={content.hero.desktopImage}
        mobileImage={content.hero.mobileImage}
      />

      {/* Section 2: overview of the seven governance pillars */}
      <GovernanceOverview {...content.kerangka} />

      {/* Section 3: navigation hub */}
      <GovernanceNav locale={locale} />

      {/* Section 4+: principles for this page */}
      <TataKelolaGovernanceSection heading={page.extraLabel} principles={page.items} />
    </>
  );
}

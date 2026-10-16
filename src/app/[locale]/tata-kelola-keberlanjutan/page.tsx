import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getGovernanceContent } from '@/lib/cms/governance-content';
import { GovernanceOverview } from '@/components/tata-kelola-keberlanjutan/governance-overview';
import { GovernanceHero } from '@/components/tata-kelola-keberlanjutan/governance-hero';
import { GovernanceNav } from '@/components/tata-kelola-keberlanjutan/governance-nav';
import { TataKelolaGovernanceSection } from '@/components/tata-kelola-keberlanjutan/governance-section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { hero } = await getGovernanceContent(locale);

  return buildMetadata({
    title: hero.metaTitle,
    description: hero.metaDescription,
    locale,
    path: '/tata-kelola-keberlanjutan',
  });
}

export default async function TataKelolaKeberlanjutanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getGovernanceContent(locale);
  const tataKelola = content.pages['tata-kelola'];

  return (
    <>
      <GovernanceHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        desktopImage={content.hero.desktopImage}
        mobileImage={content.hero.mobileImage}
      />

      {/* Section 2: overview of the seven governance pillars */}
      <GovernanceOverview {...content.kerangka} />
      <GovernanceNav locale={locale} />
      <TataKelolaGovernanceSection heading={tataKelola.extraLabel} principles={tataKelola.items} />
    </>
  );
}

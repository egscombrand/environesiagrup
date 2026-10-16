import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getGovernanceContent } from '@/lib/cms/governance-content';
import { GovernanceContext } from '@/components/tata-kelola-keberlanjutan/governance-context';
import { GovernanceItemList } from '@/components/tata-kelola-keberlanjutan/governance-item-list';
import { GovernanceNav } from '@/components/tata-kelola-keberlanjutan/governance-nav';
import { GovernanceNote } from '@/components/tata-kelola-keberlanjutan/governance-note';
import { GovernanceOverview } from '@/components/tata-kelola-keberlanjutan/governance-overview';
import { GovernanceHero } from '@/components/tata-kelola-keberlanjutan/governance-hero';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getGovernanceContent(locale);

  return buildMetadata({
    title: pages.kebijakan.metaTitle,
    description: pages.kebijakan.metaDescription,
    locale,
    path: '/tata-kelola-keberlanjutan/kebijakan',
  });
}

export default async function KebijakanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getGovernanceContent(locale);
  const page = content.pages.kebijakan;

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

      {/* Section 4+: context */}
      {page.description ? <GovernanceContext>{page.description}</GovernanceContext> : null}

      {/* Section 3: navigation hub */}
      <GovernanceNav locale={locale} />

      {/* Section 4+: content */}
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-8 md:py-16">
        <GovernanceItemList items={page.items} />
        {page.extraText ? <GovernanceNote label={page.extraLabel} text={page.extraText} /> : null}
      </div>
    </>
  );
}

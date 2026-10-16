import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getGovernanceContent } from '@/lib/cms/governance-content';
import { GovernanceContext } from '@/components/tata-kelola-keberlanjutan/governance-context';
import { GovernanceFlow } from '@/components/tata-kelola-keberlanjutan/governance-flow';
import { GovernanceNav } from '@/components/tata-kelola-keberlanjutan/governance-nav';
import { GovernanceOverview } from '@/components/tata-kelola-keberlanjutan/governance-overview';
import { GovernanceHero } from '@/components/tata-kelola-keberlanjutan/governance-hero';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getGovernanceContent(locale);

  return buildMetadata({
    title: pages['manajemen-risiko'].metaTitle,
    description: pages['manajemen-risiko'].metaDescription,
    locale,
    path: '/tata-kelola-keberlanjutan/manajemen-risiko',
  });
}

export default async function ManajemenRisikoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getGovernanceContent(locale);
  const page = content.pages['manajemen-risiko'];

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
        <GovernanceFlow steps={page.steps} />

        {page.tags.length > 0 ? (
          <div className="mt-14 border-t border-[#DDE5E7] pt-8 md:mt-16">
            {page.extraLabel ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#666666]">{page.extraLabel}</p>
            ) : null}
            <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {page.tags.map((tag) => (
                <li key={tag} className="border-b border-[#EEF1F0] pb-3 text-[15px] text-[#0B2B22]">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}

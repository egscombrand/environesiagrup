import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getGovernanceContent } from '@/lib/cms/governance-content';
import { GovernanceContext } from '@/components/tata-kelola-keberlanjutan/governance-context';
import { GovernanceNav } from '@/components/tata-kelola-keberlanjutan/governance-nav';
import { GovernanceOverview } from '@/components/tata-kelola-keberlanjutan/governance-overview';
import { GovernanceHero } from '@/components/tata-kelola-keberlanjutan/governance-hero';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getGovernanceContent(locale);

  return buildMetadata({
    title: pages['nilai-budaya'].metaTitle,
    description: pages['nilai-budaya'].metaDescription,
    locale,
    path: '/tata-kelola-keberlanjutan/nilai-budaya',
  });
}

export default async function NilaiBudayaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getGovernanceContent(locale);
  const page = content.pages['nilai-budaya'];

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

      {/* Section 4+: content. Core values are plain text: no icon or image asset exists for them. */}
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-8 md:py-16">
        <ol className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {page.items.map((value, index) => (
            <li key={`${index}-${value.title}`} className="group min-w-0 border-t-2 border-[#01B3A1] pt-5">
              <span className="text-[12px] font-semibold tabular-nums tracking-[0.1em] text-[#666666]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 break-words font-landing-display text-h3 font-bold text-[#0B2B22] transition-colors duration-300 group-hover:text-[#2A7793] motion-reduce:transition-none">
                {value.title}
              </h3>
              <p className="mt-2.5 text-small text-[#444444]">{value.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

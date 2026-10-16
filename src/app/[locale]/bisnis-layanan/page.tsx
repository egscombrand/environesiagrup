import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { BisnisLayananHero } from '@/components/bisnis-layanan/hero';
import { EcosystemSection } from '@/components/bisnis-layanan/ecosystem-section';
import { BrandTabsSection } from '@/components/bisnis-layanan/brand-tabs-section';
import { getBisnisLayanan } from '@/lib/cms/bisnis-layanan';

// The "Bisnis & Ekosistem" nav item (header + footer) links here with no
// sub-path, but only /bisnis-layanan/{slug} (one page per entity) existed,
// so the bare parent URL 404'd. Sections 1-3 (hero, ecosystem map, brand
// tabs) are built; further sections are still to come. A fourth section,
// "Ekosistem yang Terus Bertumbuh", was removed for repeating the same
// ground as the ecosystem map and brand showcase around it.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { hero } = await getBisnisLayanan();

  return buildMetadata({
    title: hero.metaTitle,
    description: hero.metaDescription,
    locale,
    path: '/bisnis-layanan',
  });
}

export default async function BisnisLayananPage() {
  const [heroSection, ecosystemSection, brandTabsSection] = await Promise.all([
    BisnisLayananHero(),
    EcosystemSection(),
    BrandTabsSection(),
  ]);

  return (
    <>
      {heroSection}
      {ecosystemSection}
      {brandTabsSection}
    </>
  );
}

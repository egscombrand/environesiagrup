import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { BisnisLayananHero } from '@/components/bisnis-layanan/hero';
import { EcosystemSection } from '@/components/bisnis-layanan/ecosystem-section';
import { GrowingEcosystemSection } from '@/components/bisnis-layanan/growing-ecosystem-section';
import { BrandTabsSection } from '@/components/bisnis-layanan/brand-tabs-section';

// The "Bisnis & Ekosistem" nav item (header + footer) links here with no
// sub-path, but only /bisnis-layanan/{slug} (one page per entity) existed,
// so the bare parent URL 404'd. Sections 1-4 (hero, ecosystem map, growing
// ecosystem, brand tabs) are built; further sections are still to come.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: 'Bisnis Ekonomi',
    description: 'Halaman Bisnis Ekonomi Environesia Company Group.',
    locale,
    path: '/bisnis-layanan',
  });
}

export default async function BisnisLayananPage() {
  const [ecosystemSection, brandTabsSection] = await Promise.all([EcosystemSection(), BrandTabsSection()]);

  return (
    <>
      <BisnisLayananHero />
      {ecosystemSection}
      <GrowingEcosystemSection />
      {brandTabsSection}
    </>
  );
}

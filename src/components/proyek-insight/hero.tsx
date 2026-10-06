import { HeroPhoto } from '@/components/hero-photo';
import { findProyekInsightRoute } from '@/lib/proyek-insight-routes';

// Same real office building photo and full-bleed hero pattern as Tentang
// Kami's and Bisnis & Layanan's own heroes — see
// src/components/tentang-kami/hero-banner.tsx for why the photo layer is
// aspect-ratio-locked rather than a fixed height.
//
// Unlike those two (one fixed heading regardless of which tab is active),
// this hero's small label/subheading change with the active tab —
// "Proyek & Insight" has four real, distinct children in the CMS
// navigation (Portofolio Proyek, Klien & Mitra, Berita Perusahaan, Siaran
// Pers), each its own topic, not sub-views of one fixed group identity.
//
// Typographic hierarchy is deliberate: "Proyek & Insight" (the section
// itself) is always the primary, largest heading; the active tab's own
// name is the small label above it, not the other way around — the tab
// name previously carried the h1 and visually overpowered the section
// identity it belongs to.
export function ProyekInsightHero({ activeSlug }: { activeSlug: string }) {
  const route = findProyekInsightRoute(activeSlug);

  return (
    <section className="relative -mt-[var(--header-h)] grid w-full bg-pine-ink">
      <div className="relative col-start-1 row-start-1 w-full self-stretch overflow-hidden md:aspect-[3640/1610] md:self-start">
        <HeroPhoto />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-ink/40 via-pine-ink/5 to-pine-ink/60" />
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[calc(26rem+var(--header-h))] items-center justify-center px-6 pt-[var(--header-h)] text-center md:min-h-[calc(30rem+var(--header-h))]">
        <div className="mx-auto max-w-3xl">
          <p className="font-landing-body text-[14px] font-semibold text-white md:text-[15px]">{route.label}</p>
          <h1 className="mt-4 font-landing-display text-[40px] font-bold leading-[1.1] text-white md:text-[56px]">
            Proyek & Insight
          </h1>
          <p className="mt-4 font-landing-body text-[17px] font-semibold text-white/90 md:text-[20px]">
            {route.heroSubheading}
          </p>
        </div>
      </div>
    </section>
  );
}

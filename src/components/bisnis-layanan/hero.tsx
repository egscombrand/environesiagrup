import { HeroPhoto } from '@/components/hero-photo';
import { getBisnisLayanan } from '@/lib/cms/bisnis-layanan';

// Same real office building photo and full-bleed hero pattern as Tentang
// Kami's own hero (src/components/tentang-kami/hero-banner.tsx) — the photo
// layer self-stretches to match the title layer's ~50vh min-height at every
// breakpoint, rather than keeping its own aspect ratio. Kept as a separate
// component (not shared) since the two pages' heading/copy will diverge as
// this page grows past its placeholder stage.
export async function BisnisLayananHero() {
  const { hero } = await getBisnisLayanan();

  return (
    <section className="relative -mt-[var(--header-h)] grid w-full bg-pine-ink">
      <div className="relative col-start-1 row-start-1 w-full self-stretch overflow-hidden">
        <HeroPhoto />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-ink/40 via-pine-ink/5 to-pine-ink/60" />
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[calc(50vh+var(--header-h))] items-center justify-center px-6 pt-[var(--header-h)] text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-landing-display text-display font-bold text-white">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-body text-white/90">{hero.description}</p>
        </div>
      </div>
    </section>
  );
}

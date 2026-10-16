import { messagesFor } from '@/i18n/messages';
import { HeroPhoto } from '@/components/hero-photo';

/**
 * Tentang Kami's own full-bleed hero — the real office building photo
 * (public/BannerS2.jpg), a centered white headline/subheading, and the
 * fixed header floating transparent over it.
 *
 * The photo and the title live in the same CSS grid cell (stacked, not
 * one constraining the other's box): the photo layer always `self-stretch`es
 * to the row's height, and the title layer's own `min-h-[calc(50vh+...)]` is
 * what actually sets that height — so the whole hero, photo included, stays
 * pinned to ~50vh at every breakpoint instead of the photo's own aspect
 * ratio (3640/1610) dictating a taller box on wide screens. `object-cover`
 * on the photo (see HeroPhoto) means it always fills that box cleanly,
 * cropped as needed, never stretched or distorted.
 *
 * `-mt-[var(--header-h)]` cancels the layout's usual header offset so
 * the photo sits directly under the header rather than below a gap; the
 * title layer's own `pt-[var(--header-h)]` then keeps the heading clear
 * of the header regardless of which of the two heights above is driving
 * the row.
 */
export function TentangKamiHero({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <section className="relative -mt-[var(--header-h)] grid w-full bg-pine-ink">
      <div className="relative col-start-1 row-start-1 w-full self-stretch overflow-hidden">
        <HeroPhoto />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-ink/40 via-pine-ink/5 to-pine-ink/60" />
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[calc(50vh+var(--header-h))] items-center justify-center px-6 pt-[var(--header-h)] text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-landing-display text-display font-bold text-white">
            {t.tentangKami.heroHeading}
          </h1>
          <p className="mt-4 font-landing-body text-[20px] font-bold text-white/90 md:text-[24px]">
            {t.tentangKami.heroSubheading}
          </p>
        </div>
      </div>
    </section>
  );
}

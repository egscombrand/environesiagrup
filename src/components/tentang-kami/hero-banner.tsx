import Image from 'next/image';
import { messagesFor } from '@/i18n/messages';

// The real photo's own proportions (3640×1610) — used to lock the photo
// layer's height to its true aspect ratio at whatever width it renders,
// so it is always shown complete: full width, no crop, no zoom past its
// own resolution, and (unlike a fixed-height box) never letterboxed with
// empty bars on the sides either.
const PHOTO_ASPECT = '3640/1610';

/**
 * Tentang Kami's own full-bleed hero — the real office building photo
 * (public/BannerS2.jpg), a centered white headline/subheading, and the
 * fixed header floating transparent over it.
 *
 * The photo and the title live in the same CSS grid cell (stacked, not
 * one constraining the other's box): the photo layer is `self-start` and
 * aspect-ratio-locked, so its own height is always exactly
 * width ÷ 3640/1610 — never stretched, never cropped to fill a taller
 * box. The title layer instead carries a `min-height`, so on a wide
 * screen (where the photo's natural height already exceeds that
 * minimum) the grid row's height is driven by the photo and the title
 * overlays it centered, the classic hero look; on a narrow, tall mobile
 * screen (where a 2.26:1 photo is naturally quite short at full width)
 * the row instead grows to the title's minimum, and the extra height
 * beneath the now-short photo is filled by the section's own solid
 * pine-ink background — a soft gradient blends the two — rather than
 * ever stretching or cropping the photo to reach a fixed height.
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
      <div
        className="relative col-start-1 row-start-1 w-full self-start overflow-hidden"
        style={{ aspectRatio: PHOTO_ASPECT }}
      >
        <Image src="/BannerS2.jpg" alt="" fill priority quality={100} sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-ink/40 via-pine-ink/5 to-pine-ink/60" />
      </div>

      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[calc(26rem+var(--header-h))] items-center justify-center px-6 pt-[var(--header-h)] text-center md:min-h-[calc(30rem+var(--header-h))]">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-landing-display text-[44px] font-bold leading-[1.1] text-white md:text-[60px]">
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

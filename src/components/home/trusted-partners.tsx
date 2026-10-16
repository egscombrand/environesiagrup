import Image from 'next/image';
import { getPublishedStats } from '@/lib/cms/stats';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { TrustedPartnersStats, type TrustedPartnersStatItem } from './trusted-partners-stats';

const ACCENT = '#0DA19D';

type Partner = {
  src: string;
  alt: string;
  /** The PNG's real intrinsic pixel size, not the rendered size — passing
   * these (rather than a small display-size hint) to next/image is what
   * keeps the optimizer from pre-downscaling and serving a blurry asset. */
  width: number;
  height: number;
};

// Real client/partner logos, sourced directly from the group's own asset
// folder — never a stock or placeholder mark. Split across two marquee
// rows. Every logo now renders inside the same fixed-size frame (see
// `LOGO_FRAME` below) rather than a per-logo size tier, so no name reads
// as visually bigger or smaller than another regardless of its source
// file's own aspect ratio.
const ROW_A: Partner[] = [
  { src: '/partners/pertamina.png', alt: 'Pertamina', width: 3041, height: 708 },
  { src: '/partners/siloam-hospitals.png', alt: 'Siloam Hospitals', width: 2586, height: 676 },
  { src: '/partners/adb.png', alt: 'Asian Development Bank', width: 1211, height: 794 },
  { src: '/partners/google.png', alt: 'Google', width: 1837, height: 622 },
  { src: '/partners/pt-kai.png', alt: 'PT Kereta Api Indonesia (KAI)', width: 1004, height: 461 },
  { src: '/partners/kemenhut.png', alt: 'Kementerian Kehutanan Republik Indonesia', width: 1900, height: 766 },
  { src: '/partners/bridgestone.png', alt: 'Bridgestone', width: 2881, height: 356 },
  { src: '/partners/bappenas.png', alt: 'Kementerian PPN/Bappenas', width: 1133, height: 793 },
  { src: '/partners/powerchina.png', alt: 'PowerChina', width: 659, height: 701 },
  { src: '/partners/kemenkes.png', alt: 'Kementerian Kesehatan Republik Indonesia', width: 1065, height: 799 },
  { src: '/partners/rsud-sleman.png', alt: 'RSUD Sleman', width: 607, height: 822 },
];

const ROW_B: Partner[] = [
  { src: '/partners/wika.png', alt: 'PT Wijaya Karya (Persero) Tbk.', width: 1047, height: 798 },
  { src: '/partners/astra-honda.png', alt: 'PT Astra Honda Motor', width: 1781, height: 594 },
  { src: '/partners/shopee.png', alt: 'Shopee', width: 1888, height: 605 },
  { src: '/partners/mrt-jakarta.png', alt: 'MRT Jakarta', width: 1044, height: 763 },
  { src: '/partners/suzuki.png', alt: 'Suzuki', width: 2589, height: 505 },
  { src: '/partners/adhi-karya.png', alt: 'PT Adhi Karya (Persero) Tbk.', width: 800, height: 799 },
  { src: '/partners/kkp.png', alt: 'Kementerian Kelautan dan Perikanan', width: 852, height: 796 },
  { src: '/partners/gft-group.png', alt: 'GFT Group', width: 951, height: 795 },
  { src: '/partners/asdp.png', alt: 'ASDP Indonesia Ferry', width: 1153, height: 793 },
  { src: '/partners/klh.png', alt: 'Kementerian Lingkungan Hidup', width: 802, height: 796 },
  { src: '/partners/quick.png', alt: 'Quick', width: 2042, height: 630 },
  { src: '/partners/rs-mata-dr-yap.png', alt: 'Rumah Sakit Mata "Dr. YAP" Yogyakarta', width: 794, height: 794 },
];

// One shared frame every logo sits inside — same width and height for all
// of them, regardless of the source file's own aspect ratio. The image
// itself uses `object-contain` within it (never `cover`/stretch), so a
// very wide banner logo and a very tall/square mark both scale down
// proportionally to fit the same box instead of one visually dwarfing
// the other.
const LOGO_FRAME = 'flex h-14 w-[132px] shrink-0 items-center justify-center py-2 md:h-[72px] md:w-[176px]';

function MarqueeRow({ row, direction }: { row: Partner[]; direction: 'ltr' | 'rtl' }) {
  // The track is the row duplicated exactly twice — see the keyframe
  // comment in globals.css for why that's what makes the loop seamless.
  const track = [...row, ...row];

  return (
    <div className="partner-marquee-row overflow-hidden">
      <div
        className={`partner-marquee-track partner-marquee-${direction} flex w-max items-center gap-x-8 md:gap-x-10`}
      >
        {track.map((partner, index) => (
          <div key={`${partner.src}-${index}`} className={LOGO_FRAME}>
            <Image
              src={partner.src}
              alt={partner.alt}
              width={partner.width}
              height={partner.height}
              quality={100}
              className="h-full w-full object-contain transition-transform duration-[260ms] ease-out hover:scale-[1.05] hover:drop-shadow-[0_6px_14px_rgba(11,43,34,0.14)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * "Dipercaya oleh Berbagai Mitra" — a social-proof trust wall directly below
 * the standards section. Visual order is heading → the 3 trust numbers
 * (counting up together the first time they enter view) → the logo
 * marquee, so the scale claim lands before the logos back it up. Logos
 * render in their real brand colors (no grayscale/tint) with two
 * opposite-direction marquee rows (pure CSS, `translate3d`, no JS animation
 * loop — see globals.css). The numbers are pulled from the same `stats`
 * table the homepage's own key-stats strip uses — matched by icon, since
 * their labels there aren't consistently localized — and simply don't
 * render if that data isn't published, rather than ever showing a
 * fabricated figure.
 */
export async function TrustedPartnersSection({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const stats = await getPublishedStats();

  const statItems: TrustedPartnersStatItem[] = (
    [
      { stat: stats.find((s) => s.icon === 'folder-check'), label: t.beranda.trustedPartnersStatProyek },
      { stat: stats.find((s) => s.icon === 'map'), label: t.beranda.trustedPartnersStatProvinsi },
      { stat: stats.find((s) => s.icon === 'globe'), label: t.beranda.trustedPartnersStatNegara },
    ] as const
  )
    .filter((item): item is { stat: NonNullable<(typeof item)['stat']>; label: string } => Boolean(item.stat))
    .map(({ stat, label }) => ({
      id: stat.id,
      value: stat.value,
      prefix: stat.prefix,
      suffix: stat.suffix,
      label,
    }));

  return (
    <Section className="bg-white">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-label uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
            {t.beranda.trustedPartnersEyebrow}
          </p>
          <h2 className="mt-2 font-landing-display text-h2 font-bold" style={{ color: '#1A1A1A' }}>
            {title ?? 'Kepercayaan Pelanggan adalah Bahan Bakar Kami untuk Terus Berkarya'}
          </h2>
          <p className="mt-4 font-landing-body text-body text-pine-ink/70">
            Kepercayaan yang diberikan oleh pelanggan dan berbagai mitra menjadi dorongan bagi Environesia
            untuk terus memberikan layanan terbaik, menjaga standar profesionalisme, dan menghadirkan solusi
            lingkungan yang memberikan nilai nyata dan berkelanjutan.
          </p>
        </div>
      </Reveal>

      {statItems.length > 0 && (
        <Reveal>
          <div className="mt-12">
            <TrustedPartnersStats items={statItems} />
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="mt-14 space-y-8 md:space-y-10">
          <MarqueeRow row={ROW_A} direction="ltr" />
          <MarqueeRow row={ROW_B} direction="rtl" />
        </div>
      </Reveal>
    </Section>
  );
}

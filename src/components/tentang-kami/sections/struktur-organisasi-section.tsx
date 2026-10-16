import Image from 'next/image';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { getStruktur } from '@/lib/cms/struktur-organisasi';
import { STRUKTUR_FALLBACK } from '@/lib/cms/struktur-organisasi-content';

/**
 * Framed as the group's own structure — how its entities connect and
 * complement each other — rather than an internal personnel hierarchy
 * (CEO → Direktur → Manager → Staff), which reads as an operations
 * dashboard, not a group company profile. The one real chart asset
 * available today happens to be a personnel org chart for PT Environesia
 * Global Saraya specifically, not a group-level ecosystem diagram — shown
 * as-is (no fabricated new diagram) while the copy around it speaks to
 * the group level; a proper group-structure visual can replace it later
 * without changing this section's shape.
 */
export async function StrukturOrganisasiSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const content = await getStruktur();

  return (
    <>
      {/* Heading block on its own, tightly spaced — the photo below is
          full-width, which only makes sense stacked underneath, never
          beside a text column narrow enough to shrink it. */}
      <Section className="pb-4 pt-10 md:pb-4 md:pt-14">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.tentangKami.judul}</p>
          <h1 className="mt-4 font-landing-display text-display font-bold text-pine-ink">{content.title}</h1>
        </Reveal>
      </Section>

      {/* The chart itself is the focal point — full content width, real
          aspect ratio preserved via `aspectRatio` + `object-contain`
          (never `cover`), so nothing in it is ever cropped or shrunk to
          fit a column. Just a hairline border to separate its own white
          background from the page's, not a padded/shadowed "card". */}
      <Section className="pb-10 pt-0 md:pb-14 md:pt-0">
        <Reveal>
          <div className="w-full overflow-hidden rounded-[8px] border border-line">
            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
              <Image
                src={content.imageSrc ?? STRUKTUR_FALLBACK.defaultImageSrc}
                alt={content.imageAlt}
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

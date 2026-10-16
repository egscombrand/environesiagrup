import Image from 'next/image';
import { getPublishedMilestones } from '@/lib/cms/milestones';
import { getSejarah } from '@/lib/cms/sejarah';
import { paragraphsOf, segmentsOf } from '@/lib/cms/sejarah-content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { PerjalananTimeline } from '@/components/tentang-kami/perjalanan-timeline';
import { messagesFor } from '@/i18n/messages';

const ACCENT = '#0DA19D';

/** A clearly-marked reserved photo area — never a fabricated stock image,
 * never "Coming Soon" text. A solid accent-color block, matched 1:1
 * against a supplied reference: a deliberately bold, obvious "replace me"
 * fill rather than a subtle gray box, so it reads unmistakably as a
 * placeholder rather than a rendering bug. No real asset exists yet for
 * any of these three narrative beats. */
function PhotoPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`aspect-[4/3] w-full rounded-[16px] ${className}`}
      style={{ backgroundColor: ACCENT }}
      role="img"
      aria-label="Foto akan ditambahkan"
    />
  );
}

const NARRATIVE_CLASS =
  'space-y-4 text-justify font-landing-body text-[17px] leading-[1.7] text-pine-ink/80 md:text-[18px]';

/** A text block: its paragraphs, with `**…**` rendered as bold. */
function NarrativeText({ text }: { text: string }) {
  return (
    <div className={NARRATIVE_CLASS}>
      {paragraphsOf(text).map((paragraph, i) => (
        <p key={i}>
          {segmentsOf(paragraph).map((segment, j) =>
            segment.bold ? (
              <strong key={j} className="font-bold text-pine-ink">
                {segment.text}
              </strong>
            ) : (
              <span key={j}>{segment.text}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

/** A stored photo when one is set, otherwise the placeholder. */
function Photo({ src }: { src: string | null }) {
  if (!src) return <PhotoPlaceholder />;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px]">
      <Image src={src} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
    </div>
  );
}

/**
 * The actual "Perjalanan Kami" content — shared by its own dedicated route
 * (/tentang-kami/sejarah, for direct links and its own metadata) and the
 * Tentang Kami hub page, which shows this same content by default under
 * the tab nav rather than duplicating it inline.
 *
 * The heading copy here ("Satu Dekade Environesia") is its own, separate
 * from the tab's own name ("Perjalanan Kami", still used for the nav
 * label and this route's SEO title elsewhere) — the eyebrow keeps that
 * tab identity, while the H1/description tell the actual editorial
 * story. Left-aligned on purpose, as an editorial intro sitting above the
 * (centered) timeline visual, not another centered hero.
 *
 * Exactly two layers, by explicit instruction — a third "Milestone
 * Perjalanan" highlight reel existed here briefly and was removed because
 * it re-stated the same real dates as both neighbors, reading as
 * duplicated information: "Sekilas Environesia" (the full 6-paragraph
 * editorial narrative, in 3 alternating text/photo blocks) → the existing
 * year-by-year interactive timeline (chronological detail, untouched).
 * Never re-add a third summary layer between them.
 */
export async function PerjalananKamiSection({
  locale,
  milestones: propMilestones,
}: {
  locale: string;
  milestones?: Awaited<ReturnType<typeof getPublishedMilestones>>;
}) {
  const t = messagesFor(locale);
  const [milestones, content] = await Promise.all([
    propMilestones ? Promise.resolve(propMilestones) : getPublishedMilestones(),
    getSejarah(),
  ]);
  const [block1, block2, block3] = content.blocks;

  return (
    <>
      <Section className="pt-6 pb-6 md:pt-6 md:pb-6">
        <Reveal className="text-left">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-slate">{content.eyebrow}</p>
          {/* Deliberately well below the standard H1 size (48px/text-display)
              — this is a compact page-intro kicker under the eyebrow label
              above, not the page's visual lead heading, so it's sized down
              near H4 instead. Documented exception, not a drifted H1. */}
          <h1 className="mt-3 font-landing-display text-[18px] font-extrabold sm:text-[20px]" style={{ color: '#1A1A1A' }}>
            {content.title}
          </h1>
          <p className="mt-3 max-w-2xl font-landing-body text-body text-pine-ink/70">{content.lead}</p>
        </Reveal>
      </Section>

      <Section className="pt-0 pb-8 md:pt-0 md:pb-10">
        <Reveal className="text-left">
          <h2 className="font-landing-display text-h2 font-bold text-pine-ink">{content.sekilasLabel}</h2>
        </Reveal>

        {/* Blok 1: narasi kiri, foto kanan pada desktop. Mobile: narasi di atas, foto di bawah. */}
        <Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-[3fr_2fr] md:items-center md:gap-10">
            <NarrativeText text={block1.text} />
            <Photo src={content.photos[0]} />
          </div>
        </Reveal>

        {/* Blok 2: dibalik, foto kiri dan narasi kanan. Mobile: foto di atas, narasi di bawah. */}
        <Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-[2fr_3fr] md:items-center md:gap-10">
            <Photo src={content.photos[1]} />
            <NarrativeText text={block2.text} />
          </div>
        </Reveal>

        {/* Blok 3: penutup, lebar penuh, tanpa foto dan tanpa kotak. */}
        <Reveal>
          <div className="mt-12">
            <NarrativeText text={block3.text} />
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-landing-body text-[14px] font-semibold tracking-[0.04em]" style={{ color: '#01B3A1' }}>
              {content.timeline.eyebrow}
            </p>
            <h2
              className="mx-auto mt-2 max-w-[620px] font-landing-display text-display font-extrabold"
              style={{ color: '#111111', lineHeight: 1.15 }}
            >
              {content.timeline.title}
            </h2>
            <p className="mt-3 text-body text-pine-ink/70">{content.timeline.intro}</p>
          </div>
        </Reveal>
        {milestones.length > 0 ? (
          <div className="mt-4">
            <PerjalananTimeline milestones={milestones} />
          </div>
        ) : (
          <div className="mt-6 rounded-[14px] border border-line bg-paper p-8">
            <p className="text-body text-ink">{t.common.pendingContent}</p>
          </div>
        )}
      </Section>
    </>
  );
}

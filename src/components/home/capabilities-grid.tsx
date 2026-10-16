import Image from 'next/image';
import Link from 'next/link';
import { getPublishedCoreEntities, type Entity } from '@/lib/cms/entities';
import { getSiteSettings } from '@/lib/cms/settings';
import { getPublishedNavigationUrlsBySlug } from '@/lib/cms/navigation';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { messagesFor } from '@/i18n/messages';

// A navigation item's `url` is never locale-prefixed in the database (same
// convention used wherever else this codebase turns one into a Link href).
function localeHref(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url === '/' ? '' : url}`;
}

// Sampled directly (pixel-measured) from the approved reference design —
// this grid is a literal 1:1 match to a supplied comp, not a reuse of the
// global heading/body palette, so these are deliberately one-off colors
// rather than existing design tokens. Reserved for the section heading only
// (Level 1) so it stays the single most prominent color in the section —
// company names (Level 2) and capability titles (Level 3) intentionally use
// more subdued, standard site colors instead of this one, per the section's
// typography hierarchy.
const HEADING_COLOR = 'text-[#2A7793]';
const BODY_COLOR = 'text-[#6F6F6F]';
const CTA_COLOR = 'text-[#01B3A1]';

function EntityCard({
  entity,
  locale,
  profileUrl,
  t,
}: {
  entity: Entity;
  locale: string;
  profileUrl: string | undefined;
  t: ReturnType<typeof messagesFor>;
}) {
  return (
    <div className="flex h-full flex-col rounded-[14px] border border-sage-mist bg-canvas p-5">
      {entity.logoUrl ? (
        <Image
          src={entity.logoUrl}
          alt={entity.name}
          width={280}
          height={80}
          className="h-14 w-auto self-start object-contain"
        />
      ) : (
        <p className={`font-landing-display text-h3 font-semibold ${HEADING_COLOR}`}>{entity.name}</p>
      )}

      {/* Capability title — pixel-measured against the reference:
          clearly smaller than the section heading (text-h3, not
          text-h2 — an earlier pass mis-measured this as equal to
          the heading because of a too-narrow sampling box), but
          shares the same accent color as the heading. */}
      {entity.capability_title ? (
        <h3 className={`mt-9 font-landing-display text-h3 font-semibold ${HEADING_COLOR}`}>
          {entity.capability_title}
        </h3>
      ) : null}

      {entity.capability_description ? (
        <p className={`mt-4 flex-1 font-landing-body text-small leading-relaxed ${BODY_COLOR}`}>
          {entity.capability_description}
        </p>
      ) : null}

      {profileUrl ? (
        <Link
          href={localeHref(profileUrl, locale)}
          className={`mt-6 inline-flex w-fit items-center gap-1 text-small font-medium ${CTA_COLOR} hover:underline`}
        >
          {t.beranda.kapabilitasBacaSelengkapnya} →
        </Link>
      ) : null}
    </div>
  );
}

/**
 * Section 02 — headline + description as their own full-width block, then
 * one card per published company below. When there are exactly the 5
 * entities the site has today, the cards render as a deliberate "3 + 2"
 * composition (three across, then two centered under them, same card
 * size) via a 6-column grid where each card spans 2 columns — the two
 * second-row cards start at columns 2 and 4 instead of 1 and 3, which is
 * what actually centers them under the row above rather than just
 * left-aligning a shorter row. Any other entity count (fewer, or a 6th
 * added later) falls back to a plain wrapping 3-column grid instead of
 * trying to generalize a "centered" shape that only really makes sense
 * for 5.
 */
export async function CapabilitiesGrid({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const [entities, settings, urlsBySlug] = await Promise.all([
    getPublishedCoreEntities(),
    getSiteSettings(),
    getPublishedNavigationUrlsBySlug('header'),
  ]);

  if (entities.length === 0) {
    return null;
  }

  return (
    <Section id="ekosistem" className="bg-canvas">
      <Reveal>
        <h2
          className={`max-w-[950px] break-words font-landing-display text-[30px] font-bold md:text-[38px] lg:text-[46px] ${HEADING_COLOR}`}
          style={{ lineHeight: 1.15 }}
        >
          {title ?? t.beranda.kapabilitasHeading}
        </h2>
        <p
          className={`mt-4 max-w-[1000px] font-landing-body text-[17px] md:text-[19px] lg:text-[20px] ${BODY_COLOR}`}
          style={{ lineHeight: 1.55 }}
        >
          {settings.capabilities_subtext || t.beranda.kapabilitasSubtext}
        </p>
      </Reveal>

      {entities.length === 5 ? (
        <RevealStagger className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
          {entities.map((entity, i) => {
            const startClass = i === 3 ? 'lg:col-start-2' : i === 4 ? 'lg:col-start-4' : '';
            return (
              <RevealItem key={entity.id} className={`lg:col-span-2 ${startClass}`}>
                <EntityCard entity={entity} locale={locale} profileUrl={urlsBySlug[entity.slug]} t={t} />
              </RevealItem>
            );
          })}
        </RevealStagger>
      ) : (
        <RevealStagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {entities.map((entity) => (
            <RevealItem key={entity.id}>
              <EntityCard entity={entity} locale={locale} profileUrl={urlsBySlug[entity.slug]} t={t} />
            </RevealItem>
          ))}
        </RevealStagger>
      )}
    </Section>
  );
}

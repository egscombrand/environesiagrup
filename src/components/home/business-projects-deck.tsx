import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublishedEntities } from '@/lib/cms/entities';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { BUSINESS_PROJECTS_DATA } from './business-projects-deck-data';
import { BusinessProjectsDeckClient, type EntityDeck } from './business-projects-deck-client';

const HEADING_COLOR = '#2A7793';
// Everything except the H1 and the closing statement reads as plain,
// near-black text — the brand color is reserved for the H1 so it stays
// the single most prominent color, per explicit follow-up feedback that
// description/label text must never share it.
const TEXT_COLOR = '#111111';
// The closing statement gets its own third color (not the H1's, not plain
// black) per explicit follow-up feedback — it's the section's second-most
// prominent moment, distinct from both.
const CLOSING_COLOR = '#3D8A9F';

/**
 * "Lini Bisnis dan Proyek Berjalan" — a 3D coverflow of entities above a
 * project showcase (text detail + photo carousel) for whichever entity is
 * active. The showcase never repeats the entity's own logo/name/description
 * — the coverflow above already establishes identity — so every pixel of
 * the panel below is spent on the project itself. Each entity's
 * name/logo/accent color always comes from the real CMS `entities` record
 * (matched by slug) — never hardcoded — while the project list itself is
 * structured data (BUSINESS_PROJECTS_DATA), since there's no live
 * "projects per entity" content model yet. Whichever entities have no
 * matching published CMS record simply don't render a card, so this never
 * breaks if an entity is renamed/unpublished.
 */
export async function BusinessProjectsDeck(props: { locale: string; title?: string }) {
  const { locale } = props;
  const t = messagesFor(locale);
  const entities = await getPublishedEntities();
  const entityBySlug = new Map(entities.map((entity) => [entity.slug, entity]));

  const entityDecks: EntityDeck[] = BUSINESS_PROJECTS_DATA.map((group): EntityDeck | null => {
    const entity = entityBySlug.get(group.entitySlug);
    if (!entity) return null;
    return {
      entitySlug: group.entitySlug,
      entityName: entity.name,
      entityLogoUrl: entity.logoUrl,
      accentColor: entity.accent_color ?? undefined,
      projects: group.projects,
    };
  }).filter((deck): deck is EntityDeck => deck !== null);

  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-sage-mist via-canvas to-sage-mist/60">
      {/* Full-width "visual rest" background — a graphic treatment (soft
          blurred brand-color fields), not a photo: every homepage section
          that has one uses a real, distinct photo, and this section has no
          photo of its own assigned to it yet, so a fabricated stock image
          would break the "distinct real photo per section" rule the rest of
          the page follows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full opacity-[0.10] blur-3xl"
        style={{ backgroundColor: '#0FA96B' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-[480px] w-[480px] rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: '#33C4C9' }}
      />

      <div className="relative text-center">
        <Reveal>
          <h2
            className="mx-auto max-w-[820px] break-words font-landing-display text-[34px] font-extrabold leading-[1.15] md:text-[42px] lg:text-[50px]"
            style={{ color: HEADING_COLOR }}
          >
            Satu Dekade Environesia Membangun Negeri
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl font-landing-body text-[18px] font-normal md:text-[20px] lg:text-[22px]"
            style={{ color: TEXT_COLOR, lineHeight: 1.55 }}
          >
            Memastikan Kepatuhan Lingkungan Menjadi Fondasi Utama dalam Mewujudkan Pembangunan Berkelanjutan
          </p>
        </Reveal>

        <Reveal>
          <p
            className="mt-8 font-landing-body text-[18px] font-normal uppercase tracking-[0.06em] md:text-[20px]"
            style={{ color: TEXT_COLOR }}
          >
            Proyek Unggulan Kami
          </p>
        </Reveal>

        {entityDecks.length === 0 ? (
          <Reveal>
            <p className="mt-6 text-small text-pine-ink/60">{t.beranda.businessProjectsEmpty}</p>
          </Reveal>
        ) : (
          <div className="mt-6 text-left">
            <BusinessProjectsDeckClient
              entityDecks={entityDecks}
              fieldLabels={{
                date: t.beranda.businessProjectsFieldDate,
                company: t.beranda.businessProjectsFieldCompany,
                location: t.beranda.businessProjectsFieldLocation,
                province: t.beranda.businessProjectsFieldProvince,
              }}
              entityPreviousLabel={t.beranda.businessProjectsEntityPrevious}
              entityNextLabel={t.beranda.businessProjectsEntityNext}
              projectPreviousLabel={t.beranda.businessProjectsPrevious}
              projectNextLabel={t.beranda.businessProjectsNext}
            />
          </div>
        )}

        {/* Closing message + CTA to the real Proyek & Insight portfolio
            directory (/proyek-insight) — the standalone /proyek page is
            legacy and now just redirects there. */}
        <Reveal>
          <div className="mx-auto mt-16 max-w-4xl">
            {/* Two explicit lines, not one wrapped string: "...10 Negara
                Mitra" must always read as a single first line, with "Kami
                Menghadirkan Dampak" as the second — never split between
                "10" and "Negara Mitra" (the wrap point the browser picks
                by default at most widths). `whitespace-nowrap` on the
                first line forces that.

                Font-size is a `clamp()`, not fixed/stepped values: the
                first line's rendered (unwrapped) width scales linearly
                with font-size, and the space available for it changes
                continuously with viewport width (including the jump in
                Section's own side padding at the `md` breakpoint) — a
                plain `vw`-based formula tracks that smoothly across every
                width, instead of a few fixed breakpoints that can overflow
                right at their own edges. It still tops out at the
                original 32px (unchanged on tablet/desktop, where there's
                always room) and only shrinks on phones narrow enough to
                need it, per "boleh menyesuaikan ukuran font agar tetap
                rapi" on small screens. */}
            <p
              className="font-landing-display font-extrabold"
              style={{ color: CLOSING_COLOR, lineHeight: 1.3 }}
            >
              <span
                className="block whitespace-nowrap"
                style={{ fontSize: 'clamp(11px, 3.9vw - 2px, 32px)' }}
              >
                Di Seluruh Penjuru Negeri Hingga 10 Negara Mitra
              </span>
              <span className="block" style={{ fontSize: 'clamp(11px, 3.9vw - 2px, 32px)' }}>
                Kami Menghadirkan Dampak
              </span>
            </p>
            <Link
              href={`/${locale}/proyek-insight`}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#0DA19D] px-6 py-3 font-landing-body text-small font-semibold text-white transition-colors hover:bg-[#0B8985]"
            >
              Lihat Seluruh Portofolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

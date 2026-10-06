'use client';

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StaticDeckProject } from './business-projects-deck-data';

export type EntityDeck = {
  entitySlug: string;
  entityName: string;
  entityLogoUrl?: string;
  /** The entity's own brand color from the CMS, when set — used to tint the
   * project panel so it visibly follows whichever entity is active; falls
   * back to the section's default accent when the entity has none. */
  accentColor?: string;
  projects: StaticDeckProject[];
};

export type BusinessProjectsFieldLabels = {
  date: string;
  company: string;
  location: string;
  province: string;
};

const ACCENT = '#0DA19D';

/** A field is only worth a metadata row if it's non-empty *and* not the
 * "not yet known" placeholder — otherwise every card would carry four
 * rows of bare "-" even when nothing about a project is known yet. */
function isKnown(value: string) {
  return value.trim().length > 0 && value.trim() !== '-';
}

/**
 * "Lini Bisnis dan Proyek Berjalan" as an interactive business portfolio —
 * a 3D coverflow entity selector (arrows, drag/swipe, hover, click-to-jump,
 * looping) above the active entity's own header and project deck.
 */
export function BusinessProjectsDeckClient({
  entityDecks,
  fieldLabels,
  entityPreviousLabel,
  entityNextLabel,
  projectPreviousLabel,
  projectNextLabel,
}: {
  entityDecks: EntityDeck[];
  fieldLabels: BusinessProjectsFieldLabels;
  entityPreviousLabel: string;
  entityNextLabel: string;
  projectPreviousLabel: string;
  projectNextLabel: string;
}) {
  // Opens on the 3rd entity (LSP Praktisi Lingkungan Indonesia in the real
  // 5-entity lineup) so it's centered with two neighbors visible on each
  // side from the very first paint — falls back gracefully for fewer
  // entities.
  const [activeEntityIndex, setActiveEntityIndex] = useState(() => Math.min(2, entityDecks.length - 1));
  const activeEntity = entityDecks[activeEntityIndex];

  return (
    <div>
      {entityDecks.length > 1 ? (
        <EntityCoverflow
          entityDecks={entityDecks}
          activeIndex={activeEntityIndex}
          onSelect={setActiveEntityIndex}
          previousLabel={entityPreviousLabel}
          nextLabel={entityNextLabel}
        />
      ) : null}

      {activeEntity ? (
        <ProjectShowcase
          key={activeEntity.entitySlug}
          deck={activeEntity}
          fieldLabels={fieldLabels}
          previousLabel={projectPreviousLabel}
          nextLabel={projectNextLabel}
        />
      ) : null}
    </div>
  );
}

/** A 3D coverflow: all entities stay visible at once, laid out by distance
 * from the active (centered) one — scale, opacity, blur and a slight 3D
 * tilt all fall off with distance, and the ring wraps around (index 0's
 * "previous" is the last entity) rather than stopping at the ends. Click a
 * card, drag/swipe the stage, or use the side arrows; hovering a card on
 * desktop gives it a small extra lift, independent of which one is active. */
function EntityCoverflow({
  entityDecks,
  activeIndex,
  onSelect,
  previousLabel,
  nextLabel,
}: {
  entityDecks: EntityDeck[];
  activeIndex: number;
  onSelect: (index: number) => void;
  previousLabel: string;
  nextLabel: string;
}) {
  const total = entityDecks.length;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const drag = useRef({ dragging: false, startX: 0, moved: false });

  function wrap(index: number) {
    return ((index % total) + total) % total;
  }

  function goTo(index: number) {
    onSelect(wrap(index));
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { dragging: true, startX: e.clientX, moved: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    if (Math.abs(e.clientX - drag.current.startX) > 6) drag.current.moved = true;
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    const delta = e.clientX - drag.current.startX;
    const threshold = 50;
    if (delta > threshold) goTo(activeIndex - 1);
    else if (delta < -threshold) goTo(activeIndex + 1);
  }

  function handleCardClick(index: number) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    goTo(index);
  }

  return (
    <div className="relative">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="region"
        aria-label="Pilih entitas"
        className="relative h-[150px] touch-pan-y select-none overflow-hidden md:h-[240px]"
      >
        {entityDecks.map((deck, index) => {
          // Shortest wraparound distance, so with 5 entities the last one
          // reads as "one to the left" of the first, not four to the right.
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const absOffset = Math.abs(offset);
          if (absOffset > 2) return null;

          const isActive = offset === 0;
          const isHovered = hoveredIndex === index;
          // A single base size (set via the `h-*` classes below) scaled down
          // uniformly for every inactive logo — the active one alone reads
          // as the focal point; opacity/z-index (not a smaller-still size)
          // carry the extra depth cue for the outermost pair.
          const baseScale = isActive ? 1 : 0.625;
          const scale = !isActive && isHovered ? Math.min(0.72, baseScale + 0.08) : baseScale;
          const opacity = isActive ? 1 : absOffset === 1 ? 0.55 : 0.3;

          return (
            <button
              key={deck.entitySlug}
              type="button"
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
              aria-current={isActive ? 'true' : undefined}
              aria-label={deck.entityName}
              style={
                {
                  zIndex: 20 - absOffset,
                  opacity,
                  '--rail-offset': offset,
                  transform: `translate(-50%, -50%) translateX(calc(var(--rail-offset) * var(--rail-spacing))) scale(${scale})`,
                } as CSSProperties
              }
              className="absolute left-1/2 top-1/2 flex shrink-0 flex-col items-center gap-2 rounded-md text-center outline-none transition-all duration-500 ease-out [--rail-spacing:140px] focus-visible:ring-2 focus-visible:ring-emerald-pulse focus-visible:ring-offset-2 md:[--rail-spacing:340px]"
            >
              {deck.entityLogoUrl ? (
                // Intrinsic dimensions match the real source asset (a wide
                // 640×200 wordmark), not the rendered size — passing the
                // rendered size here is what was starving Next's optimizer
                // into serving a soft, pre-downscaled image that the CSS
                // height then stretched back up. `quality={100}` skips its
                // default compression so the full-resolution source comes
                // through untouched.
                <Image
                  src={deck.entityLogoUrl}
                  alt=""
                  width={640}
                  height={200}
                  quality={100}
                  className="h-14 w-auto shrink-0 object-contain md:h-[136px]"
                />
              ) : (
                <span
                  className={`font-landing-body leading-tight ${
                    isActive ? 'text-small font-semibold text-pine-ink' : 'text-[11px] text-pine-ink/50'
                  }`}
                >
                  {deck.entityName}
                </span>
              )}
              <span
                aria-hidden="true"
                className="h-[2px] rounded-full transition-all duration-500"
                style={{ width: isActive ? 26 : 0, backgroundColor: ACCENT, opacity: isActive ? 1 : 0 }}
              />
              {isActive && deck.entityLogoUrl ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-pine-ink/55">
                  {deck.entityName}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={previousLabel}
            className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-pine-ink/15 bg-white text-pine-ink shadow-md transition-colors hover:bg-sage-mist/50 md:left-2"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={nextLabel}
            className="absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-pine-ink/15 bg-white text-pine-ink shadow-md transition-colors hover:bg-sage-mist/50 md:right-2"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}

/** The active entity's project showcase — text detail on the left (~40%),
 * photo carousel on the right (~60%) on desktop, photo stacked above text
 * on mobile. Deliberately carries no entity logo/name/description of its
 * own: the coverflow above already establishes which entity is active, so
 * every pixel here goes to the project itself. Both halves share one
 * `activeIndex` — stepping the photo carousel (arrows, drag, clicking a
 * peeking photo) updates the text, and vice versa is unnecessary since the
 * text has no separate navigation of its own. */
function ProjectShowcase({
  deck,
  fieldLabels,
  previousLabel,
  nextLabel,
}: {
  deck: EntityDeck;
  fieldLabels: BusinessProjectsFieldLabels;
  previousLabel: string;
  nextLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { projects } = deck;
  const total = projects.length;
  const activeProject = projects[activeIndex];
  const accent = deck.accentColor || ACCENT;

  function goTo(index: number) {
    if (index < 0 || index >= total) return;
    setActiveIndex(index);
  }

  if (!activeProject) return null;

  return (
    <div
      className="mt-6 overflow-hidden rounded-[28px] border shadow-[0_8px_28px_rgba(11,43,34,0.08)]"
      style={{
        borderColor: `${accent}26`,
        background: `linear-gradient(135deg, ${accent}14 0%, rgba(255,255,255,0.85) 38%, ${accent}0A 100%)`,
      }}
    >
      <div className="grid md:grid-cols-[9fr_11fr]">
        <div className="order-2 flex flex-col justify-center gap-4 p-6 md:order-1 md:p-8">
          {isKnown(activeProject.projectType) ? (
            <span
              className="w-fit rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
              style={{ backgroundColor: accent }}
            >
              {activeProject.projectType}
            </span>
          ) : null}

          <p className="text-[18px] font-medium leading-snug text-pine-ink/70">{activeProject.client}</p>

          {/* The work itself is the real headline here — the client name
              above is context, not the main point. */}
          <h3 className="font-landing-display text-h2 font-bold leading-tight text-pine-ink">
            {activeProject.projectTitle}
          </h3>

          {[
            [fieldLabels.date, activeProject.date],
            [fieldLabels.company, activeProject.company],
            [fieldLabels.location, activeProject.location],
            [fieldLabels.province, activeProject.province],
          ].some(([, value]) => isKnown(value)) ? (
            <>
              <div className="h-px w-full" style={{ backgroundColor: `${accent}30` }} />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {isKnown(activeProject.date) ? <DetailRow label={fieldLabels.date} value={activeProject.date} /> : null}
                {isKnown(activeProject.company) ? (
                  <DetailRow label={fieldLabels.company} value={activeProject.company} />
                ) : null}
                {isKnown(activeProject.location) ? (
                  <DetailRow label={fieldLabels.location} value={activeProject.location} />
                ) : null}
                {isKnown(activeProject.province) ? (
                  <DetailRow label={fieldLabels.province} value={activeProject.province} />
                ) : null}
              </dl>
            </>
          ) : null}
        </div>

        <div className="relative order-1 p-6 md:order-2 md:p-8">
          {/* A softly blurred, offset duplicate shape behind the carousel —
              the "layer belakang bergeser" that reads as the photo floating
              above the panel rather than sitting flush against it. */}
          <div
            aria-hidden="true"
            className="absolute inset-6 -z-10 translate-x-3 translate-y-5 rounded-[28px] blur-2xl md:inset-8"
            style={{ backgroundColor: `${accent}33` }}
          />
          <ProjectVisualCarousel
            deck={deck}
            activeIndex={activeIndex}
            onSelect={goTo}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
            accent={accent}
          />
        </div>
      </div>
    </div>
  );
}

/** Only ever called with a known value — an unknown field is skipped by the
 * caller entirely rather than shown as a bare "-", per the brief. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-pine-ink/45">{label}</dt>
      <dd className="mt-1 text-small leading-snug text-pine-ink/85">{value}</dd>
    </div>
  );
}

/** The same 3D coverflow formula as the entity selector above — depth via
 * scale/opacity/blur/rotateY, side arrows, click-to-jump, and drag/swipe —
 * now purely visual (photo only, no overlaid text) since every project's
 * text detail lives in the panel beside it instead. */
function ProjectVisualCarousel({
  deck,
  activeIndex,
  onSelect,
  previousLabel,
  nextLabel,
  accent,
}: {
  deck: EntityDeck;
  activeIndex: number;
  onSelect: (index: number) => void;
  previousLabel: string;
  nextLabel: string;
  accent: string;
}) {
  const { projects } = deck;
  const total = projects.length;
  const drag = useRef({ dragging: false, startX: 0, moved: false });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  // The parallax/tilt effect on the active photo is a desktop-only, mouse
  // affordance — on touch screens it would just be dead weight (no hover)
  // and the brief explicitly asks for the perspective to go away on small
  // screens, not merely shrink.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  function goTo(index: number) {
    if (index < 0 || index >= total) return;
    onSelect(index);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { dragging: true, startX: e.clientX, moved: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    if (Math.abs(e.clientX - drag.current.startX) > 6) drag.current.moved = true;
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    const delta = e.clientX - drag.current.startX;
    const threshold = 50;
    if (delta > threshold) goTo(activeIndex - 1);
    else if (delta < -threshold) goTo(activeIndex + 1);
  }

  function handleCardActivate(index: number) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    goTo(index);
  }

  // A very small tilt that follows the cursor across the active photo only
  // — capped tightly so it reads as "floating", never a gimmick.
  function onActivePhotoMouseMove(e: MouseEvent<HTMLButtonElement>) {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  }

  function onActivePhotoMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div className="relative">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative h-[300px] touch-pan-y select-none overflow-hidden rounded-[20px] md:h-[440px]"
        style={{ perspective: '1400px' }}
      >
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;
          if (absOffset > 2) return null;

          const scale = isActive ? 1 : absOffset === 1 ? 0.85 : 0.7;
          const rotateY = isActive
            ? isDesktop
              ? tilt.y
              : 0
            : Math.max(-30, Math.min(30, offset * -16));
          const rotateX = isActive && isDesktop ? tilt.x : 0;
          const opacity = isActive ? 1 : absOffset === 1 ? 0.85 : 0.5;
          const blurPx = isActive ? 0 : absOffset === 1 ? 0.5 : 1.5;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCardActivate(index)}
              onMouseMove={isActive ? onActivePhotoMouseMove : undefined}
              onMouseLeave={isActive ? onActivePhotoMouseLeave : undefined}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${project.client}${project.projectTitle ? ` — ${project.projectTitle}` : ''}`}
              style={{
                zIndex: 10 - absOffset,
                transform: `translate(-50%, -50%) translateX(${offset * 66}%) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                opacity,
                filter: blurPx ? `blur(${blurPx}px)` : undefined,
              }}
              className={`absolute left-1/2 top-1/2 aspect-[4/3] w-[250px] shrink-0 overflow-hidden rounded-[20px] bg-pine-ink text-left outline-none ease-out focus-visible:ring-2 focus-visible:ring-emerald-pulse md:w-[400px] ${
                isActive
                  ? 'shadow-[0_30px_60px_rgba(11,43,34,0.28)] transition-transform duration-150'
                  : 'shadow-[0_14px_30px_rgba(11,43,34,0.22)] transition-all duration-500'
              }`}
            >
              <ProjectVisual
                index={index}
                project={project}
                entityLogoUrl={deck.entityLogoUrl}
                accent={accent}
              />
            </button>
          );
        })}
      </div>

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={previousLabel}
            className="absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-pine-ink/15 bg-white text-pine-ink shadow-md transition-colors hover:bg-sage-mist/50 disabled:pointer-events-none disabled:opacity-30 md:left-2"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === total - 1}
            aria-label={nextLabel}
            className="absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-pine-ink/15 bg-white text-pine-ink shadow-md transition-colors hover:bg-sage-mist/50 disabled:pointer-events-none disabled:opacity-30 md:right-2"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-pine-ink/10" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${((activeIndex + 1) / total) * 100}%`, backgroundColor: accent }}
              />
            </div>
            <span className="font-mono text-label tabular-nums text-pine-ink/40">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** A photo, nothing else — the project's text now lives in the detail
 * panel beside it, so the visual side stays purely visual instead of
 * squeezing a second copy of the same text onto the image. */
function ProjectVisual({
  index,
  project,
  entityLogoUrl,
  accent,
}: {
  index: number;
  project: StaticDeckProject;
  entityLogoUrl?: string;
  accent: string;
}) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="relative h-full w-full">
      {project.imageUrl ? (
        <Image src={project.imageUrl} alt="" fill sizes="400px" className="object-cover" />
      ) : entityLogoUrl ? (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: `radial-gradient(circle at 50% 42%, ${accent}3D 0%, #0B2B22 75%)` }}
        >
          <Image
            src={entityLogoUrl}
            alt=""
            width={96}
            height={96}
            className="h-16 w-16 object-contain opacity-60 md:h-20 md:w-20"
          />
        </div>
      ) : (
        <div className="h-full w-full bg-pine-ink" />
      )}

      <span
        className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-white"
        style={{ backgroundColor: `${accent}CC` }}
      >
        {number}
      </span>
    </div>
  );
}

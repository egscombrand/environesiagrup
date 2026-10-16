'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Milestone } from '@/lib/cms/milestones';

const ACCENT = '#01B3A1';
const EASE = [0.22, 1, 0.36, 1] as const;

// Fixed per-slide footprint (SLOT_WIDTH) — every slide occupies the same
// column regardless of active state, so switching the active index never
// reflows neighboring slides. Image width shrinks per step of distance
// from the active slide (a real width change, not a CSS `scale` standing
// in for one), each step ~1.85x smaller than the last — matched against
// the approved reference comp — floored at MIN_IMAGE_WIDTH so it keeps
// working whether there are 3 milestones or many more.
const SLOT_WIDTH = 300;
const ACTIVE_IMAGE_WIDTH = 272;
const SIZE_RATIO = 1.85;
const MIN_IMAGE_WIDTH = 92;
const ACTIVE_IMAGE_HEIGHT = Math.round((ACTIVE_IMAGE_WIDTH * 3) / 4);

// `useLayoutEffect` warns during SSR (no DOM to measure), so it's aliased
// to `useEffect` there — but in the browser this measures and applies the
// centered position before the first paint, so the carousel never
// visibly starts uncentered and then snaps into place.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), length - 1);
}

function widthForDistance(distance: number) {
  return Math.max(MIN_IMAGE_WIDTH, Math.round(ACTIVE_IMAGE_WIDTH / SIZE_RATIO ** distance));
}

/**
 * One slide — purely the image (or a plain placeholder box if the
 * milestone has none). Per the approved reference comp, the cards carry
 * no text of their own: the year, title, and description are all shown
 * once, below the whole row, for whichever slide is active — repeating
 * them per-card would just be the same information twice.
 */
function TimelineSlide({
  milestone,
  distance,
  isActive,
  onSelect,
}: {
  milestone: Milestone;
  distance: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const width = widthForDistance(distance);

  return (
    <div className="flex shrink-0 flex-col items-center justify-end px-3" style={{ width: SLOT_WIDTH, height: ACTIVE_IMAGE_HEIGHT }}>
      <motion.button
        type="button"
        onClick={onSelect}
        aria-label={`${milestone.year} — ${milestone.title}`}
        aria-current={isActive ? 'true' : undefined}
        className="block overflow-hidden rounded-[16px]"
        style={{ aspectRatio: '4 / 3' }}
        // `initial={false}` pins the very first render to the `animate`
        // values directly (no entrance transition) — the active slide's
        // enlarged size is therefore already correct on the first paint,
        // never something it grows into after mount/interaction.
        initial={false}
        animate={{ width, opacity: isActive ? 1 : 0.7 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      >
        {milestone.imageUrl ? (
          <Image
            src={milestone.imageUrl}
            alt={milestone.title}
            width={ACTIVE_IMAGE_WIDTH}
            height={ACTIVE_IMAGE_HEIGHT}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-stone" aria-hidden="true" />
        )}
      </motion.button>
    </div>
  );
}

/**
 * "Rekam Jejak & Tonggak Environesia" — an interactive horizontal
 * carousel, not a passive scroll list. One milestone is always the
 * active/centered item, its image visibly larger than its neighbors;
 * Prev/Next (flanking the big year number), clicking a side slide,
 * clicking a year marker on the line, or a swipe on touch devices all
 * move which milestone is active. The active slide is kept centered by
 * measuring the viewport's own width and animating the track's `x`
 * offset — not by hardcoding positions — so this keeps working unchanged
 * whether there are 3 milestones or many more.
 *
 * Defaults to the middle milestone (by position, never a specific
 * hardcoded year) so the carousel opens already centered on a real
 * milestone instead of pinned to the oldest one. The narrative for the
 * active milestone is always shown in a connected callout below the
 * timeline (a speech-bubble notch, not a modal) — matched 1:1 against
 * the approved reference comp.
 *
 * Renders exactly the real, published milestones passed in — never a
 * hardcoded example year, title, or fabricated content standing in for a
 * milestone with no real data.
 */
export function PerjalananTimeline({ milestones }: { milestones: Milestone[] }) {
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() => Math.floor((milestones.length - 1) / 2));
  const touchStartX = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => setViewportWidth(el.clientWidth);
    update();
    window.addEventListener('resize', update, { passive: true });
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resizeObserver?.observe(el);

    return () => {
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
    };
  }, []);

  if (milestones.length === 0) return null;

  const goTo = (index: number) => setActiveIndex(clampIndex(index, milestones.length));
  const goPrev = () => setActiveIndex((current) => clampIndex(current - 1, milestones.length));
  const goNext = () => setActiveIndex((current) => clampIndex(current + 1, milestones.length));

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const trackX = viewportWidth ? viewportWidth / 2 - (activeIndex * SLOT_WIDTH + SLOT_WIDTH / 2) : 0;
  const activeMilestone = milestones[activeIndex];
  const hasMultiple = milestones.length > 1;

  return (
    <div>
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Timeline perjalanan Environesia"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-x-hidden focus:outline-none"
      >
        <motion.div
          className="flex items-end"
          initial={false}
          animate={{ x: trackX }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        >
          {milestones.map((milestone, i) => (
            <TimelineSlide
              key={milestone.id}
              milestone={milestone}
              distance={Math.abs(i - activeIndex)}
              isActive={i === activeIndex}
              onSelect={() => goTo(i)}
            />
          ))}
        </motion.div>
      </div>

      {hasMultiple ? (
        <div className="relative mx-auto mt-6 flex max-w-md items-start justify-between px-8">
          <div aria-hidden="true" className="pointer-events-none absolute left-8 right-8 top-[7px] h-px border-t border-dashed border-pine-ink/25" />
          {milestones.map((milestone, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={milestone.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ke tahun ${milestone.year}`}
                aria-current={active ? 'true' : undefined}
                className="relative z-[1] flex flex-col items-center gap-2"
              >
                <span className="relative flex h-[30px] w-[30px] items-center justify-center">
                  {active ? (
                    <motion.span
                      className="absolute rounded-full"
                      style={{ backgroundColor: `${ACCENT}22` }}
                      initial={false}
                      animate={{ width: 30, height: 30 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  ) : null}
                  <motion.span
                    className="relative z-[1] block rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    initial={false}
                    animate={{ width: active ? 15 : 8, height: active ? 15 : 8 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  />
                </span>
                {/* The active year is shown once, large, below the whole
                    row (see the year+arrows block) — repeating it here
                    too would just duplicate it. */}
                {active ? null : (
                  <span className="font-mono text-[12px] font-semibold tracking-[0.03em] text-pine-ink/45">{milestone.year}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-2 flex flex-col items-center">
        <div className="flex items-center gap-4">
          {hasMultiple ? (
            <button
              type="button"
              onClick={goPrev}
              disabled={activeIndex === 0}
              aria-label="Milestone sebelumnya"
              className="rounded-full p-1 transition-opacity disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" style={{ color: ACCENT }} strokeWidth={2.25} aria-hidden="true" />
            </button>
          ) : null}
          <span className="font-landing-display text-[38px] font-bold leading-none text-pine-ink sm:text-[44px]">
            {activeMilestone.year}
          </span>
          {hasMultiple ? (
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === milestones.length - 1}
              aria-label="Milestone berikutnya"
              className="rounded-full p-1 transition-opacity disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" style={{ color: ACCENT }} strokeWidth={2.25} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <p className="mt-1.5 text-center text-[14px] text-pine-ink/60">{activeMilestone.title}</p>
      </div>

      {activeMilestone.description ? (
        <div className="relative mx-auto mt-5 max-w-xl px-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMilestone.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative rounded-[12px] border bg-paper px-5 py-4"
              style={{ borderColor: `${ACCENT}59` }}
            >
              {/* Speech-bubble notch — a rotated square straddling the
                  box's own top border, sharing its border + fill so it
                  reads as one continuous shape pointing up at the year
                  above, connecting the callout to it. */}
              <span
                aria-hidden="true"
                className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t bg-paper"
                style={{ borderColor: `${ACCENT}59` }}
              />
              <p className="max-h-[200px] overflow-y-auto text-center text-small text-pine-ink/75">
                {activeMilestone.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}

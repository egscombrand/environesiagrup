'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Milestone } from '@/lib/cms/milestones';
import { Reveal } from '@/components/motion/reveal';

/**
 * The interactive core of "Our Journey": a node strip (year + dot, with a
 * per-segment progress line that fills up to whichever milestone is active)
 * sitting above a large "active story" panel — image, year/date, title and
 * narrative crossfading with a subtle slide on change. Clicking any node
 * jumps straight there; Previous/Next give sequential control. No autoplay
 * — the brief was explicit that it adds no real value here and risks
 * rushing a reading experience, so the user always drives.
 */
export function MilestonesJourney({
  milestones,
  heading,
  eyebrow,
  intro,
  previousLabel,
  nextLabel,
}: {
  milestones: Milestone[];
  heading: string;
  eyebrow: string;
  intro: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = milestones.length;
  const active = milestones[activeIndex];

  function goTo(index: number) {
    if (index < 0 || index >= total || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }

  return (
    <div>
      <Reveal>
        <p className="font-mono text-label uppercase tracking-[0.14em] text-emerald-pulse">{eyebrow}</p>
        <h2 className="mt-2 font-landing-display text-h2 text-pine-ink">{heading}</h2>
        {intro ? (
          <p className="mt-3 max-w-xl font-landing-body text-body text-pine-ink/70">{intro}</p>
        ) : null}
      </Reveal>

      <div className="mt-10">
        {/* Node strip — a horizontally scrollable row of real buttons, one
            per milestone, connected by per-segment progress lines. Fixed
            segment widths (not flex-fill) keep node-to-line alignment exact
            regardless of count, and let it scroll naturally on any device
            when there are more milestones than fit — the same "horizontal
            interactive timeline, swipeable on mobile" the brief asks for,
            without a separate curved/mobile layout to maintain. */}
        <div className="overflow-x-auto pb-2" role="group" aria-label={heading}>
          <div className="flex w-max items-center">
            {milestones.map((milestone, index) => (
              <Fragment key={milestone.id}>
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className={`h-px w-10 shrink-0 transition-colors duration-500 md:w-16 ${
                      index <= activeIndex ? 'bg-emerald-pulse' : 'bg-sage-mist'
                    }`}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  aria-label={`${milestone.year}${milestone.title ? ` — ${milestone.title}` : ''}`}
                  className="flex shrink-0 flex-col items-center gap-2 rounded-[8px] px-1 py-1 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-emerald-pulse"
                >
                  <span
                    className={`rounded-full border-2 transition-all duration-300 ${
                      index === activeIndex
                        ? 'h-3.5 w-3.5 border-emerald-pulse bg-emerald-pulse'
                        : 'h-2.5 w-2.5 border-sage-mist bg-canvas'
                    }`}
                  />
                  <span
                    className={`font-mono text-small tabular-nums transition-colors ${
                      index === activeIndex ? 'font-semibold text-pine-ink' : 'text-pine-ink/40'
                    }`}
                  >
                    {milestone.year}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Active story */}
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={shouldReduceMotion ? false : { opacity: 0, x: direction > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-8 grid gap-8 ${active.imageUrl ? 'lg:grid-cols-2 lg:items-center' : ''}`}
          >
            {active.imageUrl ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-sage-mist/40">
                <Image
                  src={active.imageUrl}
                  alt={active.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={activeIndex === 0}
                />
              </div>
            ) : null}
            <div className="flex flex-col justify-center">
              <p className="font-mono text-label uppercase tracking-[0.08em] text-pine-ink/50">
                {active.date_label || active.year}
              </p>
              <h3 className="mt-2 font-landing-display text-h2 text-pine-ink">{active.title}</h3>
              {active.description ? (
                <p className="mt-4 font-landing-body text-body leading-relaxed text-pine-ink/80">
                  {active.description}
                </p>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation — user-driven, no autoplay */}
        {total > 1 ? (
          <div className="mt-8 flex items-center gap-6">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="text-small font-medium text-pine-ink/70 hover:text-pine-ink disabled:pointer-events-none disabled:opacity-30"
            >
              ← {previousLabel}
            </button>
            <span className="font-mono text-label tabular-nums text-pine-ink/40">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === total - 1}
              className="text-small font-medium text-emerald-pulse disabled:pointer-events-none disabled:opacity-30"
            >
              {nextLabel} →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

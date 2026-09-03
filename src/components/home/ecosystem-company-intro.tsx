'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Entity } from '@/lib/cms/entities';
import { EcosystemCompanyVisual } from './ecosystem-company-visual';

const TEXT_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };
const STEP_DURATION_MS = 3200;

/**
 * Introduces every active company one at a time with a balanced 50:50 composition:
 * Left: Compact editorial navigation (Number, Name, Category).
 * Right: Dedicated dynamic showcase panel with visual, logo, and full description.
 */
export function EcosystemCompanyIntro({
  entities,
  skipLabel,
  onComplete,
  onSkip,
  stepDurationMs = STEP_DURATION_MS,
}: {
  entities: Entity[];
  /** e.g. "Lewati" */
  skipLabel: string;
  onComplete: () => void;
  onSkip: () => void;
  /** Reading time per company, in ms — overridable so tests don't wait out the real ~3.2s pace. */
  stepDurationMs?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = entities.length;
  const entity = entities[Math.min(index, total - 1)];

  useEffect(() => {
    if (index >= total - 1) {
      const timer = setTimeout(onComplete, stepDurationMs);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setIndex((current) => current + 1);
    }, stepDurationMs);
    return () => clearTimeout(timer);
  }, [index, onComplete, stepDurationMs, total]);

  if (!entity) return null;

  return (
    <motion.div
      key="companies"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-[58vh] flex-col gap-6 py-6 md:min-h-[62vh]"
    >
      {/* Top Progress & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage-mist/80 pb-4">
        <div className="flex items-center gap-4">
          <p className="font-mono text-label uppercase tracking-[0.1em] text-pine-ink/60">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          {!shouldReduceMotion ? (
            <div className="h-[2px] w-20 overflow-hidden rounded-full bg-sage-mist">
              <motion.div
                key={index}
                className="h-full origin-left bg-emerald-pulse"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: stepDurationMs / 1000, ease: 'linear' }}
              />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="text-small font-medium text-pine-ink/50 underline decoration-dotted underline-offset-4 hover:text-pine-ink"
        >
          {skipLabel} →
        </button>
      </div>

      {/* 50:50 EDITORIAL COMPOSITION */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* LEFT (50%) — COMPACT EDITORIAL DIRECTORY */}
        <div className="flex flex-col border-t border-b border-sage-mist/90 lg:col-span-6">
          {entities.slice(0, index + 1).map((item, itemIndex) => {
            const isCurrent = itemIndex === index;
            const numStr = String(itemIndex + 1).padStart(2, '0');

            return (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={TEXT_TRANSITION}
                className={`border-b border-sage-mist/80 py-4 transition-all duration-300 md:py-5 ${
                  isCurrent
                    ? 'rounded-[12px] bg-emerald-pulse/[0.04] px-4 -mx-4 border-emerald-pulse/30'
                    : 'opacity-65'
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span
                      className={`font-mono text-small md:text-body transition-colors ${
                        isCurrent
                          ? 'font-bold text-emerald-pulse'
                          : 'text-pine-ink/40'
                      }`}
                    >
                      {numStr}
                    </span>
                    <div>
                      <span
                        className={`font-landing-display block transition-all ${
                          isCurrent
                            ? 'text-h2 font-semibold text-pine-ink'
                            : 'text-h3 text-pine-ink/75'
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.tagline ? (
                        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-pine-ink/50">
                          {item.tagline}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-h3 transition-transform duration-300 ${
                      isCurrent ? 'translate-x-1 text-emerald-pulse' : 'text-pine-ink/20'
                    }`}
                  >
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT (50%) — DYNAMIC VISUAL & FULL DETAILS PANEL */}
        <div className="flex flex-col lg:col-span-6 sticky top-24">
          <div className="relative overflow-hidden rounded-[18px] border border-sage-mist bg-canvas p-6 md:p-8 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={entity.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={TEXT_TRANSITION}
                className="flex flex-col"
              >
                {/* Large Visual / Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-sage-mist/80 bg-paper/60 shadow-sm">
                  <EcosystemCompanyVisual
                    entity={entity}
                    variant="featured"
                    priority={index === 0}
                    className="h-full w-full"
                  />
                </div>

                {/* Company Details & Full Copy */}
                <div className="mt-5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-pulse font-semibold">
                      Profil Entitas Aktif
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entity.accent_color ?? '#0FA96B' }}
                    />
                  </div>

                  {entity.short_description ? (
                    <p className="mt-3 font-landing-body text-body leading-relaxed text-pine-ink/80">
                      {entity.short_description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

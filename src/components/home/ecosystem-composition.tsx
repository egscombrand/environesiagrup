'use client';

import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import type { Entity } from '@/lib/cms/entities';
import { EcosystemCompanyVisual } from './ecosystem-company-visual';

export type CompositionOrigin = { x: number; y: number };

type NodeState = 'show' | 'active' | 'dimmed';

type NodeCustom = { index: number; reduce: boolean };

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: ({ index, reduce }: NodeCustom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0 : 0.4,
      delay: reduce ? 0 : Math.min(index, 10) * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  active: ({ reduce }: NodeCustom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] },
  }),
  dimmed: ({ reduce }: NodeCustom) => ({
    opacity: 0.35,
    y: 0,
    transition: { duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * Interactive Editorial Company Directory (50:50 Clean Split):
 * Left (50%): Compact editorial rows (Number, Name, Category).
 * Right (50%): Permanent large dynamic showcase panel with visual, logo, full description, and CTA.
 */
export function EcosystemComposition({
  entities,
  selectedId,
  shouldReduceMotion,
  exploreLabelTemplate,
  siteName: _siteName,
  logoUrl: _logoUrl,
  onOpen,
  registerCardRef,
}: {
  entities: Entity[];
  selectedId: string | null;
  shouldReduceMotion: boolean;
  /** e.g. "Kenali {name}" — `{name}` is replaced with each entity's real name. */
  exploreLabelTemplate: string;
  siteName: string;
  logoUrl?: string;
  onOpen: (entityId: string, origin: CompositionOrigin) => void;
  registerCardRef: (entityId: string, el: HTMLButtonElement | null) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeEntity =
    entities.find((e) => e.id === (selectedId || hoveredId)) ?? entities[0];

  return (
    <div
      inert={selectedId !== null ? true : undefined}
      className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* LEFT (50%) — COMPACT EDITORIAL DIRECTORY TABLE */}
      <div className="flex flex-col border-t border-b border-sage-mist/90 lg:col-span-6">
        {entities.map((entity, index) => {
          const isSelected = selectedId === entity.id;
          const isActive =
            isSelected ||
            (selectedId === null &&
              (hoveredId === entity.id || (hoveredId === null && index === 0)));
          const state: NodeState =
            selectedId === null
              ? isActive
                ? 'active'
                : 'show'
              : selectedId === entity.id
              ? 'active'
              : 'dimmed';
          const numberStr = String(index + 1).padStart(2, '0');
          const exploreLabel = exploreLabelTemplate.replace('{name}', entity.name);

          return (
            <motion.button
              key={entity.id}
              ref={(el) => registerCardRef(entity.id, el)}
              type="button"
              aria-label={`${entity.name} — ${exploreLabel}`}
              variants={rowVariants}
              custom={{ index, reduce: shouldReduceMotion } satisfies NodeCustom}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={state}
              onMouseEnter={() => setHoveredId(entity.id)}
              onFocus={() => setHoveredId(entity.id)}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                onOpen(entity.id, {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                });
              }}
              className={`group relative w-full border-b border-sage-mist/80 py-4 text-left outline-none transition-all duration-300 md:py-5 focus-visible:ring-2 focus-visible:ring-emerald-pulse ${
                isActive
                  ? 'rounded-[12px] bg-emerald-pulse/[0.04] px-4 -mx-4 border-emerald-pulse/30'
                  : 'hover:bg-sage-mist/15'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span
                    className={`font-mono text-small md:text-body transition-colors ${
                      isActive
                        ? 'font-bold text-emerald-pulse'
                        : 'text-pine-ink/40 group-hover:text-emerald-pulse'
                    }`}
                  >
                    {numberStr}
                  </span>
                  <div>
                    <span
                      className={`font-landing-display block transition-all ${
                        isActive
                          ? 'text-h2 font-semibold text-pine-ink'
                          : 'text-h3 text-pine-ink/80 group-hover:text-pine-ink'
                      }`}
                    >
                      {entity.name}
                    </span>
                    {entity.tagline ? (
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-pine-ink/50">
                        {entity.tagline}
                      </p>
                    ) : null}
                  </div>
                </div>
                <span
                  className={`font-mono text-h3 transition-transform duration-300 ${
                    isActive
                      ? 'translate-x-1 text-emerald-pulse'
                      : 'text-pine-ink/20 group-hover:translate-x-1 group-hover:text-emerald-pulse'
                  }`}
                >
                  →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* RIGHT (50%) — DYNAMIC SHOWCASE & DETAILS PANEL */}
      <div className="flex flex-col lg:col-span-6 sticky top-24">
        {activeEntity ? (
          <div className="relative overflow-hidden rounded-[18px] border border-sage-mist bg-canvas p-6 md:p-8 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEntity.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                {/* Large Featured Visual */}
                <div
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    onOpen(activeEntity.id, {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    });
                  }}
                  className="group/img relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[12px] border border-sage-mist/80 bg-paper/60 shadow-sm"
                >
                  <EcosystemCompanyVisual
                    entity={activeEntity}
                    variant="featured"
                    className="h-full w-full transition-transform duration-500 ease-out group-hover/img:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-pine-ink/0 transition-colors duration-300 group-hover/img:bg-pine-ink/10" />
                </div>

                {/* Company Details & Full Description */}
                <div className="mt-6 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-pulse font-semibold">
                      {String(entities.indexOf(activeEntity) + 1).padStart(2, '0')} /{' '}
                      {String(entities.length).padStart(2, '0')} · Profil Entitas
                    </span>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: activeEntity.accent_color ?? '#0FA96B' }}
                    />
                  </div>

                  <span className="mt-2 font-landing-display text-h2 font-semibold text-pine-ink block">
                    {activeEntity.name}
                  </span>

                  {activeEntity.tagline ? (
                    <p className="mt-1 font-mono text-label uppercase tracking-[0.06em] text-pine-ink/50">
                      {activeEntity.tagline}
                    </p>
                  ) : null}

                  {activeEntity.short_description ? (
                    <p className="mt-3 font-landing-body text-body leading-relaxed text-pine-ink/80">
                      {activeEntity.short_description}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      onOpen(activeEntity.id, {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                      });
                    }}
                    className="mt-5 inline-flex w-fit items-center gap-2 text-small font-medium text-emerald-pulse hover:text-forest transition-colors group-hover:underline"
                  >
                    <span>{exploreLabelTemplate.replace('{name}', activeEntity.name)}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  );
}

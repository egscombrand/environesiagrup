'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Entity } from '@/lib/cms/entities';

// The same 5 endpoints the SVG's own connecting lines already point at
// (cx/cy out of the 360×190 viewBox, converted to percentages) — kept in
// lockstep with that markup on purpose, since the logo nodes are
// positioned in plain CSS over the SVG, not inside it.
const NODE_POSITIONS = [
  { left: '31.67%', top: '25.26%' },
  { left: '68.33%', top: '25.26%' },
  { left: '71.11%', top: '71.05%' },
  { left: '28.89%', top: '71.05%' },
  { left: '50%', top: '85.26%' },
];

const STEP_TRANSITION = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };
const STEP_DURATION_MS = 2600;

// A loose, asymmetric scatter of positions for the background "the ecosystem
// is forming" tiles — fixed and deterministic (no SSR/hydration mismatch,
// no randomness), and deliberately not a grid or a circle so it never reads
// as a diagram.
const TILE_POSITIONS = [
  { top: '14%', left: '10%', size: 64, rotate: -6 },
  { top: '64%', left: '16%', size: 46, rotate: 5 },
  { top: '18%', left: '80%', size: 54, rotate: 8 },
  { top: '70%', left: '76%', size: 70, rotate: -5 },
  { top: '44%', left: '92%', size: 38, rotate: 11 },
  { top: '86%', left: '46%', size: 50, rotate: -9 },
];

/**
 * The four-beat "who we are" reveal, entirely automatic: each statement
 * gets its own reading time and then advances itself — no click required,
 * matching the brief's "user tidak perlu klik setiap kalimat". A thin
 * progress bar under the "01 / 04" indicator visibly counts down each
 * beat's reading time, so the auto-advance reads as part of the experience
 * rather than a stalled page. Small accent-colored tiles — one of each real
 * company's own color, never labelled — accumulate in the background as the
 * beats pass, so the panel never feels like a single sentence floating in
 * empty space; the ecosystem is visibly assembling behind the words before
 * any company is actually introduced. A small "Skip" control is the only
 * click this phase ever needs, for anyone who wants to jump straight to
 * exploring.
 */
export function EcosystemProgressiveReveal({
  lines,
  entities,
  logoUrl,
  siteName,
  skipLabel,
  onComplete,
  onSkip,
  stepDurationMs = STEP_DURATION_MS,
}: {
  lines: string[];
  entities: Entity[];
  logoUrl?: string;
  siteName: string;
  /** e.g. "Lewati" */
  skipLabel: string;
  onComplete: () => void;
  onSkip: () => void;
  /** Reading time per beat, in ms — overridable so tests don't wait out the real ~2.6s pace. */
  stepDurationMs?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = lines.length;

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

  // Reactive step labels for the visual status
  const beatStages = [
    '01 · Pembentukan Inti Ekosistem',
    '02 · 5 Entitas Spesialis Muncul',
    '03 · Sinergi & Konektivitas Terbentuk',
    '04 · Penyatuan Solusi Berkelanjutan',
  ];

  const centerScale = index >= 3 ? 1.12 : 1;

  return (
    <motion.div
      key="reveal"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid min-h-[52vh] grid-cols-1 items-center gap-8 overflow-hidden rounded-[20px] border border-sage-mist/60 bg-canvas/60 p-6 md:min-h-[58vh] md:p-10 lg:grid-cols-12 lg:gap-12"
    >
      {/* Background ambient texture */}
      <div
        aria-hidden="true"
        className="ecosystem-ambient ecosystem-drift pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
      />

      {/* LEFT — EXISTING PROGRESSIVE EXPERIENCE */}
      <div className="flex flex-col items-start justify-center gap-5 text-left lg:col-span-6">
        <div className="flex flex-col items-start gap-2">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-pine-ink/50">
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

        <div className="min-h-[90px] flex items-center">
          <AnimatePresence>
            <motion.p
              key={index}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={STEP_TRANSITION}
              className="max-w-xl font-landing-display text-display text-pine-ink"
            >
              {lines[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="relative mt-2 text-small font-medium text-pine-ink/40 underline decoration-dotted underline-offset-4 hover:text-pine-ink"
        >
          {skipLabel} →
        </button>
      </div>

      {/* RIGHT — SUPPORTING VISUAL & REACTIVE CONTEXT */}
      <div className="relative flex flex-col justify-center lg:col-span-6">
        <div className="relative overflow-hidden rounded-[16px] border border-sage-mist bg-canvas p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-pulse" />
            <p className="font-mono text-label uppercase tracking-[0.14em] text-pine-ink/60">
              Tentang Environesia Group
            </p>
          </div>

          <p className="mt-3 font-landing-body text-body leading-relaxed text-pine-ink/80">
            Environesia Group adalah ecosystem perusahaan dengan keahlian yang berbeda yang terhubung untuk membangun solusi bagi bisnis, lingkungan, dan keberlanjutan.
          </p>

          {/* Reactive Ecosystem Visualization */}
          <div className="relative mt-5 flex h-52 w-full items-center justify-center overflow-hidden rounded-[12px] border border-sage-mist/70 bg-pine-ink/[0.06] md:h-64">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 360 190"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Concentric Guide Circles with animation */}
              <circle
                cx="180"
                cy="95"
                r="72"
                stroke="var(--color-sage-mist)"
                strokeWidth="1"
                strokeDasharray={index >= 2 ? 'none' : '4 4'}
                className="transition-all duration-700"
              />
              <circle
                cx="180"
                cy="95"
                r="44"
                stroke={index >= 3 ? 'var(--color-emerald-pulse)' : 'var(--color-sage-mist)'}
                strokeWidth={index >= 3 ? 1.5 : 1}
                strokeOpacity={index >= 3 ? 0.6 : 0.8}
                className="transition-all duration-700"
              />

              {/* Reactive Connecting Lines (appear on Beat 2 / index >= 2) */}
              <g className="transition-opacity duration-700" style={{ opacity: index >= 2 ? 1 : 0.15 }}>
                <line x1="180" y1="95" x2="114" y2="48" stroke="#0FA96B" strokeWidth={index >= 2 ? 1.75 : 1} strokeDasharray={index >= 3 ? 'none' : '3 3'} />
                <line x1="180" y1="95" x2="246" y2="48" stroke="#33C4C9" strokeWidth={index >= 2 ? 1.75 : 1} strokeDasharray={index >= 3 ? 'none' : '3 3'} />
                <line x1="180" y1="95" x2="256" y2="135" stroke="#F2A93B" strokeWidth={index >= 2 ? 1.75 : 1} strokeDasharray={index >= 3 ? 'none' : '3 3'} />
                <line x1="180" y1="95" x2="104" y2="135" stroke="#454A85" strokeWidth={index >= 2 ? 1.75 : 1} strokeDasharray={index >= 3 ? 'none' : '3 3'} />
                <line x1="180" y1="95" x2="180" y2="162" stroke="#A8482D" strokeWidth={index >= 2 ? 1.75 : 1} strokeDasharray={index >= 3 ? 'none' : '3 3'} />
              </g>

            </svg>

            {/* Group Logo — the ecosystem's own focal point, replacing the
                old reactive SVG dot. Deliberately the largest, boldest
                element in the graphic: filled with the CMS logoUrl/siteName
                when set, otherwise a solid dark-green anchor. Still reacts
                to the same beat (a subtle scale bump on index >= 3,
                matching the old radius growth). */}
            <div
              className={`absolute z-20 flex aspect-square h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full p-3 shadow-lg transition-all duration-500 md:h-28 md:w-28 md:p-4 ${
                logoUrl ? 'border border-gray-100 bg-white' : 'bg-pine-ink'
              }`}
              style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${centerScale})` }}
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={siteName} width={84} height={84} className="h-full w-full object-contain" />
              ) : null}
            </div>

            {/* Satellite Entity Nodes — real company logos, not solid
                dots, but still emerging/illuminating on Beat 1 exactly like
                the circles they replace did (same index >= 1 / index === 1
                conditions, just scale instead of radius). Positioned in CSS
                (NODE_POSITIONS) at the exact points the SVG's own
                connecting lines terminate at; the SVG itself is untouched.
                Kept visibly smaller than the center focal point at every
                breakpoint, and shadowed to read as floating above the
                (slightly darker) box background. */}
            {entities.slice(0, 5).map((entity, i) => {
              const scale = index >= 1 ? 1 : 0.5;
              const opacity = index >= 1 ? (index === 1 ? 1 : 0.85) : 0.2;
              return (
                <div
                  key={entity.id}
                  className="absolute z-10 flex aspect-square h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-2 shadow-md transition-all duration-500 md:h-16 md:w-16 md:p-3"
                  style={{ ...NODE_POSITIONS[i], transform: `translate(-50%, -50%) scale(${scale})`, opacity }}
                >
                  {entity.logoUrl ? (
                    <Image
                      src={entity.logoUrl}
                      alt={entity.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Reactive Step Status — moved out of the diagram box entirely
              (was an absolute overlay, which any node/logo size increase
              could collide with again); as a normal-flow caption
              underneath it can never overlap a node. */}
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-canvas/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-pine-ink/70 border border-sage-mist shadow-xs">
              {beatStages[Math.min(index, beatStages.length - 1)]}
            </span>
            <span className="font-mono text-[11px] text-pine-ink/40">
              Phase {index + 1}/4
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { KeyboardEvent } from 'react';
import type { Entity } from '@/lib/cms/entities';

// Fractal-noise SVG grain, applied at very low opacity — a static texture,
// not an animation, so it adds life to the empty space without competing
// with the drifting glow as "the" motion in this panel.
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const LINE_TRANSITION = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

// The same 5 endpoints the SVG's own connecting lines already point at
// (cx/cy out of the 360×176 viewBox, converted to percentages) — kept in
// lockstep with that markup on purpose, since the logo nodes below are
// positioned in plain CSS over the SVG, not inside it.
const NODE_POSITIONS = [
  { left: '32.78%', top: '26.14%' },
  { left: '67.22%', top: '26.14%' },
  { left: '70%', top: '71.59%' },
  { left: '30%', top: '71.59%' },
  { left: '50%', top: '86.36%' },
];

/**
 * The whole brand overture in a single beat — mark, "presenting" label, and
 * the group's own name (styled lowercase, a wordmark treatment) cascade in
 * together on their own, no click required to see any of it. The one click
 * this scene asks for comes only at the very end, once everything has had
 * its moment, and hands off to the fully-automatic reveal that follows.
 */
export function EcosystemOpening({
  presentingLabel,
  heading,
  continueLabel,
  logoUrl,
  siteName,
  entities,
  onComplete,
}: {
  /** e.g. "Mempersembahkan…" */
  presentingLabel: string;
  heading: string;
  /** e.g. "Lanjut" — the single click that hands off to the automatic reveal. */
  continueLabel: string;
  logoUrl?: string;
  siteName: string;
  /** Real companies, shown as their own logos on the "about" graphic's 5 nodes — never generic dots. */
  entities: Entity[];
  onComplete: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onComplete();
    }
  }

  function lineProps(delay: number) {
    return shouldReduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
          whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
          viewport: { once: true, amount: 0.6 },
          transition: { ...LINE_TRANSITION, delay },
        };
  }

  return (
    <motion.div
      key="opening"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      role="button"
      aria-label={continueLabel}
      tabIndex={0}
      onClick={onComplete}
      onKeyDown={handleKeyDown}
      className="group relative grid min-h-[52vh] cursor-pointer grid-cols-1 items-center gap-8 overflow-hidden rounded-[20px] border border-sage-mist/60 bg-canvas/60 p-6 outline-none transition-colors duration-500 hover:border-emerald-pulse/30 focus-visible:ring-2 focus-visible:ring-forest md:min-h-[58vh] md:p-10 lg:grid-cols-12 lg:gap-12"
    >
      <div
        aria-hidden="true"
        className="ecosystem-ambient ecosystem-drift pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("${GRAIN_URL}")` }}
      />

      {/* LEFT — EXISTING CINEMATIC EXPERIENCE */}
      <div className="flex flex-col items-start justify-center gap-5 text-left lg:col-span-6">
        {logoUrl ? (
          <Image src={logoUrl} alt={siteName} width={220} height={64} className="relative h-12 w-auto object-contain md:h-14" />
        ) : (
          <p className="relative font-landing-display text-display text-pine-ink">{siteName}</p>
        )}

        <motion.p
          {...lineProps(0.5)}
          className="relative font-mono text-label uppercase tracking-[0.16em] text-pine-ink/50"
        >
          {presentingLabel}
        </motion.p>

        <motion.h2
          {...lineProps(0.95)}
          className="relative max-w-xl font-landing-display text-display lowercase text-pine-ink"
        >
          {heading}
        </motion.h2>

        <motion.span
          {...lineProps(1.75)}
          className="relative mt-3 inline-flex items-center gap-2 font-landing-display text-h3 text-emerald-pulse transition-colors duration-300 group-hover:text-forest"
        >
          {continueLabel}
          <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">
            →
          </span>
        </motion.span>
      </div>

      {/* RIGHT — SUPPORTING VISUAL & CONTEXT */}
      <div className="relative flex flex-col justify-center lg:col-span-6">
        <div className="relative overflow-hidden rounded-[16px] border border-sage-mist bg-canvas p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-pulse animate-pulse" />
            <p className="font-mono text-label uppercase tracking-[0.14em] text-pine-ink/60">
              Tentang Environesia Group
            </p>
          </div>

          <p className="mt-4 font-landing-body text-body leading-relaxed text-pine-ink/80">
            Environesia Group adalah ecosystem perusahaan dengan keahlian yang berbeda yang terhubung untuk membangun solusi bagi bisnis, lingkungan, dan keberlanjutan.
          </p>

          {/* Abstract Ecosystem Graphic */}
          <div className="relative mt-6 flex h-52 w-full items-center justify-center overflow-hidden rounded-[12px] border border-sage-mist/70 bg-pine-ink/[0.06] md:h-60">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 360 176"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Concentric Guide Circles */}
              <circle cx="180" cy="88" r="70" stroke="var(--color-sage-mist)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="180" cy="88" r="42" stroke="var(--color-sage-mist)" strokeWidth="1" />

              {/* Connecting Lines to Satellite Nodes */}
              <line x1="180" y1="88" x2="118" y2="46" stroke="var(--color-emerald-pulse)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="180" y1="88" x2="242" y2="46" stroke="var(--color-sky-aqua)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="180" y1="88" x2="252" y2="126" stroke="var(--color-sunrise-amber)" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="180" y1="88" x2="108" y2="126" stroke="#454A85" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="180" y1="88" x2="180" y2="152" stroke="#A8482D" strokeWidth="1.5" strokeOpacity="0.4" />

            </svg>

            {/* Group Logo — the ecosystem's own focal point. Deliberately
                the largest, boldest element in the graphic: filled with the
                CMS logoUrl/siteName when set, otherwise a solid dark-green
                anchor (never a hardcoded image or color swap based on
                anything but presence of the CMS logo). */}
            <div
              className={`absolute z-20 flex aspect-square h-20 w-20 shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full p-3 shadow-lg md:h-28 md:w-28 md:p-4 ${
                logoUrl ? 'border border-gray-100 bg-white' : 'bg-pine-ink'
              }`}
              style={{ left: '50%', top: '50%' }}
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={siteName} width={84} height={84} className="h-full w-full object-contain" />
              ) : null}
            </div>

            {/* 5 Satellite Entity Nodes — real company logos, not solid
                dots. Positioned in CSS (NODE_POSITIONS) over the SVG at the
                exact points its own connecting lines terminate at; the SVG
                itself, and where those lines point, is untouched. Kept
                visibly smaller than the center focal point at every
                breakpoint, and shadowed to read as floating above the
                (slightly darker) box background. */}
            {entities.slice(0, 5).map((entity, index) => (
              <div
                key={entity.id}
                className="absolute z-10 flex aspect-square h-12 w-12 shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-2 shadow-md md:h-16 md:w-16 md:p-3"
                style={NODE_POSITIONS[index]}
              >
                {entity.logoUrl ? (
                  <Image src={entity.logoUrl} alt={entity.name} width={48} height={48} className="h-full w-full object-contain" />
                ) : null}
              </div>
            ))}
          </div>

          {/* Entity count — moved out of the diagram box entirely (was an
              absolute overlay, which any node/logo size increase could
              collide with again); as a normal-flow caption underneath it
              can never overlap a node. */}
          <div className="mt-3 flex items-center justify-end">
            <span className="rounded-full bg-canvas/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-pine-ink/60 border border-sage-mist">
              5 Entities · 1 Ecosystem
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

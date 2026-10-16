'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';
import type { Entity } from '@/lib/cms/entities';

const EASE = [0.16, 1, 0.3, 1] as const;

// Two orbit tiers, roughly matching the middle and outer ring radii, so
// brand logos visually sit "on" those rings rather than a third invented
// distance. Alternated per index for the organic, not-all-one-ring feel.
const ORBIT_TIER = [43, 34, 43, 34, 43];

// Optical size compensation, per entity slug — not all logos fill their
// canvas the same way. Measured directly (PIL bounding-box vs canvas):
// width is already consistent (~94%) across every logo except GreenLab
// (~78%, scaled up below to match). Height is the other axis, and there
// Bikin.co (~93%) and LSP (~91%) — both set in all-caps/stacked wordmarks
// with little vertical padding — draw noticeably taller than Environesia's
// own logo (~80%, the reference every other entity is compared against),
// so at an identical rendered width they read visibly larger. Scaled down
// to match; everyone else is left at 1 (no entry needed).
const OPTICAL_SCALE: Record<string, number> = {
  greenlab: 1.18,
  'bikin-indonesia-berdaya': 0.86,
  'lsp-praktisi-lingkungan': 0.87,
};

function nodePosition(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  const radius = ORBIT_TIER[index % ORBIT_TIER.length];
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

// One Group → expands → ecosystem: inner circle, then the group logo,
// then middle ring, then outer ring. Brand logos are handled separately
// below — they're visible immediately, no fade-in/stagger, and orbit the
// center continuously once mounted.
const sequence: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const innerCircleStep: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
};
const logoStep: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const ringStep: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export function EcosystemMap({ entities }: { entities: Entity[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={sequence}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="relative mx-auto aspect-square w-full max-w-[350px] sm:max-w-[440px] md:max-w-[520px]"
    >
      {/* Step 1 — inner circle, filled, very soft accent tint. Sized with
          headroom around the logo below (not a tight fit) so the full
          wordmark+tagline lockup always has room to sit inside it rather
          than visually crowding or appearing to spill past its edge.
          Shrunk from the original 205/245/285px — at that size this circle
          (and the logo lockup inside it) reached close enough to the 34%
          orbit tier that a wide brand logo rotating through could visibly
          clip it; this smaller footprint keeps clear of every orbiting
          logo at every breakpoint without touching the orbit radius
          itself. */}
      <motion.div
        variants={innerCircleStep}
        className="absolute left-1/2 top-1/2 h-[135px] w-[135px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[165px] sm:w-[165px] md:h-[190px] md:w-[190px]"
        style={{ backgroundColor: 'rgba(42, 119, 147, 0.07)' }}
      />

      {/* Step 2 — full Environesia logo, the focal point and anchor:
          stays put, never rotates, never scales. The icon mark
          (public/brand/environesia-symbol.png, the standalone teal swoosh
          glyph — a real, separate brand asset, not a redraw) sits to the
          LEFT of the wordmark+tagline lockup (environesia-wordmark.png),
          vertically centered against it — matching the official lockup
          (icon beside the word, tagline wrapping below the word only),
          not the icon-stacked-on-top arrangement used in the previous
          pass. At the size the wordmark alone renders here, the matching
          leaf mark baked into its "e" reads as part of the letterform
          rather than as a distinct icon, so the standalone mark is placed
          beside it instead, exactly as the real lockup does. Both images
          are rendered at their real, unmodified aspect ratio via
          `object-contain`, no fixed height, no overflow-hidden on any
          ancestor, and no cropping of any kind. */}
      <motion.div
        variants={logoStep}
        className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-1.5 sm:gap-2 md:gap-2.5"
      >
        <Image
          src="/brand/environesia-symbol.png"
          alt="Lambang Environesia"
          width={1424}
          height={1523}
          className="h-auto w-[17px] object-contain sm:w-[20px] md:w-[24px]"
        />
        <Image
          src="/brand/environesia-wordmark.png"
          alt="Environesia — The World-Class Integrated Green Ecosystem"
          width={5466}
          height={1260}
          className="h-auto w-[100px] object-contain sm:w-[120px] md:w-[135px]"
        />
      </motion.div>

      {/* Step 3 — middle ring (stays still, never rotates) */}
      <motion.div
        variants={ringStep}
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9E4E8] opacity-60 sm:h-[300px] sm:w-[300px] md:h-[350px] md:w-[350px]"
      />

      {/* Step 4 — outer ring (stays still, never rotates) */}
      <motion.div
        variants={ringStep}
        className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9E4E8] opacity-45 sm:h-[400px] sm:w-[400px] md:h-[465px] md:w-[465px]"
      />

      {/* Brand logos — already in place, no entrance fade/stagger. Each
          sits in its own full-size rotating frame (.ecosystem-orbit) so it
          sweeps slowly around the shared center; a counter-rotating inner
          wrapper (.ecosystem-orbit-counter) cancels that same rotation so
          the logo image itself always stays upright — only its position
          orbits, never the mark. Hovering any node pauses the whole orbit
          (plain CSS, see globals.css), independent of the per-node
          lift/scale hover below. */}
      <div className="ecosystem-orbit-group pointer-events-none absolute inset-0">
        {entities.map((entity, index) => {
          const { x, y } = nodePosition(index, entities.length);
          if (!entity.logoUrl) return null;

          return (
            <div
              key={entity.id}
              className="ecosystem-orbit pointer-events-none absolute inset-0"
              style={{ transformOrigin: '50% 50%' }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <div className="ecosystem-orbit-counter">
                  <div className="group pointer-events-auto transition-transform duration-200 motion-reduce:transition-none hover:-translate-y-0.5">
                    {/* Static optical-size compensation lives on its own
                        layer so it never fights the hover scale below (both
                        are `transform`; an inline style and a CSS class on
                        the same element silently conflict — split them). */}
                    <div style={{ transform: `scale(${OPTICAL_SCALE[entity.slug ?? ''] ?? 1})` }}>
                      <Image
                        src={entity.logoUrl}
                        alt={entity.name}
                        width={300}
                        height={100}
                        className="h-auto w-[100px] object-contain transition-transform duration-200 motion-reduce:transition-none group-hover:scale-[1.03] sm:w-[122px] md:w-[148px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

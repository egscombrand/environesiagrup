'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Motion primitives scoped to the Direktur Utama & Dewan Direksi page.
// Built separately from the site-wide Reveal/RevealStagger components
// because this page's brief calls for specific numbers (stagger interval,
// clip-path reveal, line-draw) that don't belong in the shared, reused-
// everywhere-else components. All of them resolve to `transform`/`opacity`/
// `clip-path` only — never width/height/margin/padding — and every one
// disables itself under `prefers-reduced-motion` by skipping the
// `initial` state so content is simply present, nothing hidden behind
// motion that never plays.

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, amount: 0.18 } as const;

export function ClipRevealImage({
  children,
  className = '',
  durationMs = 900,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  durationMs?: number;
  /** 'up' clips from the bottom (reveals top-down); 'right' clips from the right (reveals left-to-right). */
  direction?: 'up' | 'right';
}) {
  const shouldReduceMotion = useReducedMotion();
  const hiddenClip = direction === 'up' ? 'inset(0 0 14% 0)' : 'inset(0 14% 0 0)';

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              clipPath: hiddenClip,
              opacity: 0,
              ...(direction === 'up' ? { y: 25 } : {}),
            }
      }
      whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: durationMs / 1000, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Standalone per-section reveal (no group/stagger context needed) — used
// for the modal's internally-scrolling sections, each of which enters the
// viewport independently as the user scrolls the modal's own content.
export function SectionReveal({
  children,
  className = '',
  distance = 12,
  durationMs = 450,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  durationMs?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: durationMs / 1000, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className = '',
  staggerMs = 100,
}: {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: staggerMs / 1000 } } };

  return (
    <motion.div
      variants={container}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  distance = 16,
  durationMs = 600,
  axis = 'y',
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  durationMs?: number;
  axis?: 'x' | 'y';
}) {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: durationMs / 1000, ease: EASE };
  const item: Variants =
    axis === 'x'
      ? { hidden: { opacity: 0, x: distance }, show: { opacity: 1, x: 0, transition } }
      : { hidden: { opacity: 0, y: distance }, show: { opacity: 1, y: 0, transition } };

  return (
    <motion.div variants={shouldReduceMotion ? undefined : item} className={className}>
      {children}
    </motion.div>
  );
}

// An accent line that "draws" from left to right instead of fading —
// consumes the same hidden/show variant context as StaggerItem, so it
// takes its turn in the enclosing StaggerGroup's sequence.
export function StaggerLineItem({ className = '', durationMs = 550 }: { className?: string; durationMs?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const item: Variants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: durationMs / 1000, ease: EASE } },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : item}
      style={{ transformOrigin: 'left' }}
      className={className}
    />
  );
}

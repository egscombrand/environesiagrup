'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Same fade-up project.md §4 prescribes — 24px, 500ms, [0.16, 1, 0.3, 1] —
// but applied per item rather than to the whole block. A grid that rises as
// one slab reads as a single mechanical movement; the same cards arriving
// 60ms apart read as choreography. It is the identical motion, sequenced.
const STAGGER_S = 0.06;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_S } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function RevealStagger({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div variants={shouldReduceMotion ? undefined : item} className={className}>
      {children}
    </motion.div>
  );
}

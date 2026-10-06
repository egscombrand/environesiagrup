'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { Entity } from '@/lib/cms/entities';
import { EcosystemExhibition } from './ecosystem-exhibition';

const EASE = [0.16, 1, 0.3, 1] as const;

const headerStep: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Entry point for the "Kenali Perusahaan dalam Ekosistem Kami" section.
// EcosystemExhibition owns its own heading now (not this wrapper) — the
// whole section, heading included, is sized to fit one viewport without a
// scroll, so the heading has to count toward that same height budget
// rather than living in a separate, unconstrained block above it.
export function BrandTabs({ entities }: { entities: Entity[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="pb-14 pt-12">
      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerStep}
        className="mx-auto w-[92vw] md:w-[min(92vw,1380px)]"
      >
        <EcosystemExhibition entities={entities} />
      </motion.div>
    </section>
  );
}

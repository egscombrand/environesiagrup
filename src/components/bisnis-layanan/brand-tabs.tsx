'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { Entity } from '@/lib/cms/entities';
import type { StoryScene } from '@/lib/cms/story-scenes';
import { EcosystemExhibition } from './ecosystem-exhibition';

const EASE = [0.16, 1, 0.3, 1] as const;

const headerStep: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Entry point for the "Kenali Perusahaan dalam Ekosistem Kami" section.
// EcosystemExhibition owns its own heading now (not this wrapper) — an
// editorial 50/50 layout (dominant photo + a full information column, plus
// a real-photo carousel per brand), so unlike the old single-viewport card
// it's allowed to take the height its content actually needs.
export function BrandTabs({
  entities,
  scenesByEntity,
  groupPhoto,
}: {
  entities: Entity[];
  scenesByEntity: Record<string, StoryScene[]>;
  groupPhoto: { imageSrc: string | null; imageAlt: string };
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="pb-20 pt-16 md:pb-28 md:pt-20">
      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={headerStep}
        className="mx-auto w-[92vw] md:w-[min(92vw,1380px)]"
      >
        <EcosystemExhibition entities={entities} scenesByEntity={scenesByEntity} groupPhoto={groupPhoto} />
      </motion.div>
    </section>
  );
}

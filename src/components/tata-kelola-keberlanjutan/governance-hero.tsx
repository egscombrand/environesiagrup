'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { HeroPhoto } from '@/components/hero-photo';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section 1 of every Tata Kelola & Keberlanjutan route. The copy and photos come
 * in as props, so every route shows the same Section 1 and only the navigation's
 * active tab and the content below Section 3 change. A missing photo falls back
 * to the default office image in HeroPhoto. The fade-up on load is skipped under
 * prefers-reduced-motion.
 */
export function GovernanceHero({
  eyebrow,
  title,
  description,
  desktopImage,
  mobileImage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  desktopImage?: string | null;
  mobileImage?: string | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const reveal = shouldReduceMotion
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE } };

  return (
    <section className="relative -mt-[var(--header-h)] flex min-h-[calc(50vh+var(--header-h))] w-full items-center overflow-hidden bg-pine-ink">
      <HeroPhoto desktopSrc={desktopImage ?? undefined} mobileSrc={mobileImage ?? undefined} />
      <div className="absolute inset-0 bg-pine-ink/25" />

      <div className="relative z-10 w-full px-6 pt-[var(--header-h)] text-center md:px-8">
        <div className="mx-auto max-w-[1000px] py-16 md:py-20">
          <motion.p
            {...reveal}
            className="font-landing-body text-[12px] font-semibold uppercase tracking-[0.16em] text-white/85 md:text-[13px]"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            {...reveal}
            className="mt-4 font-landing-display text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[72px]"
          >
            {title}
          </motion.h1>
          <motion.p
            {...reveal}
            className="mx-auto mt-6 max-w-[900px] font-landing-body text-[16px] leading-[1.35] text-white md:text-[19px]"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

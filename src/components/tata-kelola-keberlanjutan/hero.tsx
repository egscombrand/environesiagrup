'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section 1 of Tata Kelola & Keberlanjutan — the parent page's full-width hero,
 * laid out to match the approved reference: centred headline and description
 * over the existing office photo (public/BannerS2.jpg, cover). A light tint
 * keeps the building and sky visible. The only motion is a fade-up on load,
 * skipped for users who prefer reduced motion.
 */
export function TataKelolaHero() {
  const shouldReduceMotion = useReducedMotion();
  const reveal = shouldReduceMotion
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE } };

  return (
    <section className="relative -mt-[var(--header-h)] flex min-h-[460px] w-full items-center overflow-hidden bg-pine-ink md:min-h-[560px]">
      <Image src="/BannerS2.jpg" alt="" fill priority quality={100} sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-pine-ink/25" />

      <div className="relative z-10 w-full px-6 pt-[var(--header-h)] text-center md:px-8">
        <div className="mx-auto max-w-[1000px] py-16 md:py-20">
          <motion.h1
            {...reveal}
            className="font-landing-display text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[72px]"
          >
            Tata Kelola dan Keberlanjutan
          </motion.h1>
          <motion.p
            {...reveal}
            className="mx-auto mt-6 max-w-[900px] font-landing-body text-[16px] leading-[1.35] text-white md:text-[19px]"
          >
            Sebagai bagian dari Environesia Company Group, kami percaya bahwa pertumbuhan bisnis harus berjalan bersama
            dengan cara kerja yang bertanggung jawab. Kualitas layanan, integritas, keselamatan, kepedulian terhadap
            lingkungan, serta tanggung jawab kepada para pemangku kepentingan menjadi bagian dari standar yang kami pegang
            dalam menjalankan kegiatan usaha.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

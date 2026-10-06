'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { BookOpen, FileCheck2, FlaskConical, Shirt, Sprout, type LucideIcon } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

// The ecosystem's 5 capabilities, each named to its real associated
// brand(s) — "Media & Edukasi" names none, since it's a capability the
// ecosystem provides collectively, not a separate company (never invented
// as a fictional brand).
const ECOSYSTEM_POINTS: { title: string; description: string; icon: LucideIcon; brand: string }[] = [
  {
    title: 'Konsultansi & Lingkungan',
    description:
      'Mendampingi kebutuhan pengelolaan, kajian, kepatuhan, dan pengembangan lingkungan dalam berbagai konteks proyek dan organisasi.',
    icon: FileCheck2,
    brand: 'Environesia',
  },
  {
    title: 'Laboratorium & Pengujian',
    description:
      'Menghasilkan data melalui pengujian dan analisis laboratorium untuk mendukung kebutuhan teknis, regulasi, dan pengambilan keputusan.',
    icon: FlaskConical,
    brand: 'GreenLab',
  },
  {
    title: 'Kompetensi & Sertifikasi',
    description:
      'Mengembangkan kompetensi profesional melalui pembelajaran, pelatihan, asesmen, dan sertifikasi yang relevan dengan kebutuhan industri.',
    icon: Sprout,
    brand: 'GreenSkill + LSP Praktisi Lingkungan Indonesia',
  },
  {
    title: 'Apparel & Seragam',
    description:
      'Mendukung kebutuhan apparel, seragam, dan pakaian kerja untuk organisasi maupun aktivitas profesional.',
    icon: Shirt,
    brand: 'Bikin Indonesia Berdaya',
  },
  {
    title: 'Media & Edukasi',
    description:
      'Mengembangkan media edukasi lingkungan bersama praktisi, akademisi, dan pemangku kepentingan untuk menghadirkan pengetahuan yang lebih utuh.',
    icon: BookOpen,
    brand: 'Kapabilitas Ekosistem',
  },
];

const imageStep: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};
const contentStep: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const listContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const justifyStyle = { textJustify: 'inter-word', hyphens: 'auto', overflowWrap: 'break-word' } as const;

export function GrowingEcosystemSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    // Deliberately not the shared `Section` wrapper (which caps at 1280px)
    // — this round needs a wider, ±1380px "boxed" container, but "boxed"
    // here means max-width + margin-auto only: no border, no background
    // frame, no radius. Kept deliberately compact (padding-block, not the
    // rest of the page's taller py-24) so the gap to Section 2 above and
    // whatever follows below stays close and natural rather than reading
    // as a big empty gulf.
    <section className="py-11 md:py-16">
      <div className="mx-auto w-[92vw] md:w-[min(92vw,1380px)]">
        {/* Mirror of Section 2's layout, flipped — visual on the left
            instead of the right, so the page gains a TEXT → VISUAL →
            VISUAL → TEXT rhythm. A strict, equal 50/50 (`1fr 1fr`) split so
            the photo reads as a full, equally-weighted half of the
            composition — only the container width and column gap grow on
            larger screens, never the ratio itself. */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr] md:items-stretch md:gap-x-[clamp(56px,5vw,80px)]">
            <motion.div
              variants={imageStep}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex w-full items-center justify-center md:h-full"
            >
              <Image
                src="/ekosistgrup.png"
                alt="Tim Environesia Company Group"
                width={1887}
                height={2403}
                className="h-auto w-full max-w-[380px] object-contain object-center md:h-full md:w-full md:max-w-none"
              />
            </motion.div>

            <motion.div
              variants={contentStep}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="mb-5 font-landing-display text-left text-[clamp(32px,3vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#2A7793]">
                Ekosistem yang Terus Bertumbuh
              </h2>
              <p
                className="mb-6 max-w-[760px] text-justify text-[16px] leading-[1.7] text-[#444444]"
                style={justifyStyle}
              >
                Setiap perusahaan di dalam Environesia memiliki keahlian dan fokusnya sendiri. Namun, semuanya
                tumbuh dari semangat yang sama: membangun kompetensi, menjaga standar, dan menghadirkan solusi
                yang relevan dengan kebutuhan pelanggan.
              </p>

              {/* Five visual capability cards — each named to its real
                  associated brand so this section doubles as a map of the
                  ecosystem, not just a service list. */}
              <motion.ul
                variants={listContainer}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-3"
              >
                {ECOSYSTEM_POINTS.map((point) => {
                  const Icon = point.icon;

                  return (
                    <motion.li
                      key={point.title}
                      variants={listItem}
                      className="group flex gap-4 rounded-[14px] border border-[#E5E7EB] p-4 transition-colors duration-200 motion-reduce:transition-none hover:border-[#01B3A1]/40"
                    >
                      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center text-[#01B3A1] transition-colors duration-200 motion-reduce:transition-none group-hover:text-[#018f81]">
                        <Icon
                          size={24}
                          strokeWidth={1.7}
                          className="transition-transform duration-200 motion-reduce:transition-none group-hover:translate-x-[2px]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="mb-1 text-left text-[17px] font-bold leading-[1.35] text-[#01B3A1]">
                          {point.title}
                        </h3>
                        <p className="text-justify text-[15px] leading-[1.6] text-[#444444]" style={justifyStyle}>
                          {point.description}
                        </p>
                        <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#666666]">
                          {point.brand}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
        </div>
      </div>
    </section>
  );
}

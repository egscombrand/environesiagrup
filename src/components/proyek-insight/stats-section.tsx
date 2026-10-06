'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Briefcase, Building2, Globe, History, MapPin, type LucideIcon } from 'lucide-react';

const PRIMARY = '#2A7793';
const TEXT = '#444444';
const DESCRIPTION_STYLE = { fontSize: '15px', fontWeight: 400, lineHeight: 1.65, color: TEXT } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

type Stat = {
  icon: LucideIcon;
  value: string;
  unit: string;
  description: string;
};

// Exactly 5, deliberately equal — no featured/highlighted stat, no ranking.
// "Sejak 2016" is intentionally not its own stat: that fact is already
// covered by "10+ Tahun".
const STATS: Stat[] = [
  {
    icon: History,
    value: '10+',
    unit: 'Tahun',
    description: 'Pengalaman dan kapabilitas yang dibangun sejak 2016.',
  },
  {
    icon: Briefcase,
    value: '1.000+',
    unit: 'Proyek',
    description: 'Proyek yang telah dikerjakan di berbagai sektor dan kebutuhan lingkungan.',
  },
  {
    icon: MapPin,
    value: '38',
    unit: 'Provinsi',
    description: 'Pengalaman proyek yang mencakup berbagai wilayah di Indonesia.',
  },
  {
    icon: Globe,
    value: '10',
    unit: 'Negara',
    description: 'Pengalaman dan keterlibatan dalam proyek serta kolaborasi internasional.',
  },
  {
    icon: Building2,
    value: '5',
    unit: 'Perusahaan',
    description: 'Lima perusahaan dalam ekosistem Environesia Company Group.',
  },
];

const headingStep: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardStep: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * "Satu Dekade dalam Angka" — a static, equal-weight 5-stat summary shown
 * once right below the Portofolio Proyek intro, above the tab bar. Same
 * position regardless of the active tab, same reasoning as
 * ProyekInsightIntroSection right above it.
 *
 * Each card pairs its icon with the number/label on one horizontal row
 * (icon left, "10+ Tahun" right of it) rather than stacked — the
 * description sits on its own line below that row.
 */
export function ProyekInsightStatsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-b border-pine-ink/10 bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <motion.h2
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headingStep}
          className="text-center font-landing-display text-[34px] font-bold leading-[1.15] md:text-[46px]"
          style={{ color: PRIMARY }}
        >
          Satu Dekade dalam Angka
        </motion.h2>

        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={cardGrid}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.unit}
              variants={shouldReduceMotion ? undefined : cardStep}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group flex h-full flex-col rounded-[14px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#2A7793]/40 hover:shadow-md motion-reduce:transition-none"
            >
              <div className="flex items-center gap-3">
                <stat.icon
                  className="h-[26px] w-[26px] shrink-0 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                  style={{ color: PRIMARY }}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="font-landing-display text-[20px] font-bold leading-tight" style={{ color: PRIMARY }}>
                  {stat.value} {stat.unit}
                </p>
              </div>

              <p className="mt-4 font-landing-body" style={DESCRIPTION_STYLE}>
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

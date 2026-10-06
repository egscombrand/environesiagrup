'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const IDENTITY = '#2A7793';
const ACCENT = '#0CB19F';
const EASE = [0.22, 1, 0.36, 1] as const;

const COMMITMENTS = [
  {
    title: 'Integritas dalam setiap keputusan',
    description: 'Menjaga kejujuran, keterbukaan, dan objektivitas dalam menjalankan pekerjaan.',
  },
  {
    title: 'Peduli terhadap lingkungan',
    description:
      'Menerapkan prinsip pengelolaan lingkungan bukan hanya dalam layanan yang kami berikan, tetapi juga dalam cara kami menjalankan operasional.',
  },
  {
    title: 'Keselamatan sebagai bagian dari pekerjaan',
    description: 'Memastikan aspek keselamatan dan kesehatan kerja menjadi bagian dari setiap aktivitas, terutama pekerjaan di lapangan.',
  },
  {
    title: 'Bertanggung jawab terhadap hasil',
    description:
      'Setiap pekerjaan kami tempatkan sebagai tanggung jawab yang harus dapat dipertanggungjawabkan kepada klien dan pemangku kepentingan.',
  },
];

// Number → label → body, in that order — `staggerChildren` fires child
// variants in declaration order, so as long as each chapter nests its
// number first, its label second, its body third, this one container
// variant is all the sequencing any of them need.
const chapterContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};
const numberVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.08, transition: { duration: 0.6, ease: EASE } },
};
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** A large, thin, low-opacity chapter numeral — purely editorial texture
 * behind the real heading, never a card or a badge. `aria-hidden` since
 * it carries no information a screen reader needs (the heading text
 * already conveys "this is the Visi/Misi/Komitmen chapter"). `center`
 * is for Komitmen, whose heading is centered rather than left-aligned
 * like Visi/Misi's own columns. */
function ChapterNumber({ value, center = false }: { value: string; center?: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      variants={numberVariant}
      className={`pointer-events-none absolute -top-2 font-landing-display text-[64px] font-light leading-none text-[#111111] md:-top-4 md:text-[92px] ${
        center ? 'left-1/2 -translate-x-1/2' : 'left-0'
      }`}
    >
      {value}
    </motion.span>
  );
}

/**
 * The connecting line between chapters — a thin, low-opacity rule, not a
 * network or a data-flow graphic. Desktop: draws left→right under
 * Visi/Misi, then a short vertical drop toward "03 Komitmen", with a
 * small dot tracing the same path once. Mobile: a single vertical line
 * in its place, matching the stacked chapter order. Renders once, the
 * first time it scrolls into view; `reducedMotion` skips straight to the
 * fully-drawn, static end state.
 */
function ChapterConnector({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative mx-auto h-14 max-w-[1100px] px-6 md:h-16" aria-hidden="true">
      <div className="absolute inset-x-6 top-0 hidden h-full lg:block">
        <motion.div
          className="absolute left-0 right-0 top-0 h-px"
          style={{ backgroundColor: `${IDENTITY}33`, transformOrigin: 'left' }}
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={reducedMotion ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: `${IDENTITY}33`, transformOrigin: 'top' }}
          initial={reducedMotion ? false : { scaleY: 0 }}
          whileInView={reducedMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE, delay: reducedMotion ? 0 : 0.85 }}
        />
        {reducedMotion ? null : (
          <motion.span
            className="absolute top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: ACCENT }}
            initial={{ left: '0%', top: 0 }}
            whileInView={{ left: ['0%', '50%', '50%'], top: [0, 0, '100%'] }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.3, ease: EASE, times: [0, 0.68, 1] }}
          />
        )}
      </div>

      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 lg:hidden">
        <motion.div
          className="h-full w-full"
          style={{ backgroundColor: `${IDENTITY}33`, transformOrigin: 'top' }}
          initial={reducedMotion ? false : { scaleY: 0 }}
          whileInView={reducedMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
    </div>
  );
}

/**
 * "Visi, Misi & Komitmen" — the same content and layout as before
 * (50:50 Visi/Misi on desktop, stacked on mobile; Komitmen's 2×2 cards
 * below), with one addition: an "Editorial Chapter" motif — subtle
 * "01/02/03" numerals and a thin connecting line/dot tracing
 * Visi → Misi → Komitmen — plus a light, one-time entrance animation
 * per chapter (number → label → body) and a staggered fade-up for the
 * commitment cards. Still no 3D, no globe, no network: every motion
 * here is a CSS `transform`/`opacity` animation, plays once on first
 * scroll into view, and is skipped entirely under `prefers-reduced-motion`
 * (content renders in its final state immediately).
 */
export function VisiMisiKomitmenExperience() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div className="flex flex-col">
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-[1100px] gap-x-14 gap-y-10 md:grid-cols-2">
          <motion.div
            className="relative pt-14 md:pt-20"
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView={reducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.4 }}
            variants={chapterContainer}
          >
            <ChapterNumber value="01" />
            <motion.p
              variants={fadeUpVariant}
              className="font-landing-display text-[17px] font-extrabold uppercase tracking-[0.12em]"
              style={{ color: IDENTITY }}
            >
              Visi
            </motion.p>
            <motion.p
              variants={fadeUpVariant}
              className="mt-3 font-landing-display font-bold text-[#111111]"
              style={{ fontSize: 'clamp(26px, 2vw + 12px, 34px)', lineHeight: 1.35 }}
            >
              Menjadi Perusahaan Ekosistem Lingkungan Terintegrasi Berkelas Dunia <span style={{ color: IDENTITY }}>di Indonesia</span>
            </motion.p>
          </motion.div>

          <motion.div
            className="relative pt-14 md:pt-20"
            initial={reducedMotion ? 'visible' : 'hidden'}
            whileInView={reducedMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.4 }}
            variants={chapterContainer}
          >
            <ChapterNumber value="02" />
            <motion.p
              variants={fadeUpVariant}
              className="font-landing-display text-[17px] font-extrabold uppercase tracking-[0.12em]"
              style={{ color: IDENTITY }}
            >
              Misi
            </motion.p>
            <motion.p
              variants={fadeUpVariant}
              className="mt-3 font-landing-display text-[18px] font-normal leading-[1.7] text-[#111111] md:text-[19px]"
              style={{ textAlign: 'justify' }}
            >
              Misi kami memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi,
              ketepatan waktu pelayanan, jaringan kerjasama yang luas, hubungan emosional yang baik antara tim dan pelanggan.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <ChapterConnector reducedMotion={reducedMotion} />

      <section className="px-6 py-10 md:py-14">
        <motion.div
          className="relative mx-auto max-w-[720px] pt-14 text-center md:pt-20"
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.4 }}
          variants={chapterContainer}
        >
          <ChapterNumber value="03" center />
          <motion.p variants={fadeUpVariant} className="font-landing-display text-[30px] font-extrabold text-[#111111] md:text-[38px]">
            Komitmen
          </motion.p>
          <motion.p
            variants={fadeUpVariant}
            className="mt-3 font-landing-display text-[18px] font-normal leading-[1.6] text-pine-ink/70 md:text-[20px]"
            style={{ textAlign: 'justify' }}
          >
            Memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 grid max-w-[900px] gap-5 sm:grid-cols-2"
          initial={reducedMotion ? 'visible' : 'hidden'}
          whileInView={reducedMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
        >
          {COMMITMENTS.map((item) => (
            <motion.div
              key={item.title}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
              className="h-full rounded-2xl border border-line bg-paper p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,43,34,0.06)]"
            >
              <h3 className="font-landing-display text-[21px] font-bold text-[#111111]">{item.title}</h3>
              <p className="mt-2.5 font-landing-display text-[16px] leading-[1.65] text-pine-ink/65" style={{ textAlign: 'justify' }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

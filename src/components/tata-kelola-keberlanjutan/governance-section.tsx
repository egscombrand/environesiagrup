'use client';

import { motion, MotionConfig } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const WAYS_OF_WORKING = [
  {
    title: 'Kejelasan Peran',
    description: 'Setiap fungsi, kewenangan, dan tanggung jawab ditetapkan secara jelas.',
  },
  {
    title: 'Standar & Pengendalian Mutu',
    description: 'Setiap pekerjaan dijalankan dengan standar profesional dan proses yang terukur.',
  },
  {
    title: 'Risiko & Pertimbangan',
    description: 'Keputusan mempertimbangkan informasi, risiko, kebutuhan klien, serta dampak yang mungkin ditimbulkan.',
  },
  {
    title: 'Evaluasi & Perbaikan',
    description: 'Hasil pekerjaan menjadi bagian dari evaluasi untuk menjaga kualitas dan mendorong perbaikan berkelanjutan.',
  },
];

const PRINCIPLES = [
  {
    title: 'Transparansi',
    label: 'Keterbukaan yang dapat ditelusuri',
    description:
      'Environesia menjaga keterbukaan informasi dan ketertelusuran proses dalam pekerjaan konsultansi, pengujian, dan layanan laboratorium sesuai lingkup dan kewenangannya.',
  },
  {
    title: 'Akuntabilitas',
    label: 'Setiap pekerjaan memiliki tanggung jawab',
    description:
      'Setiap pekerjaan memiliki peran, kewenangan, dan tanggung jawab yang jelas, mulai dari pelaksanaan hingga penyampaian hasil kepada klien.',
  },
  {
    title: 'Responsibility',
    label: 'Bertanggung jawab terhadap dampak',
    description:
      'Environesia mempertimbangkan tanggung jawab terhadap klien, karyawan, masyarakat, lingkungan, dan keberlanjutan usaha dalam menjalankan kegiatan perusahaan.',
  },
  {
    title: 'Independensi',
    label: 'Menjaga objektivitas profesional',
    description:
      'Penilaian dan hasil pekerjaan dijalankan berdasarkan data, metode, standar, dan kompetensi yang relevan tanpa kepentingan yang mengganggu objektivitas.',
  },
  {
    title: 'Fairness',
    label: 'Hubungan yang adil dan profesional',
    description: 'Environesia menjaga perlakuan yang adil dan profesional terhadap klien, karyawan, mitra, dan pemangku kepentingan.',
  },
];

/**
 * Section 2 of Tata Kelola & Keberlanjutan — written as a governance report
 * page rather than a landing section. Compact header, then two areas:
 * "Cara kami bekerja" as a two-column structured list with a thin vertical
 * governance line running down the left of the items, and "Prinsip Tata Kelola
 * dalam Praktik" on a soft neutral band as a tight two-column grid (the fifth
 * principle spans both columns). Sizes stay small and steady: no oversized
 * numbers or display type. Motion is limited to a section fade-up, a staggered
 * reveal of items, and the vertical line drawing in. MotionConfig
 * reducedMotion="user" drops transforms for users who prefer reduced motion.
 */
export function TataKelolaGovernanceSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-white px-6 py-[72px] font-landing-body md:px-8 md:py-[88px]">
        <div className="mx-auto max-w-[1200px]">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-[760px]"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2A7793]">02 · TATA KELOLA PERUSAHAAN</p>
            <h2 className="mt-3 break-words font-landing-display text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-[#2A7793] md:text-[40px]">
              Menjalankan Perusahaan dengan Tata Kelola yang Bertanggung Jawab
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-[#444444] md:text-[16px]">
              Tata kelola menjadi dasar bagi Environesia dalam menjalankan perusahaan secara profesional, menjaga kepercayaan,
              memastikan kualitas pekerjaan, serta mempertimbangkan dampak dari setiap keputusan terhadap pemangku kepentingan
              dan keberlanjutan perusahaan.
            </p>
          </motion.header>

          {/* Area 1 — how we run the company */}
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#DDE5E7] pt-10 md:mt-14 md:grid-cols-12 md:gap-12 md:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="min-w-0 md:col-span-4"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2A7793]">CARA KAMI BEKERJA</p>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#444444] md:text-[15px]">
                Tata kelola diterapkan melalui cara kami mengambil keputusan, menjalankan pekerjaan, menjaga kualitas, mengelola
                risiko, dan melakukan evaluasi.
              </p>
            </motion.div>

            <div className="relative min-w-0 pl-6 md:col-span-8">
              <motion.span
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{ transformOrigin: 'top center' }}
                className="absolute bottom-0 left-0 top-0 w-px bg-[#DDE5E7]"
                aria-hidden="true"
              >
                <span className="absolute left-[-2px] top-0 h-[5px] w-[5px] rounded-full bg-[#01B3A1]" />
              </motion.span>

              <ul>
                {WAYS_OF_WORKING.map((item, index) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
                    className="border-b border-[#DDE5E7] py-5 first:pt-0 last:border-b-0 md:py-6"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-[13px] font-semibold tabular-nums text-[#01B3A1]">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="break-words text-[16px] font-semibold leading-snug text-[#2A7793] md:text-[17px]">{item.title}</h3>
                    </div>
                    <p className="mt-2 pl-[1.9rem] text-[14px] leading-[1.6] text-[#444444]">{item.description}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Area 2 — principles in practice, on a soft neutral band */}
          <div className="mt-14 bg-[#F5F8F9] px-6 py-10 md:mt-16 md:px-10 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="max-w-[760px]"
            >
              <h3 className="break-words font-landing-display text-[24px] font-bold leading-[1.25] text-[#2A7793] md:text-[28px]">
                Prinsip Tata Kelola dalam Praktik
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#444444] md:text-[15px]">
                Prinsip tata kelola yang berlaku kami terapkan melalui cara kerja yang sesuai dengan karakter Environesia sebagai
                perusahaan yang bergerak dalam konsultansi, pengujian, laboratorium, dan layanan lingkungan.
              </p>
            </motion.div>

            <ul className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7 md:mt-10 md:grid-cols-2">
              {PRINCIPLES.map((principle, index) => (
                <motion.li
                  key={principle.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
                  className={`min-w-0 border-t border-[#DDE5E7] pt-5 transition-colors duration-200 md:hover:border-[#01B3A1] ${
                    index === PRINCIPLES.length - 1 ? 'md:col-span-2' : ''
                  }`}
                >
                  <h3 className="break-words font-landing-display text-[18px] font-semibold leading-snug text-[#2A7793] md:text-[20px]">
                    {principle.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#666666]">{principle.label}</p>
                  <p className="mt-3 text-[14px] leading-[1.6] text-[#444444]">{principle.description}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

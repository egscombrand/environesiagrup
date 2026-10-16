import Image from 'next/image';
import type { ReactNode } from 'react';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';

// Sampled directly (pixel-measured) from the approved reference comp for
// this section — same convention already used for capabilities-grid's own
// one-off heading color. Reserved for the heading and the signature box's
// title line only.
const HEADING_COLOR = '#2A7793';

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-pine-ink">{children}</strong>;
}

/**
 * The Direktur Utama's real 10th-anniversary message — six paragraphs,
 * supplied verbatim (matched 1:1 against a supplied reference image, which
 * is also why the heading above it is hardcoded rather than pulled from
 * i18n now). Real, document-specific Indonesian content, so it is not
 * translated per locale; only the signature's title line is.
 */
function MessageBody() {
  return (
    <div className="mt-6 space-y-4 text-justify font-landing-body text-body text-pine-ink/80 md:mt-8">
      <p>
        <Strong>
          Dalam kurun waktu sepuluh tahun, Environesia tumbuh dari sebuah perusahaan konsultansi lingkungan menjadi
          mitra lingkungan tepercaya bagi masyarakat, pemerintah, hingga berbagai sektor industri.
        </Strong>{' '}
        Perjalanan tersebut dibangun melalui pengalaman, pembelajaran, dan komitmen untuk menghadirkan layanan yang
        relevan dengan kebutuhan pengelolaan lingkungan yang terus berkembang.
      </p>
      <p>
        Hingga saat ini,{' '}
        <Strong>lebih dari 1.000 proyek telah kami selesaikan di 38 provinsi dan 10 negara</Strong>, mencakup
        berbagai sektor dan karakteristik kebutuhan. Dari proyek infrastruktur, energi, pertambangan, kawasan
        industri, hingga berbagai fasilitas publik, setiap pekerjaan memberikan pengalaman baru sekaligus memperluas
        pemahaman kami terhadap tantangan lingkungan di lapangan.
      </p>
      <p>
        Bagi kami, angka tersebut bukan sekadar pencapaian.{' '}
        <Strong>Setiap proyek merepresentasikan kepercayaan yang diberikan oleh klien</Strong> dan tanggung jawab
        yang harus kami jawab melalui pekerjaan yang terukur, profesional, dan dapat dipertanggungjawabkan.
      </p>
      <p>
        Pertumbuhan Environesia juga tidak terlepas dari upaya untuk terus memperkuat{' '}
        <Strong>kompetensi teknis dan kapasitas sumber daya manusia</Strong>. Kami percaya bahwa kualitas layanan
        lingkungan tidak hanya ditentukan oleh pengalaman, tetapi juga oleh kemampuan untuk terus belajar, mengikuti
        perkembangan regulasi, teknologi, serta kebutuhan industri.
      </p>
      <p>
        Di setiap langkahnya, <Strong>profesionalisme dan integritas menjadi prinsip yang kami jaga.</Strong> Kami
        berupaya membangun hubungan jangka panjang dengan klien melalui keterbukaan, ketepatan dalam bekerja, serta
        komitmen untuk memberikan solusi yang sesuai dengan kebutuhan dan kondisi nyata di lapangan.
      </p>
      <p>
        <Strong>
          Sepuluh tahun perjalanan adalah sebuah pencapaian, tetapi juga menjadi awal dari perjalanan berikutnya.
        </Strong>{' '}
        Dengan pengalaman yang telah dibangun dan ecosystem yang terus berkembang, Environesia berkomitmen untuk
        terus bertumbuh sebagai mitra yang mampu memberikan kontribusi nyata bagi lingkungan, industri, dan
        pembangunan yang lebih berkelanjutan.
      </p>
    </div>
  );
}

export async function LeadershipMessage({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);

  return (
    <Section className="bg-[#FBFBF9]" innerStyle={{ maxWidth: '1600px' }}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:items-start md:gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <Reveal>
          <div className="mx-auto max-w-[380px] md:max-w-none">
            {/* The source photo already carries its own brand-teal backdrop —
                real asset, used as supplied, not a plain headshot we're free
                to restyle. A fixed, moderate aspect ratio (not stretched to
                match the message column) keeps the photo premium without
                letting it dominate or run unnaturally long next to six
                paragraphs of text. */}
            <div className="aspect-[2/3] w-full overflow-hidden rounded-[20px]">
              <Image
                src="/leadership/direktur-utama.png"
                alt="Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng. — Direktur Utama PT Environesia Global Saraya"
                width={1314}
                height={2154}
                quality={100}
                // Not this page's actual LCP element, but `priority` also
                // disables native lazy-loading — needed here because
                // `loading="lazy"` never fired the fetch even after this
                // section scrolled into view, a real Chromium timing quirk
                // with a CSS Grid row whose stretched height resolves late.
                // This is the section's primary visual anchor, so skipping
                // lazy-load is the right call anyway.
                priority
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="mt-4 rounded-[14px] border px-5 py-4 text-center" style={{ borderColor: `${HEADING_COLOR}59` }}>
              <p className="font-landing-display text-[16px] font-bold leading-snug text-pine-ink">
                Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.
              </p>
              <p className="mt-1 text-[14px] leading-snug" style={{ color: HEADING_COLOR }}>
                {t.beranda.pesanPimpinanJabatan}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            {title ? (
              <p className="font-mono text-label uppercase tracking-[0.14em] text-pine-ink/50">{title}</p>
            ) : null}
            <h2
              className="font-landing-display text-[32px] font-bold leading-[1.1] md:text-[44px] lg:text-[48px]"
              style={{ color: HEADING_COLOR }}
            >
              1 Dekade Menghadirkan Dampak, Inovasi dan Solusi Nyata
            </h2>

            <MessageBody />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

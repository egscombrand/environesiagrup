import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { messagesFor } from '@/i18n/messages';

const ROUTE = findTentangKamiRoute('penghargaan');
const ACCENT = '#0DA19D';

export function PenghargaanSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <>
      <Section>
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.tentangKami.judul}</p>
          <h1 className="mt-4 font-landing-display text-display font-bold text-pine-ink">{ROUTE.label}</h1>
          <p className="mt-4 max-w-2xl font-landing-body text-body text-pine-ink/70">{ROUTE.deskripsi}</p>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <div className="rounded-[20px] border border-line bg-stone px-8 py-16 text-center">
            <p className="font-mono text-label uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
              Segera Hadir
            </p>
            <p className="mx-auto mt-3 max-w-md font-landing-display text-[22px] font-bold text-pine-ink">
              Penghargaan dan pencapaian akan ditampilkan di sini
            </p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.6] text-pine-ink/60">
              Setiap penghargaan akan disertai tahun, pemberi penghargaan, dan dokumentasinya begitu
              tersedia secara resmi.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

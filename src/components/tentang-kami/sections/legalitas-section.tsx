import { Section } from '@/components/layout/section';
import { LegalitasBrowser } from '@/components/tentang-kami/sections/legalitas-browser';
import { StaggerGroup, StaggerItem, StaggerLineItem } from '@/components/tentang-kami/sections/director-motion';
import { LEGALITAS_ENTITIES } from '@/lib/legalitas-data';
import { findTentangKamiRoute } from '@/lib/tentang-kami-routes';
import { messagesFor } from '@/i18n/messages';

const ROUTE = findTentangKamiRoute('legalitas');

export function LegalitasSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <Section className="py-8 md:py-10">
      <StaggerGroup staggerMs={100}>
        <StaggerItem distance={12} durationMs={500}>
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">{t.tentangKami.judul}</p>
        </StaggerItem>
        <StaggerItem distance={20} durationMs={650}>
          <h1 className="mt-2 font-landing-display text-display font-bold leading-[1.15] text-[#111111]">{ROUTE.label}</h1>
        </StaggerItem>
        <StaggerItem distance={16} durationMs={600}>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.7] text-[#444444]">{ROUTE.deskripsi}</p>
        </StaggerItem>
        <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-14 bg-[#2A7793]" />
      </StaggerGroup>

      <div className="mt-5 md:mt-6">
        <LegalitasBrowser entities={LEGALITAS_ENTITIES} />
      </div>

      <div className="mt-12 border-t border-[#E5E7EB] pt-8">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">Legal Entity First</p>
        <p className="mt-2 max-w-[68ch] text-[14px] leading-[1.7] text-[#666666]">
          Dokumen pada halaman ini ditampilkan berdasarkan entitas pemiliknya. Legalitas, perizinan, sertifikasi, dan
          akreditasi dapat berbeda sesuai badan hukum, bidang kegiatan, dan ruang lingkup operasional masing-masing
          entitas.
        </p>
      </div>
    </Section>
  );
}

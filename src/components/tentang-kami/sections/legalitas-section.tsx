import { Section } from '@/components/layout/section';
import { LegalitasBrowser } from '@/components/tentang-kami/sections/legalitas-browser';
import { StaggerGroup, StaggerItem, StaggerLineItem } from '@/components/tentang-kami/sections/director-motion';
import { getLegalEntities } from '@/lib/cms/legal';
import { getLegalitasPage } from '@/lib/cms/legalitas-page';
import { messagesFor } from '@/i18n/messages';

export async function LegalitasSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const [entities, content] = await Promise.all([getLegalEntities(), getLegalitasPage()]);

  return (
    <Section className="py-8 md:py-10">
      <StaggerGroup staggerMs={100}>
        <StaggerItem distance={12} durationMs={500}>
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">{t.tentangKami.judul}</p>
        </StaggerItem>
        <StaggerItem distance={20} durationMs={650}>
          <h1 className="mt-2 font-landing-display text-display font-bold text-[#111111]">{content.title}</h1>
        </StaggerItem>
        <StaggerItem distance={16} durationMs={600}>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.7] text-[#444444]">{content.description}</p>
        </StaggerItem>
        <StaggerLineItem durationMs={550} className="mt-4 h-[2px] w-14 bg-[#2A7793]" />
      </StaggerGroup>

      <div className="mt-5 md:mt-6">
        <LegalitasBrowser entities={entities} />
      </div>

      <div className="mt-12 border-t border-[#E5E7EB] pt-8">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-[#2A7793]">{content.noteLabel}</p>
        <p className="mt-2 max-w-[68ch] text-small text-[#666666]">{content.noteText}</p>
      </div>
    </Section>
  );
}

import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { VisiMisiKomitmenExperience } from '@/components/tentang-kami/visi-misi-komitmen/visi-misi-komitmen-experience';
import { messagesFor } from '@/i18n/messages';

/**
 * "Visi, Misi & Komitmen" — plain editorial typography. See
 * `VisiMisiKomitmenExperience` for the three content blocks themselves.
 */
export function VisiMisiSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <>
      <Section className="pb-6 pt-10 md:pb-8 md:pt-14">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.tentangKami.judul}</p>
          <h1 className="mt-3 font-landing-display text-[34px] font-bold text-pine-ink md:text-[40px] lg:text-[46px]">
            Visi, Misi & Komitmen
          </h1>
        </Reveal>
      </Section>

      <VisiMisiKomitmenExperience />
    </>
  );
}

import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { VisiMisiKomitmenExperience } from '@/components/tentang-kami/visi-misi-komitmen/visi-misi-komitmen-experience';
import { messagesFor } from '@/i18n/messages';
import { getVisiMisi } from '@/lib/cms/visi-misi';

/**
 * "Visi, Misi & Komitmen" — plain editorial typography. The copy comes from the
 * database (see `getVisiMisi`); `VisiMisiKomitmenExperience` lays out the blocks.
 */
export async function VisiMisiSection({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const content = await getVisiMisi();

  return (
    <>
      <Section className="pb-6 pt-10 md:pb-8 md:pt-14">
        <Reveal>
          <p className="font-mono text-label uppercase text-slate">{t.tentangKami.judul}</p>
          <h1 className="mt-3 font-landing-display text-display font-bold text-pine-ink">
            {content.title}
          </h1>
        </Reveal>
      </Section>

      <VisiMisiKomitmenExperience content={content} />
    </>
  );
}

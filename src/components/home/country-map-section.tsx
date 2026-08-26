import { getPublishedProjectPins } from '@/lib/cms/projects';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { CountryMap } from './country-map';

export async function CountryMapSection({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const pins = await getPublishedProjectPins();

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.jejakNegara}</h2>
        <div className="mt-8">
          <CountryMap pins={pins} />
        </div>
      </Reveal>
    </Section>
  );
}

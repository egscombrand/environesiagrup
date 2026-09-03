import { getPublishedProjectPins } from '@/lib/cms/projects';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { CountryMap } from './country-map';

export async function CountryMapSection({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const pins = await getPublishedProjectPins();
  const countryCount = new Set(pins.map((pin) => pin.country).filter(Boolean)).size;

  return (
    <Section>
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.jejakNegara}</h2>
          {countryCount > 0 ? (
            <span className="font-mono text-label uppercase text-slate">
              {countryCount} {t.beranda.negaraLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-8">
          <CountryMap pins={pins} />
        </div>
      </Reveal>
    </Section>
  );
}

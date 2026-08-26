import { getPublishedProjectPins } from '@/lib/cms/projects';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from './country-map';

export async function CountryMapSection({ title = 'Jejak di 10 Negara' }: { title?: string } = {}) {
  const pins = await getPublishedProjectPins();

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <div className="mt-8">
          <CountryMap pins={pins} />
        </div>
      </Reveal>
    </Section>
  );
}

import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { CountryMap } from './country-map';
import type { ProjectPin } from '@/lib/content-types';

export function CountryMapSection() {
  const pins = getCollection<ProjectPin>('projects').map((entry) => entry.data);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Jejak di 10 Negara</h2>
        <div className="mt-8">
          <CountryMap pins={pins} />
        </div>
      </Reveal>
    </Section>
  );
}

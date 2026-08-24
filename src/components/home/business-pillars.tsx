import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import type { PillarEntry } from '@/lib/content-types';

export function BusinessPillars() {
  const pillars = getCollection<PillarEntry>('pillars')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <Section className="bg-stone">
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Pilar Bisnis</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.slug} className="rounded-[14px] border border-line bg-paper p-6">
              <p className="font-mono text-label uppercase text-slate">
                {String(pillar.urutan).padStart(2, '0')}
              </p>
              <p className="mt-2 font-display text-h3 text-ink">{pillar.nama}</p>
              <p className="mt-1 text-small text-slate">{pillar.deskripsi}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { KeyStatsCounters } from './key-stats-counters';
import type { StatEntry } from '@/lib/content-types';

export function KeyStatsSection() {
  const stats = getCollection<StatEntry>('stats')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  if (stats.length === 0) {
    return null;
  }

  return (
    <Section className="bg-stone">
      <Reveal>
        <KeyStatsCounters stats={stats} />
      </Reveal>
    </Section>
  );
}

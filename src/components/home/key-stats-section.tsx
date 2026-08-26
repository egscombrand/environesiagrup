import { getPublishedStats } from '@/lib/cms/stats';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { KeyStatsCounters } from './key-stats-counters';

export async function KeyStatsSection() {
  const stats = await getPublishedStats();

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

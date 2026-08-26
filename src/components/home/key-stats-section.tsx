import { getPublishedStats } from '@/lib/cms/stats';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { KeyStatsCounters } from './key-stats-counters';

export async function KeyStatsSection() {
  const stats = await getPublishedStats();

  if (stats.length === 0) {
    return null;
  }

  // Icons are resolved here, server-side, and handed down as already-
  // rendered elements — see server-icon.tsx for why (keeps lucide's dynamic
  // icon map out of this client-rendered section's JS bundle entirely).
  const items = await Promise.all(
    stats.map(async (stat) => ({
      stat,
      icon: await resolveServerIcon({ name: stat.icon, className: 'h-5 w-5 text-forest', strokeWidth: 1.75 }),
    }))
  );

  return (
    <Section className="bg-stone">
      <Reveal>
        <KeyStatsCounters items={items} />
      </Reveal>
    </Section>
  );
}

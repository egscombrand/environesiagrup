import { getPublishedStats } from '@/lib/cms/stats';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { messagesFor } from '@/i18n/messages';
import { KeyStatsCounters } from './key-stats-counters';

export async function KeyStatsSection({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
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
    <Section className="border-y border-line bg-stone">
      <Reveal>
        <p className="text-center font-mono text-label uppercase text-slate">
          {title ?? t.beranda.angkaKunciEyebrow}
        </p>
        <div className="mt-6">
          <KeyStatsCounters items={items} />
        </div>
      </Reveal>
    </Section>
  );
}

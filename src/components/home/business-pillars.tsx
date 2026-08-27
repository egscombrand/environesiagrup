import { getPublishedPillars } from '@/lib/cms/pillars';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { RevealStagger, RevealItem } from '@/components/motion/reveal-stagger';
import { resolveServerIcon } from '@/components/icons/server-icon';
import { messagesFor } from '@/i18n/messages';

export async function BusinessPillars({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const pillars = await getPublishedPillars();
  const pillarsWithIcons = await Promise.all(
    pillars.map(async (pillar) => ({
      pillar,
      icon: await resolveServerIcon({ name: pillar.icon, className: 'h-5 w-5 text-forest', strokeWidth: 1.75 }),
    }))
  );

  return (
    <Section className="bg-stone">
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title ?? t.beranda.pilarBisnis}</h2>
      </Reveal>

      <RevealStagger className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pillarsWithIcons.map(({ pillar, icon }) => (
          <RevealItem key={pillar.slug} className="h-full">
            <div className="h-full rounded-[14px] border border-line bg-paper p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10">
                  {icon}
                </span>
                <p className="font-mono text-label uppercase text-slate">
                  {String(pillar.sort_order).padStart(2, '0')}
                </p>
              </div>
              <p className="mt-4 font-display text-h3 text-ink">{pillar.name}</p>
              <p className="mt-1 text-small text-slate">{pillar.short_description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}

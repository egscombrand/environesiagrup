import { getPublishedPillars } from '@/lib/cms/pillars';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { resolveServerIcon } from '@/components/icons/server-icon';

export async function BusinessPillars({ title = 'Pilar Bisnis' }: { title?: string } = {}) {
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
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillarsWithIcons.map(({ pillar, icon }) => (
            <div key={pillar.slug} className="rounded-[14px] border border-line bg-paper p-6">
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
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

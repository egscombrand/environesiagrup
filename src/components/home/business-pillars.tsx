import { getPublishedPillars } from '@/lib/cms/pillars';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';

export async function BusinessPillars({ title = 'Pilar Bisnis' }: { title?: string } = {}) {
  const pillars = await getPublishedPillars();

  return (
    <Section className="bg-stone">
      <Reveal>
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.slug} className="rounded-[14px] border border-line bg-paper p-6">
              <p className="font-mono text-label uppercase text-slate">
                {String(pillar.sort_order).padStart(2, '0')}
              </p>
              <p className="mt-2 font-display text-h3 text-ink">{pillar.name}</p>
              <p className="mt-1 text-small text-slate">{pillar.short_description}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

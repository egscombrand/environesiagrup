import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EntityCard } from '@/components/entitas/entity-card';
import type { EntityEntry } from '@/lib/content-types';

export function EntityCards({ locale }: { locale: string }) {
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Entitas Kami</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {entities.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} locale={locale} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

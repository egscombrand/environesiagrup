import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { EntityCard } from '@/components/entitas/entity-card';
import type { EntityEntry } from '@/lib/content-types';

export function EntityCards({ locale }: { locale: string }) {
  const entities = getCollection<EntityEntry>('entities')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  const core = entities.filter((entity) => entity.lini === 'inti');
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  return (
    <Section>
      <Reveal>
        <h2 className="font-display text-h2 text-ink">Entitas Kami</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {core.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} locale={locale} />
          ))}
        </div>
        {supporting.length > 0 ? (
          <div className="mt-6 border-t border-line pt-6">
            <p className="font-mono text-label uppercase text-slate">Unit Penunjang</p>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {supporting.map((entity) => (
                <EntityCard key={entity.slug} entity={entity} locale={locale} />
              ))}
            </div>
          </div>
        ) : null}
      </Reveal>
    </Section>
  );
}

import { getCollection } from '@/lib/content';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
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

function EntityCard({ entity, locale }: { entity: EntityEntry; locale: string }) {
  return (
    <a
      href={`/${locale}/entitas/${entity.slug}`}
      className="block rounded-[14px] border border-line p-6 transition-shadow hover:shadow-sm"
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: entity.warnaAksen }}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-h3 text-ink">{entity.nama}</p>
      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
    </a>
  );
}

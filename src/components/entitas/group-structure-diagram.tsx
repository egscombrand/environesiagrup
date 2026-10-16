import type { Entity } from '@/lib/cms/entities';
import { EntityCard } from '@/components/entitas/entity-card';

/**
 * Real Group → entity relationships, drawn as an org chart (root box,
 * horizontal branch bar) rather than a single thin line — bigger, clearer
 * typography on the root label than before, per "hindari terlalu kecil
 * atau sulit dibaca".
 */
export function GroupStructureDiagram({ entities, locale }: { entities: Entity[]; locale: string }) {
  const ordered = [...entities].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <figure>
      <div className="flex justify-center">
        <div className="rounded-[14px] bg-forest px-8 py-4 font-landing-display text-[20px] font-bold text-paper">
          Environesia
        </div>
      </div>

      <div className="mx-auto flex h-10 w-full max-w-[720px] flex-col items-center" aria-hidden="true">
        <div className="h-5 w-px bg-line" />
        <div className="hidden h-px w-full bg-line md:block" />
      </div>

      <ul className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {ordered.map((entity) => (
          <li key={entity.slug} className="h-full">
            <EntityCard entity={entity} locale={locale} className="h-full" />
          </li>
        ))}
      </ul>
    </figure>
  );
}

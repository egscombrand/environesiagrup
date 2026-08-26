import type { Entity } from '@/lib/cms/entities';
import { EntityCard } from '@/components/entitas/entity-card';

export function GroupStructureDiagram({
  entities,
  locale,
}: {
  entities: Entity[];
  locale: string;
}) {
  const ordered = [...entities].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <figure>
      <div className="flex justify-center">
        <div className="rounded-[14px] bg-forest px-6 py-3 font-display text-paper">
          Environesia Group
        </div>
      </div>

      <div className="mx-auto hidden h-8 w-px bg-line md:block" aria-hidden="true" />

      <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ordered.map((entity) => (
          <li key={entity.slug} className="h-full">
            <EntityCard entity={entity} locale={locale} className="h-full" />
          </li>
        ))}
      </ul>
    </figure>
  );
}

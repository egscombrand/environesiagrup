import type { EntityEntry } from '@/lib/content-types';

export function GroupStructureDiagram({ entities }: { entities: EntityEntry[] }) {
  const ordered = [...entities].sort((a, b) => a.urutan - b.urutan);

  return (
    <figure>
      <div className="flex justify-center">
        <div className="rounded-[14px] bg-forest px-6 py-3 font-display text-paper">
          Environesia Group
        </div>
      </div>

      <div className="mx-auto hidden h-8 w-px bg-line md:block" aria-hidden="true" />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ordered.map((entity) => (
          <li
            key={entity.slug}
            className="rounded-[14px] border border-l-4 border-line bg-paper p-4"
            style={{ borderLeftColor: entity.warnaAksen }}
          >
            <p className="font-display text-h3 text-ink">{entity.nama}</p>
            <p className="text-small text-slate">{entity.deskripsi}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

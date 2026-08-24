import type { EntityEntry } from '@/lib/content-types';

export function GroupStructureDiagram({ entities }: { entities: EntityEntry[] }) {
  const core = entities.filter((entity) => entity.lini === 'inti').sort((a, b) => a.urutan - b.urutan);
  const supporting = entities.filter((entity) => entity.lini === 'penunjang');

  return (
    <figure>
      <div className="flex justify-center">
        <div className="rounded-[14px] bg-forest px-6 py-3 font-display text-paper">
          Environesia Group
        </div>
      </div>

      <div className="mx-auto hidden h-8 w-px bg-line md:block" aria-hidden="true" />

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {core.map((entity) => (
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

      <div
        className="mx-auto hidden h-8 w-px border-l border-dashed border-line md:block"
        aria-hidden="true"
      />

      {supporting.map((entity) => (
        <div key={entity.slug} className="flex flex-col items-center">
          <p className="font-mono text-label uppercase text-slate">Unit Penunjang</p>
          <ul className="mt-2 grid grid-cols-1">
            <li
              className="rounded-[14px] border border-l-4 border-line bg-paper p-4 md:max-w-xs"
              style={{ borderLeftColor: entity.warnaAksen }}
            >
              <p className="font-display text-h3 text-ink">{entity.nama}</p>
              <p className="text-small text-slate">{entity.deskripsi}</p>
            </li>
          </ul>
        </div>
      ))}
    </figure>
  );
}

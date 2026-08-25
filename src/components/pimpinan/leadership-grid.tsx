import type { LeadershipEntry } from '@/lib/content-types';

export function LeadershipGrid({
  people,
  emptyLabel,
}: {
  people: LeadershipEntry[];
  emptyLabel: string;
}) {
  if (people.length === 0) {
    return <p className="text-body text-ink">{emptyLabel}</p>;
  }

  const ordered = [...people].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ordered.map((person) => (
        <div
          key={`${person.nama}-${person.urutan}`}
          className="rounded-[14px] border border-line bg-paper p-6"
        >
          <p className="font-display text-h3 text-ink">{person.nama}</p>
          <p className="mt-1 font-mono text-label uppercase text-slate">{person.jabatan}</p>
          {person.bio ? <p className="mt-3 text-small text-slate">{person.bio}</p> : null}
        </div>
      ))}
    </div>
  );
}

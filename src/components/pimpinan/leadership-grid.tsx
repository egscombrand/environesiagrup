import type { LeadershipMember } from '@/lib/cms/leadership';

export function LeadershipGrid({
  people,
  emptyLabel,
}: {
  people: LeadershipMember[];
  emptyLabel: string;
}) {
  if (people.length === 0) {
    return <p className="text-body text-ink">{emptyLabel}</p>;
  }

  const ordered = [...people].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ordered.map((person) => (
        <div key={person.id} className="rounded-[14px] border border-line bg-paper p-6">
          <p className="font-display text-h3 text-ink">{person.name}</p>
          <p className="mt-1 font-mono text-label uppercase text-slate">{person.position}</p>
          {person.bio ? <p className="mt-3 text-small text-slate">{person.bio}</p> : null}
        </div>
      ))}
    </div>
  );
}

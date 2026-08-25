import Link from 'next/link';
import type { EntityEntry } from '@/lib/content-types';

export function EntityCard({
  entity,
  locale,
  className = '',
}: {
  entity: EntityEntry;
  locale: string;
  className?: string;
}) {
  // `className` is additive only — it cannot override the utilities hardcoded below.
  // Tailwind emits utilities of the same property in ascending scale order in the
  // compiled stylesheet, so at equal specificity the later-emitted rule always wins
  // regardless of where a class appears in this string. A caller passing e.g. `p-4`
  // will not shrink the `p-6` below; it will simply have no visible effect.
  return (
    <Link
      href={`/${locale}/entitas/${entity.slug}`}
      className={`block rounded-[14px] border border-line bg-paper p-6 transition-shadow hover:shadow-sm ${className}`.trim()}
      aria-label={entity.nama}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: entity.warnaAksen }}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-h3 text-ink">{entity.nama}</p>
      <p className="mt-1 text-small text-slate">{entity.deskripsi}</p>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import type { Entity } from '@/lib/cms/entities';

export function EntityCard({
  entity,
  locale,
  className = '',
}: {
  entity: Entity;
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
      aria-label={entity.name}
    >
      {entity.logoUrl ? (
        // The logo already carries the entity's name and colour, so it stands in
        // for both the accent chip and the name. The link keeps its aria-label,
        // so the accessible name does not depend on this decorative image.
        <Image
          src={entity.logoUrl}
          alt=""
          width={640}
          height={200}
          className="h-12 w-auto object-contain"
        />
      ) : (
        <>
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entity.accent_color ?? undefined }}
            aria-hidden="true"
          />
          <p className="mt-3 font-display text-h3 text-ink">{entity.name}</p>
        </>
      )}
      <p className="mt-3 text-small text-slate">{entity.short_description}</p>
    </Link>
  );
}

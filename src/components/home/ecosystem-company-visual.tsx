import Image from 'next/image';
import type { Entity } from '@/lib/cms/entities';

type Variant = 'featured' | 'compact' | 'focus';

const SIZES: Record<Variant, string> = {
  featured: '(min-width: 768px) 50vw, 100vw',
  compact: '64px',
  focus: '(min-width: 768px) 60vw, 100vw',
};

const FALLBACK_ACCENT = '#0FA96B';

/**
 * Every entity gets a real, large visual either way. When the CMS has a
 * cover photo it's used directly; none of the live entities have one set
 * yet, so today that always falls through to a graphic treatment built from
 * that entity's own accent_color plus its real logo — never a gray box —
 * which upgrades automatically the moment an admin uploads cover_image_path,
 * since both paths read the same field.
 */
export function EcosystemCompanyVisual({
  entity,
  variant,
  className = '',
  priority = false,
  imageOverrideUrl,
}: {
  entity: Entity;
  variant: Variant;
  className?: string;
  priority?: boolean;
  /** A story scene's own image, when it has one — takes precedence over the entity's cover photo. */
  imageOverrideUrl?: string;
}) {
  const imageUrl = imageOverrideUrl ?? entity.coverImageUrl;

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-sage-mist/40 ${className}`}>
        <Image
          src={imageUrl}
          alt={entity.name}
          fill
          sizes={SIZES[variant]}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />
      </div>
    );
  }

  const accent = entity.accent_color ?? FALLBACK_ACCENT;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${accent}33, transparent 60%), linear-gradient(160deg, ${accent}1a, var(--color-canvas))`,
      }}
    >
      {entity.logoUrl ? (
        <Image
          src={entity.logoUrl}
          alt={entity.name}
          fill
          sizes={SIZES[variant]}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={variant === 'compact' ? 'object-contain p-3' : 'object-contain p-[14%]'}
        />
      ) : null}
    </div>
  );
}

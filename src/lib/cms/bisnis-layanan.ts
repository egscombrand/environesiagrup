import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import { BISNIS_LAYANAN_FALLBACK, GROUP_PHOTO_PATH, type BisnisLayananContent } from '@/lib/cms/bisnis-layanan-content';

/**
 * Bisnis & Ekosistem (/bisnis-layanan), read from two page_content rows:
 * `bisnis-layanan-hero`, `bisnis-layanan-ekosistem`. Each falls back to its
 * own copy in bisnis-layanan-content.ts, independently of the other.
 */

export const HERO_SLUG = 'bisnis-layanan-hero';
export const EKOSISTEM_SLUG = 'bisnis-layanan-ekosistem';
export const GROUP_PHOTO_IMAGE_KEY = 'group-photo';

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function photoEntry(images: unknown, key: string): { path?: unknown; alt?: unknown } | undefined {
  if (!Array.isArray(images)) return undefined;
  return images.find((image) => (image as { key?: unknown })?.key === key) as { path?: unknown; alt?: unknown } | undefined;
}

function photoFrom(images: unknown, key: string): string | null {
  const match = photoEntry(images, key);
  return typeof match?.path === 'string' && match.path.trim() ? (publicMediaUrl(match.path.trim()) ?? null) : null;
}

function photoAlt(images: unknown, key: string, fallback: string): string {
  const match = photoEntry(images, key);
  return typeof match?.alt === 'string' && match.alt.trim() ? match.alt.trim() : fallback;
}

/** Pure, so the rules can be tested without a database. */
export function buildBisnisLayanan(hero: Row | null, ekosistem: Row | null): BisnisLayananContent {
  const fb = BISNIS_LAYANAN_FALLBACK;
  return {
    hero: {
      title: text(hero?.title, fb.hero.title),
      description: text(hero?.description, fb.hero.description),
      metaTitle: text(hero?.meta_title, fb.hero.metaTitle),
      metaDescription: text(hero?.meta_description, fb.hero.metaDescription),
    },
    ekosistem: {
      title: text(ekosistem?.title, fb.ekosistem.title),
      richText: text(ekosistem?.description, fb.ekosistem.richText),
    },
    groupPhoto: {
      // An admin-uploaded photo (via the Hero Halaman editor) wins; absent
      // that, the real photo already migrated to Storage (see
      // GROUP_PHOTO_PATH) — never a placeholder, since that asset is
      // already real stored data either way.
      imageSrc: (hero ? photoFrom(hero.images, GROUP_PHOTO_IMAGE_KEY) : null) ?? publicMediaUrl(GROUP_PHOTO_PATH) ?? null,
      imageAlt: hero ? photoAlt(hero.images, GROUP_PHOTO_IMAGE_KEY, fb.groupPhoto.imageAlt) : fb.groupPhoto.imageAlt,
    },
  };
}

export const getBisnisLayanan = cache(async (): Promise<BisnisLayananContent> => {
  const none = buildBisnisLayanan(null, null);
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').in('slug', [HERO_SLUG, EKOSISTEM_SLUG]);
    if (error || !data) return none;
    const row = (slug: string) => (data.find((r) => r.slug === slug) ?? null) as Row | null;
    return buildBisnisLayanan(row(HERO_SLUG), row(EKOSISTEM_SLUG));
  } catch {
    return none;
  }
});

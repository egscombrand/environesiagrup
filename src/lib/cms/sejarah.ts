import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import { SEJARAH_BLOCK_COUNT, SEJARAH_FALLBACK, type SejarahContent } from '@/lib/cms/sejarah-content';

/**
 * The Sejarah content of Tentang Kami, read from page_content: the row `sejarah`
 * (intro, the "Sekilas" heading, and the three text blocks, with their two
 * photos) and the row `perjalanan-timeline` (the heading above the timeline).
 * The milestones themselves come from the milestones table, as before.
 *
 * A row that is missing, or that does not have the shape the component needs,
 * falls back to the copy in sejarah-content.ts as a whole.
 */

export const SEJARAH_SLUG = 'sejarah';
export const TIMELINE_SLUG = 'perjalanan-timeline';

/** The photo slots for the first two blocks. The third block has no photo. */
export const SEJARAH_PHOTO_KEYS = ['blok-1', 'blok-2'] as const;

export type SejarahView = SejarahContent & {
  /** One public URL per block, or null when no photo is stored (the placeholder shows). */
  photos: (string | null)[];
};

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function blocksFrom(raw: unknown): SejarahContent['blocks'] | null {
  if (!Array.isArray(raw) || raw.length !== SEJARAH_BLOCK_COUNT) return null;
  const blocks = raw.map((item) => {
    const description = typeof (item as { description?: unknown })?.description === 'string' ? (item as { description: string }).description.trim() : '';
    return description ? { text: description } : null;
  });
  return blocks.every((block): block is { text: string } => block !== null) ? blocks : null;
}

function photoFrom(images: unknown, key: string): string | null {
  if (!Array.isArray(images)) return null;
  const match = images.find((image) => (image as { key?: unknown })?.key === key) as { path?: unknown } | undefined;
  return typeof match?.path === 'string' && match.path.trim() ? (publicMediaUrl(match.path.trim()) ?? null) : null;
}

/** Pure, so the rules can be tested without a database. */
export function buildSejarah(sejarah: Row | null, timeline: Row | null): SejarahView {
  const fb = SEJARAH_FALLBACK;
  const blocks = sejarah ? (blocksFrom(sejarah.items) ?? fb.blocks) : fb.blocks;
  return {
    eyebrow: text(sejarah?.eyebrow, fb.eyebrow),
    title: text(sejarah?.title, fb.title),
    lead: text(sejarah?.description, fb.lead),
    sekilasLabel: text(sejarah?.extra_label, fb.sekilasLabel),
    metaTitle: text(sejarah?.meta_title, fb.metaTitle),
    metaDescription: text(sejarah?.meta_description, fb.metaDescription),
    blocks,
    timeline: {
      eyebrow: text(timeline?.eyebrow, fb.timeline.eyebrow),
      title: text(timeline?.title, fb.timeline.title),
      intro: text(timeline?.description, fb.timeline.intro),
    },
    photos: SEJARAH_PHOTO_KEYS.map((key) => (sejarah ? photoFrom(sejarah.images, key) : null)),
  };
}

export const getSejarah = cache(async (): Promise<SejarahView> => {
  const none = buildSejarah(null, null);
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').in('slug', [SEJARAH_SLUG, TIMELINE_SLUG]);
    if (error || !data) return none;
    const sejarah = (data.find((row) => row.slug === SEJARAH_SLUG) ?? null) as Row | null;
    const timeline = (data.find((row) => row.slug === TIMELINE_SLUG) ?? null) as Row | null;
    return buildSejarah(sejarah, timeline);
  } catch {
    return none;
  }
});

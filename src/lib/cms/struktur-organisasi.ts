import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import { STRUKTUR_FALLBACK, STRUKTUR_IMAGE_KEY } from '@/lib/cms/struktur-organisasi-content';

/**
 * Struktur Organisasi, read from page_content: the row `struktur-organisasi`
 * (the heading, and the chart with its alt text). A missing row, or a chart
 * without a stored path, falls back to the copy and the /public chart.
 */
export const STRUKTUR_SLUG = 'struktur-organisasi';

export type StrukturContent = {
  title: string;
  /** Public URL of the stored chart, or null to use the /public default. */
  imageSrc: string | null;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
};

type Row = Record<string, unknown>;

/** Pure, so the rules can be tested without a database. */
export function buildStruktur(row: Row | null): StrukturContent {
  const fb = STRUKTUR_FALLBACK;
  const images = Array.isArray(row?.images) ? (row.images as { key?: unknown; path?: unknown; alt?: unknown }[]) : [];
  const chart = images.find((image) => image.key === STRUKTUR_IMAGE_KEY);
  const path = typeof chart?.path === 'string' ? chart.path.trim() : '';
  const alt = typeof chart?.alt === 'string' ? chart.alt.trim() : '';
  const title = typeof row?.title === 'string' && row.title.trim() ? row.title.trim() : fb.title;
  const metaTitle = typeof row?.meta_title === 'string' && row.meta_title.trim() ? row.meta_title.trim() : fb.metaTitle;
  const metaDescription =
    typeof row?.meta_description === 'string' && row.meta_description.trim() ? row.meta_description.trim() : fb.metaDescription;
  return {
    title,
    imageSrc: path ? (publicMediaUrl(path) ?? null) : null,
    imageAlt: alt || fb.imageAlt,
    metaTitle,
    metaDescription,
  };
}

export const getStruktur = cache(async (): Promise<StrukturContent> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').eq('slug', STRUKTUR_SLUG).maybeSingle();
    if (error) return buildStruktur(null);
    return buildStruktur((data as Row | null) ?? null);
  } catch {
    return buildStruktur(null);
  }
});

import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import {
  KOMITMEN_ITEM_COUNT,
  VISI_MISI_CHAPTER_COUNT,
  VISI_MISI_FALLBACK,
  type Commitment,
  type VisiMisiChapter,
  type VisiMisiContent,
} from '@/lib/cms/visi-misi-content';

/**
 * Visi, Misi & Komitmen, read from page_content: the row `visi-misi` (heading,
 * Visi and Misi as two chapters) and the row `komitmen` (heading, intro, and four
 * commitments). A row that is missing, or does not have the shape the page needs,
 * falls back to the copy in visi-misi-content.ts as a whole.
 */

export const VISI_MISI_SLUG = 'visi-misi';
export const KOMITMEN_SLUG = 'komitmen';

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function chaptersFrom(raw: unknown): VisiMisiChapter[] | null {
  if (!Array.isArray(raw) || raw.length !== VISI_MISI_CHAPTER_COUNT) return null;
  const chapters = raw.map((item) => {
    const value = (item ?? {}) as { title?: unknown; description?: unknown };
    const label = typeof value.title === 'string' ? value.title.trim() : '';
    const body = typeof value.description === 'string' ? value.description.trim() : '';
    return label && body ? { label, text: body } : null;
  });
  return chapters.every((c): c is VisiMisiChapter => c !== null) ? chapters : null;
}

function commitmentsFrom(raw: unknown): Commitment[] | null {
  if (!Array.isArray(raw) || raw.length !== KOMITMEN_ITEM_COUNT) return null;
  const items = raw.map((item) => {
    const value = (item ?? {}) as { title?: unknown; description?: unknown };
    const title = typeof value.title === 'string' ? value.title.trim() : '';
    const description = typeof value.description === 'string' ? value.description.trim() : '';
    return title && description ? { title, description } : null;
  });
  return items.every((c): c is Commitment => c !== null) ? items : null;
}

/** Pure, so the rules can be tested without a database. */
export function buildVisiMisi(visiMisi: Row | null, komitmen: Row | null): VisiMisiContent {
  const fb = VISI_MISI_FALLBACK;
  return {
    title: text(visiMisi?.title, fb.title),
    metaTitle: text(visiMisi?.meta_title, fb.metaTitle),
    metaDescription: text(visiMisi?.meta_description, fb.metaDescription),
    chapters: (visiMisi && chaptersFrom(visiMisi.items)) || fb.chapters,
    komitmen: {
      title: text(komitmen?.title, fb.komitmen.title),
      intro: text(komitmen?.description, fb.komitmen.intro),
      items: (komitmen && commitmentsFrom(komitmen.items)) || fb.komitmen.items,
    },
  };
}

export const getVisiMisi = cache(async (): Promise<VisiMisiContent> => {
  const none = buildVisiMisi(null, null);
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .in('slug', [VISI_MISI_SLUG, KOMITMEN_SLUG]);
    if (error || !data) return none;
    const visiMisi = (data.find((row) => row.slug === VISI_MISI_SLUG) ?? null) as Row | null;
    const komitmen = (data.find((row) => row.slug === KOMITMEN_SLUG) ?? null) as Row | null;
    return buildVisiMisi(visiMisi, komitmen);
  } catch {
    return none;
  }
});

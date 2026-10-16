import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { PENGHARGAAN_FALLBACK, type PenghargaanContent } from '@/lib/cms/penghargaan-content';

export const PENGHARGAAN_SLUG = 'penghargaan';

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/** Pure, so the rules can be tested without a database. */
export function buildPenghargaan(row: Row | null): PenghargaanContent {
  const fb = PENGHARGAAN_FALLBACK;
  return {
    title: text(row?.title, fb.title),
    description: text(row?.description, fb.description),
    metaTitle: text(row?.meta_title, fb.metaTitle),
    metaDescription: text(row?.meta_description, fb.metaDescription),
  };
}

export const getPenghargaan = cache(async (): Promise<PenghargaanContent> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').eq('slug', PENGHARGAAN_SLUG).maybeSingle();
    if (error) return buildPenghargaan(null);
    return buildPenghargaan((data as Row | null) ?? null);
  } catch {
    return buildPenghargaan(null);
  }
});

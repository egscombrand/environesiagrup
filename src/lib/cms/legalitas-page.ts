import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { LEGALITAS_PAGE_FALLBACK, type LegalitasPageContent } from '@/lib/cms/legalitas-page-content';

export const LEGALITAS_PAGE_SLUG = 'legalitas';

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/** Pure, so the rules can be tested without a database. */
export function buildLegalitasPage(row: Row | null): LegalitasPageContent {
  const fb = LEGALITAS_PAGE_FALLBACK;
  return {
    title: text(row?.title, fb.title),
    description: text(row?.description, fb.description),
    noteLabel: text(row?.extra_label, fb.noteLabel),
    noteText: text(row?.extra_text, fb.noteText),
    metaTitle: text(row?.meta_title, fb.metaTitle),
    metaDescription: text(row?.meta_description, fb.metaDescription),
  };
}

export const getLegalitasPage = cache(async (): Promise<LegalitasPageContent> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').eq('slug', LEGALITAS_PAGE_SLUG).maybeSingle();
    if (error) return buildLegalitasPage(null);
    return buildLegalitasPage((data as Row | null) ?? null);
  } catch {
    return buildLegalitasPage(null);
  }
});

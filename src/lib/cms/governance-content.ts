import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import {
  GOVERNANCE_FALLBACK,
  GOVERNANCE_HERO_SLUG,
  GOVERNANCE_KERANGKA_SLUG,
  GOVERNANCE_PAGE_SLUGS,
  type GovernanceBlock,
  type GovernanceContent,
  type GovernanceItem,
  type GovernanceStep,
} from './governance-fallback';

export type GovernanceLang = 'id' | 'en' | 'zh';

/** One `page_content` row, read loosely: a column that does not exist yet reads as undefined. */
export type GovernanceRow = Record<string, unknown>;

export function languageFor(locale: string): GovernanceLang {
  return locale === 'en' || locale === 'zh' ? locale : 'id';
}

/**
 * The order of values for one field. Indonesian is the default column. For
 * English or Chinese, the translation column comes first and the Indonesian
 * column is the next choice. The hardcoded fallback is the last resort.
 */
function candidates(field: string, lang: GovernanceLang): string[] {
  return lang === 'id' ? [field] : [`${field}_${lang}`, field];
}

function readText(row: GovernanceRow, field: string, lang: GovernanceLang, fallback: string): string {
  for (const name of candidates(field, lang)) {
    const value = row[name];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return fallback;
}

function readNullableText(row: GovernanceRow, field: string, lang: GovernanceLang, fallback: string | null): string | null {
  for (const name of candidates(field, lang)) {
    const value = row[name];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return fallback;
}

/**
 * An ordered list. A list counts as set only when at least one usable entry
 * remains after cleaning, so an empty list in one language moves on to the next
 * choice. Entries without a title (or label, for a step) are dropped.
 */
function readList<T>(
  row: GovernanceRow,
  field: string,
  lang: GovernanceLang,
  fallback: T[],
  parse: (raw: unknown) => T | null
): T[] {
  for (const name of candidates(field, lang)) {
    const raw = row[name];
    if (!Array.isArray(raw)) continue;
    const parsed = raw.map(parse).filter((entry): entry is T => entry !== null);
    if (parsed.length > 0) return parsed;
  }
  return fallback;
}

function parseItem(raw: unknown): GovernanceItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as { label?: unknown; title?: unknown; description?: unknown };
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  if (!title) return null;
  const label = typeof value.label === 'string' ? value.label.trim() : '';
  const description = typeof value.description === 'string' ? value.description.trim() : '';
  return label ? { label, title, description } : { title, description };
}

function parseStep(raw: unknown): GovernanceStep | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as { label?: unknown; description?: unknown };
  const label = typeof value.label === 'string' ? value.label.trim() : '';
  if (!label) return null;
  const description = typeof value.description === 'string' ? value.description.trim() : '';
  return description ? { label, description } : { label };
}

function parseTag(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  return value ? value : null;
}

/**
 * A photo is stored as its Storage path, for example `tata-kelola/123-foto.jpg`.
 * An empty path returns null, which tells HeroPhoto to use the default photo.
 */
function photoUrl(path: unknown): string | null {
  if (typeof path !== 'string' || path.trim() === '') return null;
  return publicMediaUrl(path.trim()) ?? null;
}

function buildBlock(row: GovernanceRow, lang: GovernanceLang, fb: GovernanceBlock): GovernanceBlock {
  return {
    eyebrow: readNullableText(row, 'eyebrow', lang, fb.eyebrow),
    title: readText(row, 'title', lang, fb.title),
    description: readNullableText(row, 'description', lang, fb.description),
    items: readList(row, 'items', lang, fb.items, parseItem),
    steps: readList(row, 'steps', lang, fb.steps, parseStep),
    tags: readList(row, 'tags', lang, fb.tags, parseTag),
    extraLabel: readNullableText(row, 'extra_label', lang, fb.extraLabel),
    extraText: readNullableText(row, 'extra_text', lang, fb.extraText),
    metaTitle: readText(row, 'meta_title', lang, fb.metaTitle),
    metaDescription: readText(row, 'meta_description', lang, fb.metaDescription),
  };
}

/**
 * Turns the rows into the content the Tata Kelola pages render. Pure, so the
 * fallback rules can be tested without a database. A missing row, a missing
 * column, or an empty field each fall back to the hardcoded copy, one field at a
 * time.
 */
export function buildGovernanceContent(rows: Map<string, GovernanceRow>, lang: GovernanceLang): GovernanceContent {
  const fb = GOVERNANCE_FALLBACK;

  const heroRow = rows.get(GOVERNANCE_HERO_SLUG) ?? {};
  const kerangkaRow = rows.get(GOVERNANCE_KERANGKA_SLUG) ?? {};

  const pages = Object.fromEntries(
    GOVERNANCE_PAGE_SLUGS.map((slug) => [slug, buildBlock(rows.get(slug) ?? {}, lang, fb.pages[slug])])
  ) as GovernanceContent['pages'];

  return {
    hero: {
      eyebrow: readText(heroRow, 'eyebrow', lang, fb.hero.eyebrow),
      title: readText(heroRow, 'title', lang, fb.hero.title),
      description: readText(heroRow, 'description', lang, fb.hero.description),
      desktopImage: photoUrl(heroRow.image_path) ?? fb.hero.desktopImage,
      mobileImage: photoUrl(heroRow.image_mobile_path) ?? fb.hero.mobileImage,
      metaTitle: readText(heroRow, 'meta_title', lang, fb.hero.metaTitle),
      metaDescription: readText(heroRow, 'meta_description', lang, fb.hero.metaDescription),
    },
    kerangka: {
      eyebrow: readText(kerangkaRow, 'eyebrow', lang, fb.kerangka.eyebrow),
      title: readText(kerangkaRow, 'title', lang, fb.kerangka.title),
      description: readText(kerangkaRow, 'description', lang, fb.kerangka.description),
      items: readList(kerangkaRow, 'items', lang, fb.kerangka.items, parseItem),
    },
    pages,
  };
}

/**
 * Reads the governance rows once per request and per language. Any failure,
 * including a database that is unreachable or a migration that is not applied,
 * returns the hardcoded copy, so the page always renders.
 */
export const getGovernanceContent = cache(async (locale: string): Promise<GovernanceContent> => {
  const lang = languageFor(locale);
  try {
    const supabase = createPublicClient();
    const slugs = [GOVERNANCE_HERO_SLUG, GOVERNANCE_KERANGKA_SLUG, ...GOVERNANCE_PAGE_SLUGS];
    const { data, error } = await supabase.from('page_content').select('*').in('slug', slugs);
    if (error || !data) return buildGovernanceContent(new Map(), lang);

    return buildGovernanceContent(new Map(data.map((row) => [row.slug, row as GovernanceRow])), lang);
  } catch {
    return buildGovernanceContent(new Map(), lang);
  }
});

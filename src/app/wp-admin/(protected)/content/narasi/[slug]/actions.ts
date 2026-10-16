'use server';

import { requireRole } from '@/lib/admin/auth';
import {
  narrativePageFor,
  narrativePayloadSchema,
  type NarrativeLang,
  type NarrativeLocale,
  type NarrativePage,
} from '@/lib/admin/narrative-pages';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import type { Database } from '@/lib/supabase/database.types';

type PageContentRow = Database['public']['Tables']['page_content']['Insert'];

/** The columns for one language. The Indonesian column has no suffix. */
function columnsFor(value: NarrativeLocale, lang: NarrativeLang): Partial<PageContentRow> {
  const col = (name: string) => (lang === 'id' ? name : `${name}_${lang}`);
  return {
    [col('eyebrow')]: value.eyebrow || null,
    [col('title')]: value.title || null,
    [col('description')]: value.description || null,
    [col('items')]: value.items,
    [col('extra_label')]: value.extraLabel || null,
    [col('extra_text')]: value.extraText || null,
    [col('steps')]: value.steps,
    [col('tags')]: value.tags,
    [col('meta_title')]: value.metaTitle || null,
    [col('meta_description')]: value.metaDescription || null,
  } as Partial<PageContentRow>;
}

/** A translation keeps only the entries that have content. Blank rows are dropped, not rejected. */
function withoutBlanks(value: NarrativeLocale): NarrativeLocale {
  return {
    ...value,
    items: value.items.filter((item) => item.title),
    steps: value.steps.filter((step) => step.label),
    tags: value.tags.filter(Boolean),
  };
}

/**
 * A Storage path written by the upload field, or null for "use the default photo".
 * Only the characters an upload can produce are accepted, and no `..` segments.
 */
const STORAGE_PATH = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,300}$/;

function photoPathOrNull(value: FormDataEntryValue | null): string | null {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return null;
  if (!STORAGE_PATH.test(text) || text.includes('..')) return null;
  return text;
}

/**
 * Creates or updates the `page_content` row for one narrative page. The row is
 * found by `slug`, so the page works the first time (no row yet) and every time
 * after. Only the super admin and editors may write. Authors cannot.
 *
 * The Indonesian copy is required. English and Chinese are optional, and an
 * empty translation simply falls back to Indonesian on the site. Pages that
 * are not localized write only the Indonesian columns, so their other columns
 * are never touched.
 */
export async function saveNarrativeAction(slug: string, formData: FormData) {
  const page: NarrativePage | undefined = narrativePageFor(slug);
  if (!page) return { error: 'Halaman tidak dikenal.' };

  const { supabase } = await requireRole(['super_admin', 'editor']);

  const status = formData.get('status') === 'published' ? 'published' : 'draft';

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get('payload') ?? '{}'));
  } catch {
    return { error: 'Data tidak dapat dibaca. Muat ulang halaman dan coba lagi.' };
  }
  const parsed = narrativePayloadSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };

  const { id, en, zh } = parsed.data.locales;
  if (!id.title) return { error: 'Judul tidak boleh kosong.' };
  const titlesRequired = page.itemTitles !== false;
  if (titlesRequired && id.items.some((item) => !item.title)) return { error: 'Judul item tidak boleh kosong.' };
  if (!titlesRequired && id.items.some((item) => !item.description)) return { error: 'Teks setiap blok tidak boleh kosong.' };
  if (id.steps.some((step) => !step.label)) return { error: 'Label langkah tidak boleh kosong.' };
  if (page.itemCount !== undefined && id.items.length !== page.itemCount) {
    return { error: `Halaman ini harus memiliki tepat ${page.itemCount} item, sekarang ${id.items.length}.` };
  }

  const base = {
    slug: page.slug,
    section_group: page.sectionGroup,
    status,
  };

  // The Indonesian columns (title, extra_label, steps, tags, meta_title, …)
  // always save, whether or not the page is localized — a page that does not
  // use a given block simply keeps that column null, which is a no-op.
  // Only English and Chinese depend on localization, since no page reads
  // those columns otherwise.
  const row = {
    ...base,
    ...columnsFor(id, 'id'),
    ...(page.localized
      ? { ...columnsFor(withoutBlanks(en), 'en'), ...columnsFor(withoutBlanks(zh), 'zh') }
      : {}),
  } as PageContentRow;

  if (page.blocks.includes('images')) {
    // Named photos. A slot left empty is stored as no entry, so the site uses its default.
    row.images = (page.imageSlots ?? []).flatMap((slot) => {
      const path = photoPathOrNull(formData.get(`image_${slot.key}`));
      if (!path) return [];
      if (!slot.withAlt) return [{ key: slot.key, path }];
      const alt = String(formData.get(`image_${slot.key}_alt`) ?? '').trim().slice(0, 300);
      return [{ key: slot.key, path, alt }];
    });
  }

  if (page.blocks.includes('image')) {
    row.image_path = photoPathOrNull(formData.get('image_path'));
    row.image_mobile_path = photoPathOrNull(formData.get('image_mobile_path'));
  }

  const { error } = await supabase.from('page_content').upsert(row, { onConflict: 'slug' });
  if (error) {
    // Show the database's own message. A generic text hides the cause, such as a
    // migration that has not been run yet.
    console.error('[narasi] save failed', { slug, code: error.code, message: error.message, details: error.details, hint: error.hint });
    return { error: `Gagal menyimpan: ${error.message}${error.code ? ` (kode ${error.code})` : ''}` };
  }

  revalidatePublicSite();
  return {};
}

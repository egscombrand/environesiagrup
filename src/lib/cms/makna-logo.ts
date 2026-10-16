import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import { LEGACY_MEDIA } from '@/lib/cms/legacy-media';

/**
 * Makna Logo, shown at the top of /id/tentang-kami. The row is `makna-logo` in
 * page_content. Its items are the four parts of the logo, in order: Simbol,
 * Tipografi, Warna, Kesatuan Identitas. The animation in the component depends
 * on that order and on there being exactly four.
 *
 * Until the row is seeded (migration 0033), or if a read fails, the copy below
 * is shown, along with the default photos in /public.
 */

export const MAKNA_LOGO_SLUG = 'makna-logo';
export const MAKNA_PART_COUNT = 4;

export type MaknaPart = { label: string; description: string };

export type MaknaLogoContent = {
  eyebrow: string;
  title: string;
  parts: MaknaPart[];
  /** Resolved public URLs. Null means "use the default photo in /public". */
  symbolSrc: string | null;
  wordmarkSrc: string | null;
};

export const MAKNA_LOGO_FALLBACK: MaknaLogoContent = {
  eyebrow: 'Identitas Visual',
  title: 'Makna Logo',
  parts: [
    {
      label: 'Simbol',
      description:
        'Bentuk pusaran pada simbol Environesia menggambarkan siklus dan pergerakan yang berkelanjutan, cara kerja lingkungan yang terus berputar, saling terhubung, dan tidak pernah berhenti pada satu titik.',
    },
    {
      label: 'Tipografi',
      description:
        'Wordmark huruf kecil (lowercase) dengan bentuk yang membulat dan modern mencerminkan sikap yang terbuka dan mudah diajak bekerja sama, tanpa mengurangi kesan profesional sebagai grup usaha.',
    },
    {
      label: 'Warna',
      description:
        'Gradasi hijau menuju biru menyatukan dua asosiasi utama grup: hijau untuk lingkungan dan keberlanjutan, biru untuk kepercayaan dan profesionalisme dalam setiap pekerjaan yang dijalankan.',
    },
    {
      label: 'Kesatuan Identitas',
      description:
        'Simbol dan wordmark dirancang menyatu sebagai satu kesatuan visual, merepresentasikan bagaimana lima entitas di bawah Environesia bekerja sebagai satu ekosistem, bukan lini usaha yang berdiri sendiri-sendiri.',
    },
  ],
  symbolSrc: null,
  wordmarkSrc: null,
};

/** The Storage paths of the two logo photos, used as the editor's starting photos. */
export const MAKNA_IMAGE_PATHS = {
  symbol: LEGACY_MEDIA['/brand/environesia-symbol.png'].path,
  wordmark: LEGACY_MEDIA['/brand/environesia-wordmark.png'].path,
} as const;

type Row = Record<string, unknown>;

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/**
 * The four parts from the row, or the fallback parts. A row counts only when it
 * has exactly four items, each with a label. A partial list would break the
 * animation, so anything else falls back as a whole.
 */
function partsFrom(raw: unknown): MaknaPart[] | null {
  if (!Array.isArray(raw) || raw.length !== MAKNA_PART_COUNT) return null;
  const parts = raw.map((item) => {
    const value = (item ?? {}) as { title?: unknown; label?: unknown; description?: unknown };
    const label = typeof value.title === 'string' ? value.title.trim() : '';
    const description = typeof value.description === 'string' ? value.description.trim() : '';
    return label ? { label, description } : null;
  });
  return parts.every((part): part is MaknaPart => part !== null) ? parts : null;
}

function photoSrc(images: unknown, key: 'symbol' | 'wordmark'): string | null {
  if (!Array.isArray(images)) return null;
  const match = images.find((image) => (image as { key?: unknown })?.key === key) as { path?: unknown } | undefined;
  return typeof match?.path === 'string' && match.path.trim() ? (publicMediaUrl(match.path.trim()) ?? null) : null;
}

/** Turns the row into the content the component shows. Pure, so it can be tested without a database. */
export function buildMaknaLogo(row: Row | null): MaknaLogoContent {
  const fb = MAKNA_LOGO_FALLBACK;
  if (!row) return fb;
  return {
    eyebrow: text(row.eyebrow, fb.eyebrow),
    title: text(row.title, fb.title),
    parts: partsFrom(row.items) ?? fb.parts,
    symbolSrc: photoSrc(row.images, 'symbol'),
    wordmarkSrc: photoSrc(row.images, 'wordmark'),
  };
}

export const getMaknaLogo = cache(async (): Promise<MaknaLogoContent> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from('page_content').select('*').eq('slug', MAKNA_LOGO_SLUG).maybeSingle();
    if (error) return MAKNA_LOGO_FALLBACK;
    return buildMaknaLogo((data as Row | null) ?? null);
  } catch {
    return MAKNA_LOGO_FALLBACK;
  }
});

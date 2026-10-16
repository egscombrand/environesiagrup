import { z } from 'zod';
import { MAKNA_IMAGE_PATHS, MAKNA_LOGO_FALLBACK, MAKNA_PART_COUNT } from '@/lib/cms/makna-logo';
import { STRUKTUR_IMAGE_PATH, STRUKTUR_FALLBACK } from '@/lib/cms/struktur-organisasi-content';
import { BISNIS_LAYANAN_FALLBACK, GROUP_PHOTO_PATH } from '@/lib/cms/bisnis-layanan-content';
import { SEJARAH_FALLBACK } from '@/lib/cms/sejarah-content';
import { VISI_MISI_FALLBACK } from '@/lib/cms/visi-misi-content';
import { DIREKTUR_PAGE_META, LEADERSHIP_HEADINGS } from '@/lib/cms/leadership-content';
import { PENGHARGAAN_FALLBACK } from '@/lib/cms/penghargaan-content';
import { LEGALITAS_PAGE_FALLBACK } from '@/lib/cms/legalitas-page-content';
import {
  GOVERNANCE_FALLBACK,
  GOVERNANCE_HERO_SLUG,
  GOVERNANCE_HERO_IMAGES,
  GOVERNANCE_KERANGKA_SLUG,
  type GovernancePageSlug,
} from '@/lib/cms/governance-fallback';

/**
 * The narrative pages wp-admin edits through the shared `page_content` table.
 * The slug is the key the database row uses, so a slug here must match a row's
 * `slug` exactly. Adding a page means adding an entry here, not a new table.
 */
export type NarrativeBlock = 'items' | 'steps' | 'tags' | 'extra' | 'extraLabel' | 'image' | 'images';

export type NarrativePage = {
  slug: string;
  label: string;
  /** The website section this page belongs to, for the editor's breadcrumb. */
  sectionGroup: 'tentang-kami' | 'bisnis-layanan' | 'tata-kelola-keberlanjutan';
  sectionLabel: string;
  /**
   * True when the public site reads the English and Chinese columns for this
   * page. Only then does the editor show the language tabs and SEO fields, so
   * nothing is typed into a column no page reads.
   */
  localized: boolean;
  /** The optional blocks this page's editor shows, besides the intro fields. */
  blocks: readonly NarrativeBlock[];
  /** For the 'images' block: the named photos this page uses, in the order the editor shows them. */
  imageSlots?: readonly { key: string; label: string; storagePath?: string; withAlt?: boolean; defaultAlt?: string }[];
  /** False when the front end shows no title for the items, so the editor hides it. */
  itemTitles?: boolean;
  /** True when each item also has a small label (e.g. a brand name or an English term), so the editor shows it. */
  itemLabels?: boolean;
  /** False when the front end takes the eyebrow from the translated interface text, so the editor hides it. */
  usesEyebrow?: boolean;
  /** How many items the front end expects. Saving any other count is refused. */
  itemCount?: number;
  /** False when the front end shows no description for this page, so the editor hides it. */
  usesDescription?: boolean;
  /** True when a non-localized page's own route still reads meta_title/meta_description for its SEO. */
  showSeo?: boolean;
  /**
   * The Indonesian text the front end shows today, used as the editor's
   * starting values when no row exists yet — so the first thing an admin
   * sees is what the site already shows, not a blank form. Omit only for a
   * page that genuinely has no hardcoded copy to start from.
   */
  fallback?: Partial<NarrativeLocale>;
};

const TENTANG = 'tentang-kami' as const;
const BISNIS = 'bisnis-layanan' as const;
const TATA = 'tata-kelola-keberlanjutan' as const;
const TATA_LABEL = 'Tata Kelola & Keberlanjutan';

export const NARRATIVE_PAGES: readonly NarrativePage[] = [
  { slug: 'tentang-kami', label: 'Overview', sectionGroup: TENTANG, sectionLabel: 'Tentang Kami', localized: false, blocks: ['items'] },
  {
    slug: 'makna-logo',
    label: 'Makna Logo',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['items', 'images'],
    imageSlots: [
      { key: 'symbol', label: 'Simbol', storagePath: MAKNA_IMAGE_PATHS.symbol },
      { key: 'wordmark', label: 'Wordmark (tipografi)', storagePath: MAKNA_IMAGE_PATHS.wordmark },
    ],
    itemCount: MAKNA_PART_COUNT,
    usesDescription: false,
    fallback: {
      eyebrow: MAKNA_LOGO_FALLBACK.eyebrow,
      title: MAKNA_LOGO_FALLBACK.title,
      items: MAKNA_LOGO_FALLBACK.parts.map((part) => ({ label: '', title: part.label, description: part.description })),
    },
  },
  { slug: 'profil-perusahaan', label: 'Profil Perusahaan', sectionGroup: TENTANG, sectionLabel: 'Tentang Kami', localized: false, blocks: ['items'] },
  { slug: 'layanan', label: 'Layanan', sectionGroup: BISNIS, sectionLabel: 'Layanan', localized: false, blocks: ['items'] },

  // Bisnis & Ekosistem (/bisnis-layanan). The ecosystem diagram reads the
  // entities table directly, and the per-entity profile cards are columns on
  // that same table (see src/lib/admin/resources/entities.ts) — neither is a
  // narrative row.
  {
    slug: 'bisnis-layanan-hero',
    label: 'Hero Halaman',
    sectionGroup: BISNIS,
    sectionLabel: 'Bisnis & Ekosistem',
    localized: false,
    blocks: ['images'],
    usesEyebrow: false,
    showSeo: true,
    imageSlots: [
      {
        key: 'group-photo',
        label: 'Foto Environesia (visual kiri "Kenali Perusahaan")',
        storagePath: GROUP_PHOTO_PATH,
        withAlt: true,
        defaultAlt: BISNIS_LAYANAN_FALLBACK.groupPhoto.imageAlt,
      },
    ],
    fallback: {
      title: BISNIS_LAYANAN_FALLBACK.hero.title,
      description: BISNIS_LAYANAN_FALLBACK.hero.description,
      metaTitle: BISNIS_LAYANAN_FALLBACK.hero.metaTitle,
      metaDescription: BISNIS_LAYANAN_FALLBACK.hero.metaDescription,
    },
  },
  {
    slug: 'bisnis-layanan-ekosistem',
    label: 'Ekosistem Hijau',
    sectionGroup: BISNIS,
    sectionLabel: 'Bisnis & Ekosistem',
    localized: false,
    blocks: [],
    usesEyebrow: false,
    fallback: {
      title: BISNIS_LAYANAN_FALLBACK.ekosistem.title,
      description: BISNIS_LAYANAN_FALLBACK.ekosistem.richText,
    },
  },
  // Tata Kelola & Keberlanjutan. The two shared rows come first: the hero that
  // every route shows, and the seven pillars of the overview.
  { slug: GOVERNANCE_HERO_SLUG, label: 'Hero Halaman', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['image'] },
  { slug: GOVERNANCE_KERANGKA_SLUG, label: 'Tujuh Pilar', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items'] },
  // Sejarah (Perjalanan Kami). Three text blocks, two photos, and the intro.
  {
    slug: 'sejarah',
    label: 'Sejarah',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['items', 'extraLabel', 'images'],
    imageSlots: [
      { key: 'blok-1', label: 'Foto Blok 1 (Awal Perjalanan)' },
      { key: 'blok-2', label: 'Foto Blok 2 (Bertumbuh dari Kebutuhan)' },
    ],
    itemCount: 3,
    itemTitles: false,
    showSeo: true,
    fallback: {
      eyebrow: SEJARAH_FALLBACK.eyebrow,
      title: SEJARAH_FALLBACK.title,
      description: SEJARAH_FALLBACK.lead,
      extraLabel: SEJARAH_FALLBACK.sekilasLabel,
      items: SEJARAH_FALLBACK.blocks.map((block) => ({ label: '', title: '', description: block.text })),
      metaTitle: SEJARAH_FALLBACK.metaTitle,
      metaDescription: SEJARAH_FALLBACK.metaDescription,
    },
  },
  {
    slug: 'perjalanan-timeline',
    label: 'Intro Rekam Jejak',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: [],
    fallback: {
      eyebrow: SEJARAH_FALLBACK.timeline.eyebrow,
      title: SEJARAH_FALLBACK.timeline.title,
      description: SEJARAH_FALLBACK.timeline.intro,
    },
  },
  // Direktur Utama & Dewan Direksi: the page heading and the three section headings.
  // The people themselves are managed in the Kepemimpinan editor.
  {
    slug: 'direktur',
    label: 'Judul Bagian',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['items'],
    itemCount: 3,
    usesDescription: false,
    usesEyebrow: false,
    showSeo: true,
    fallback: {
      title: DIREKTUR_PAGE_META.title,
      items: [
        { label: '', title: LEADERSHIP_HEADINGS.direkturUtama, description: '' },
        { label: '', title: LEADERSHIP_HEADINGS.dewan, description: '' },
        { label: '', title: LEADERSHIP_HEADINGS.entitas.title, description: LEADERSHIP_HEADINGS.entitas.intro },
      ],
      metaTitle: DIREKTUR_PAGE_META.metaTitle,
      metaDescription: DIREKTUR_PAGE_META.metaDescription,
    },
  },
  // Legalitas & Sertifikasi: the tab's own heading, lead paragraph, and the
  // closing "Legal Entity First" note. Entities and documents are a separate
  // editor (content/legal).
  {
    slug: 'legalitas',
    label: 'Judul & Catatan',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['extra'],
    usesEyebrow: false,
    showSeo: true,
    fallback: {
      title: LEGALITAS_PAGE_FALLBACK.title,
      description: LEGALITAS_PAGE_FALLBACK.description,
      extraLabel: LEGALITAS_PAGE_FALLBACK.noteLabel,
      extraText: LEGALITAS_PAGE_FALLBACK.noteText,
      metaTitle: LEGALITAS_PAGE_FALLBACK.metaTitle,
      metaDescription: LEGALITAS_PAGE_FALLBACK.metaDescription,
    },
  },
  // Penghargaan: heading and intro only. No awards list exists yet, and none
  // is invented; the "coming soon" state stays in the component.
  {
    slug: 'penghargaan',
    label: 'Penghargaan',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: [],
    usesEyebrow: false,
    showSeo: true,
    fallback: {
      title: PENGHARGAAN_FALLBACK.title,
      description: PENGHARGAAN_FALLBACK.description,
      metaTitle: PENGHARGAAN_FALLBACK.metaTitle,
      metaDescription: PENGHARGAAN_FALLBACK.metaDescription,
    },
  },
  // Struktur Organisasi: the heading and the chart, with its alt text.
  {
    slug: 'struktur-organisasi',
    label: 'Struktur Organisasi',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['images'],
    imageSlots: [
      {
        key: 'bagan',
        label: 'Bagan struktur organisasi',
        storagePath: STRUKTUR_IMAGE_PATH,
        withAlt: true,
        defaultAlt: STRUKTUR_FALLBACK.imageAlt,
      },
    ],
    usesDescription: false,
    usesEyebrow: false,
    showSeo: true,
    fallback: {
      title: STRUKTUR_FALLBACK.title,
      metaTitle: STRUKTUR_FALLBACK.metaTitle,
      metaDescription: STRUKTUR_FALLBACK.metaDescription,
    },
  },
  // Visi, Misi & Komitmen. Visi and Misi are two chapters; the item title is the chapter label.
  {
    slug: 'visi-misi',
    label: 'Visi & Misi',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['items'],
    itemCount: 2,
    usesDescription: false,
    usesEyebrow: false,
    showSeo: true,
    fallback: {
      title: VISI_MISI_FALLBACK.title,
      items: VISI_MISI_FALLBACK.chapters.map((chapter) => ({ label: '', title: chapter.label, description: chapter.text })),
      metaTitle: VISI_MISI_FALLBACK.metaTitle,
      metaDescription: VISI_MISI_FALLBACK.metaDescription,
    },
  },
  {
    slug: 'komitmen',
    label: 'Komitmen',
    sectionGroup: TENTANG,
    sectionLabel: 'Tentang Kami',
    localized: false,
    blocks: ['items'],
    itemCount: 4,
    usesEyebrow: false,
    fallback: {
      title: VISI_MISI_FALLBACK.komitmen.title,
      description: VISI_MISI_FALLBACK.komitmen.intro,
      items: VISI_MISI_FALLBACK.komitmen.items.map((item) => ({ label: '', title: item.title, description: item.description })),
    },
  },
  { slug: 'tata-kelola', label: 'Tata Kelola', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items', 'extra'] },
  { slug: 'kode-etik', label: 'Kode Etik', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items', 'extra'] },
  { slug: 'kebijakan', label: 'Kebijakan & Kepatuhan', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items', 'extra'] },
  { slug: 'manajemen-risiko', label: 'Manajemen Risiko', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['steps', 'tags', 'extra'] },
  { slug: 'nilai-budaya', label: 'Nilai & Budaya', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items'] },
  { slug: 'keberlanjutan', label: 'Keberlanjutan', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['items'] },
  { slug: 'dampak', label: 'Inisiatif & Dampak', sectionGroup: TATA, sectionLabel: TATA_LABEL, localized: true, blocks: ['steps', 'items'] },
];

export function narrativePageFor(slug: string): NarrativePage | undefined {
  return NARRATIVE_PAGES.find((p) => p.slug === slug);
}

const text = (max: number) => z.string().trim().max(max).default('');

const itemSchema = z.object({
  label: text(80),
  title: text(200),
  description: text(1000),
});

const stepSchema = z.object({
  label: text(80),
  description: text(500),
});

/** Everything the editor writes for one language. Empty strings mean "not set". */
export const narrativeLocaleSchema = z.object({
  eyebrow: text(120),
  title: text(200),
  description: text(2000),
  extraLabel: text(120),
  extraText: text(2000),
  metaTitle: text(120),
  metaDescription: text(320),
  items: z.array(itemSchema).max(50).default([]),
  steps: z.array(stepSchema).max(20).default([]),
  tags: z.array(text(120)).max(50).default([]),
});

export const narrativePayloadSchema = z.object({
  locales: z.object({
    id: narrativeLocaleSchema,
    en: narrativeLocaleSchema,
    zh: narrativeLocaleSchema,
  }),
});

export type NarrativeLocale = z.infer<typeof narrativeLocaleSchema>;
export type NarrativeLang = 'id' | 'en' | 'zh';

export type NarrativeFormValue = {
  status: 'draft' | 'published';
  /** Storage paths. An empty string means "use the default photo". */
  imagePath: string;
  imageMobilePath: string;
  /** Named photos, keyed by the page's imageSlots. */
  images: Record<string, string>;
  /** Alt text of the named photos that have one, keyed the same way. */
  imageAlts: Record<string, string>;
  locales: Record<NarrativeLang, NarrativeLocale>;
};

const EMPTY_LOCALE: NarrativeLocale = {
  eyebrow: '',
  title: '',
  description: '',
  extraLabel: '',
  extraText: '',
  metaTitle: '',
  metaDescription: '',
  items: [],
  steps: [],
  tags: [],
};

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function listValue<T>(value: unknown, parse: (raw: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const parsed = parse(raw as Record<string, unknown>);
    return parsed ? [parsed] : [];
  });
}

/** Reads one language's columns from a row. A missing column reads as empty. */
function localeFromRow(row: Record<string, unknown>, lang: NarrativeLang): NarrativeLocale {
  const col = (name: string) => (lang === 'id' ? name : `${name}_${lang}`);
  return {
    eyebrow: stringValue(row[col('eyebrow')]),
    title: stringValue(row[col('title')]),
    description: stringValue(row[col('description')]),
    extraLabel: stringValue(row[col('extra_label')]),
    extraText: stringValue(row[col('extra_text')]),
    metaTitle: stringValue(row[col('meta_title')]),
    metaDescription: stringValue(row[col('meta_description')]),
    items: listValue(row[col('items')], (raw) => ({
      label: stringValue(raw.label),
      title: stringValue(raw.title),
      description: stringValue(raw.description),
    })),
    steps: listValue(row[col('steps')], (raw) => ({
      label: stringValue(raw.label),
      description: stringValue(raw.description),
    })),
    tags: Array.isArray(row[col('tags')])
      ? (row[col('tags')] as unknown[]).filter((tag): tag is string => typeof tag === 'string')
      : [],
  };
}

/**
 * The intro-and-blocks text the hardcoded copy shows for a page. The editor
 * starts from this when a page has no row yet, so the first save writes what
 * the site already shows. Returns null for a page with no hardcoded copy.
 */
function fallbackLocale(page: NarrativePage): NarrativeLocale | null {
  const slug = page.slug;
  const fb = GOVERNANCE_FALLBACK;
  if (slug === GOVERNANCE_HERO_SLUG) {
    return { ...EMPTY_LOCALE, eyebrow: fb.hero.eyebrow, title: fb.hero.title, description: fb.hero.description, metaTitle: fb.hero.metaTitle, metaDescription: fb.hero.metaDescription };
  }
  if (slug === GOVERNANCE_KERANGKA_SLUG) {
    return { ...EMPTY_LOCALE, eyebrow: fb.kerangka.eyebrow, title: fb.kerangka.title, description: fb.kerangka.description, items: fb.kerangka.items.map((item) => ({ label: '', title: item.title, description: item.description })) };
  }
  const block = fb.pages[slug as GovernancePageSlug];
  if (block) {
    return {
      ...EMPTY_LOCALE,
      eyebrow: block.eyebrow ?? '',
      title: block.title,
      description: block.description ?? '',
      extraLabel: block.extraLabel ?? '',
      extraText: block.extraText ?? '',
      metaTitle: block.metaTitle,
      metaDescription: block.metaDescription,
      items: block.items.map((item) => ({ label: item.label ?? '', title: item.title, description: item.description })),
      steps: block.steps.map((step) => ({ label: step.label, description: step.description ?? '' })),
      tags: block.tags,
    };
  }

  // Every other page declares its own fallback directly on its registry entry
  // (see NarrativePage['fallback']). A page with none genuinely has no
  // hardcoded copy, and starts empty.
  return page.fallback ? { ...EMPTY_LOCALE, ...page.fallback } : null;
}

/** The alt text of each named photo: the saved text, else the text the site shows today. */
function altsFrom(page: NarrativePage, row: Record<string, unknown> | null): Record<string, string> {
  const saved = Array.isArray(row?.images) ? (row.images as { key?: unknown; alt?: unknown }[]) : [];
  return Object.fromEntries(
    (page.imageSlots ?? [])
      .filter((slot) => slot.withAlt)
      .map((slot) => {
        const match = saved.find((image) => image.key === slot.key);
        const alt = typeof match?.alt === 'string' && match.alt.trim() ? match.alt : (slot.defaultAlt ?? '');
        return [slot.key, alt];
      })
  );
}

/** A named photo: the saved path, else the photo the site shows today. */
function imagesFrom(page: NarrativePage, row: Record<string, unknown> | null): Record<string, string> {
  const saved = Array.isArray(row?.images) ? (row.images as { key?: unknown; path?: unknown }[]) : [];
  return Object.fromEntries(
    (page.imageSlots ?? []).map((slot) => {
      const match = saved.find((image) => image.key === slot.key);
      const path = typeof match?.path === 'string' ? match.path : '';
      return [slot.key, path || (slot.storagePath ?? '')];
    })
  );
}

function fallbackImage(slug: string, which: 'desktop' | 'mobile'): string {
  return slug === GOVERNANCE_HERO_SLUG ? GOVERNANCE_HERO_IMAGES[which] : '';
}

/**
 * The editor's starting values. A saved row is shown as it is, even when a
 * field is empty. With no row yet, a Tata Kelola page starts from the hardcoded
 * copy, and any other page starts empty.
 */
export function narrativeFormValue(page: NarrativePage, row: Record<string, unknown> | null): NarrativeFormValue {
  const fallback = row ? null : fallbackLocale(page);
  const ids = fallback ?? localeFromRow(row ?? {}, 'id');

  const status = row?.status === 'published' ? 'published' : 'draft';

  // The hero shows the photo that is already on the site until another one is
  // uploaded. With no photo stored, the editor shows that photo as existing, and
  // the first save stores its path. "Hapus Foto" clears it, and the site then
  // uses the built-in default.
  const imagePath = stringValue(row?.image_path) || fallbackImage(page.slug, 'desktop');
  const imageMobilePath = stringValue(row?.image_mobile_path) || fallbackImage(page.slug, 'mobile');

  return {
    status,
    imagePath,
    imageMobilePath,
    images: imagesFrom(page, row),
    imageAlts: altsFrom(page, row),
    locales: {
      id: ids,
      en: row ? localeFromRow(row, 'en') : EMPTY_LOCALE,
      zh: row ? localeFromRow(row, 'zh') : EMPTY_LOCALE,
    },
  };
}

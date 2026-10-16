import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { GOVERNANCE_FALLBACK, GOVERNANCE_HERO_SLUG, GOVERNANCE_KERANGKA_SLUG } from './governance-fallback';
import { buildGovernanceContent, languageFor, type GovernanceRow } from './governance-content';
import { narrativeFormValue, narrativePageFor } from '@/lib/admin/narrative-pages';

const rowsOf = (entries: [string, GovernanceRow][]) => new Map(entries);

describe('buildGovernanceContent', () => {
  it('shows the hardcoded copy when there are no rows yet', () => {
    expect(buildGovernanceContent(new Map(), 'id')).toEqual(GOVERNANCE_FALLBACK);
  });

  it('shows the Indonesian row value over the fallback', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { title: 'Judul baru' }]]);
    const content = buildGovernanceContent(rows, 'id');
    expect(content.hero.title).toBe('Judul baru');
    expect(content.hero.eyebrow).toBe(GOVERNANCE_FALLBACK.hero.eyebrow);
  });

  it('uses the English column when it is filled in', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { title: 'Judul', title_en: 'Governance' }]]);
    expect(buildGovernanceContent(rows, 'en').hero.title).toBe('Governance');
    expect(buildGovernanceContent(rows, 'id').hero.title).toBe('Judul');
  });

  it('falls back to the Indonesian row value when the translation is empty', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { title: 'Judul', title_zh: '   ' }]]);
    expect(buildGovernanceContent(rows, 'zh').hero.title).toBe('Judul');
  });

  it('falls back to the hardcoded Indonesian copy when neither column is set', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { title_en: null }]]);
    expect(buildGovernanceContent(rows, 'en').hero.title).toBe(GOVERNANCE_FALLBACK.hero.title);
  });

  it('treats an empty list as not set, so the next language choice is used', () => {
    const rows = rowsOf([
      [
        GOVERNANCE_KERANGKA_SLUG,
        { items: [{ title: 'Pilar ID', description: 'Deskripsi' }], items_en: [] },
      ],
    ]);
    const en = buildGovernanceContent(rows, 'en').kerangka.items;
    expect(en).toEqual([{ title: 'Pilar ID', description: 'Deskripsi' }]);
  });

  it('drops list entries with no title and keeps the rest', () => {
    const rows = rowsOf([
      [
        GOVERNANCE_KERANGKA_SLUG,
        {
          items: [
            { title: '', description: 'tanpa judul' },
            { title: 'Tersisa', description: 'ada' },
            'bukan objek',
          ],
        },
      ],
    ]);
    expect(buildGovernanceContent(rows, 'id').kerangka.items).toEqual([{ title: 'Tersisa', description: 'ada' }]);
  });

  it('keeps the label of a principle when the row sets one', () => {
    const rows = rowsOf([
      ['tata-kelola', { items: [{ label: 'Transparency', title: 'Keterbukaan', description: 'Isi' }] }],
    ]);
    expect(buildGovernanceContent(rows, 'id').pages['tata-kelola'].items).toEqual([
      { label: 'Transparency', title: 'Keterbukaan', description: 'Isi' },
    ]);
  });

  it('reads a row written before migration 0029, where the new columns do not exist', () => {
    // A row from 0026 has only the original columns. Every other field must still resolve.
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { eyebrow: 'Eyebrow lama', title: 'Judul lama', description: null, status: 'published' }]]);
    const content = buildGovernanceContent(rows, 'en');
    expect(content.hero.eyebrow).toBe('Eyebrow lama');
    expect(content.hero.metaTitle).toBe(GOVERNANCE_FALLBACK.hero.metaTitle);
    expect(content.hero.desktopImage).toBeNull();
  });

  it('resolves a stored photo path to its public URL', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { image_path: 'tata-kelola/123-foto.jpg' }]]);
    const content = buildGovernanceContent(rows, 'id');
    expect(content.hero.desktopImage).toBe('https://media.test/tata-kelola/123-foto.jpg');
    expect(content.hero.mobileImage).toBeNull();
  });

  it('uses the default photo when the path is empty', () => {
    const rows = rowsOf([[GOVERNANCE_HERO_SLUG, { image_path: '  ', image_mobile_path: null }]]);
    const content = buildGovernanceContent(rows, 'id');
    expect(content.hero.desktopImage).toBeNull();
    expect(content.hero.mobileImage).toBeNull();
  });

  it('builds all seven area pages from their own rows', () => {
    const content = buildGovernanceContent(new Map(), 'id');
    expect(Object.keys(content.pages).sort()).toEqual(
      ['dampak', 'kebijakan', 'keberlanjutan', 'kode-etik', 'manajemen-risiko', 'nilai-budaya', 'tata-kelola'].sort()
    );
    expect(content.pages.dampak.steps.map((s) => s.label)).toEqual(['Kompetensi', 'Layanan', 'Solusi', 'Dampak']);
  });
});

describe('languageFor', () => {
  it('maps the routing locales and defaults everything else to Indonesian', () => {
    expect(languageFor('en')).toBe('en');
    expect(languageFor('zh')).toBe('zh');
    expect(languageFor('id')).toBe('id');
    expect(languageFor('fr')).toBe('id');
  });
});

describe('narrativeFormValue', () => {
  it('starts a Tata Kelola page from the hardcoded copy when it has no row', () => {
    const page = narrativePageFor('kode-etik')!;
    const value = narrativeFormValue(page, null);
    expect(value.locales.id.extraLabel).toBe('KOMITMEN ETIKA');
    expect(value.locales.id.items).toHaveLength(6);
    expect(value.locales.en.title).toBe('');
  });

  it('starts any other page empty when it has no row', () => {
    const page = narrativePageFor('layanan')!;
    const value = narrativeFormValue(page, null);
    expect(value.locales.id.title).toBe('');
    expect(value.locales.id.items).toEqual([]);
  });

  it('shows a saved row as it is, even when a field is empty', () => {
    const page = narrativePageFor('kode-etik')!;
    const value = narrativeFormValue(page, { status: 'published', title: 'Kode', items: [], title_en: 'Code' });
    expect(value.status).toBe('published');
    expect(value.locales.id.items).toEqual([]);
    expect(value.locales.en.title).toBe('Code');
  });
});

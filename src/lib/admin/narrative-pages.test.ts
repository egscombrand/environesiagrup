import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { narrativeFormValue, narrativePageFor } from './narrative-pages';

/**
 * Every page that has hardcoded copy on the front end must show that copy as
 * the editor's starting value when no row exists yet — never a blank form.
 * This regression-tests the bug found in Bisnis & Ekosistem's Hero and
 * Ekosistem Hijau editors: `fallbackLocale` only ever knew about Tata
 * Kelola, so every later page (Makna Logo onward) started empty despite
 * having real fallback copy in its own content module.
 */
describe('a page with hardcoded copy starts from that copy when it has no row', () => {
  const cases: { slug: string; field: 'eyebrow' | 'title' | 'description' | 'extraLabel'; expected: string }[] = [
    { slug: 'makna-logo', field: 'title', expected: 'Makna Logo' },
    { slug: 'sejarah', field: 'title', expected: 'Satu Dekade Environesia' },
    { slug: 'perjalanan-timeline', field: 'title', expected: 'Rekam Jejak & Tonggak Environesia' },
    { slug: 'direktur', field: 'title', expected: 'Direktur Utama & Dewan Direksi' },
    { slug: 'legalitas', field: 'title', expected: 'Legalitas & Sertifikasi' },
    { slug: 'penghargaan', field: 'title', expected: 'Penghargaan' },
    { slug: 'struktur-organisasi', field: 'title', expected: 'Environesia' },
    { slug: 'visi-misi', field: 'title', expected: 'Visi, Misi & Komitmen' },
    { slug: 'komitmen', field: 'title', expected: 'Komitmen' },
    { slug: 'bisnis-layanan-hero', field: 'title', expected: 'Bisnis & Ekosistem Environesia' },
    { slug: 'bisnis-layanan-ekosistem', field: 'title', expected: 'Ekosistem Hijau Terintegrasi Berstandar Global' },
  ];

  it.each(cases)('$slug starts with its real $field, not blank', ({ slug, field, expected }) => {
    const page = narrativePageFor(slug);
    expect(page).toBeTruthy();
    const value = narrativeFormValue(page!, null);
    expect(value.locales.id[field]).toBe(expected);
  });

  it('sejarah also starts with its three real text blocks, not three empty ones', () => {
    const page = narrativePageFor('sejarah')!;
    const value = narrativeFormValue(page, null);
    expect(value.locales.id.items).toHaveLength(3);
    expect(value.locales.id.items.every((item) => item.description.length > 0)).toBe(true);
  });

  it('a page with genuinely no hardcoded copy still starts empty', () => {
    const page = narrativePageFor('layanan')!;
    const value = narrativeFormValue(page, null);
    expect(value.locales.id.title).toBe('');
    expect(value.locales.id.items).toEqual([]);
  });

  it('a saved row is always shown as it is, even when a fallback exists', () => {
    const page = narrativePageFor('penghargaan')!;
    const value = narrativeFormValue(page, { status: 'published', title: 'Judul tersimpan', description: '' });
    expect(value.locales.id.title).toBe('Judul tersimpan');
    expect(value.locales.id.description).toBe('');
  });
});

import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { MAKNA_IMAGE_PATHS, MAKNA_LOGO_FALLBACK, buildMaknaLogo } from './makna-logo';
import { narrativeFormValue, narrativePageFor } from '@/lib/admin/narrative-pages';

const fourItems = ['Simbol', 'Tipografi', 'Warna', 'Kesatuan Identitas'].map((title) => ({
  label: '',
  title,
  description: `Deskripsi ${title}`,
}));

describe('buildMaknaLogo', () => {
  it('shows the current copy and the default photos when there is no row', () => {
    expect(buildMaknaLogo(null)).toEqual(MAKNA_LOGO_FALLBACK);
    expect(MAKNA_LOGO_FALLBACK.parts.map((p) => p.label)).toEqual(['Simbol', 'Tipografi', 'Warna', 'Kesatuan Identitas']);
    expect(MAKNA_LOGO_FALLBACK.symbolSrc).toBeNull();
  });

  it('takes the eyebrow, title, and four parts from the row', () => {
    const content = buildMaknaLogo({ eyebrow: 'Eyebrow baru', title: 'Judul baru', items: fourItems, images: [] });
    expect(content.eyebrow).toBe('Eyebrow baru');
    expect(content.title).toBe('Judul baru');
    expect(content.parts[0]).toEqual({ label: 'Simbol', description: 'Deskripsi Simbol' });
  });

  it('falls back as a whole when the row does not have exactly four parts', () => {
    const three = fourItems.slice(0, 3);
    expect(buildMaknaLogo({ items: three }).parts).toEqual(MAKNA_LOGO_FALLBACK.parts);
  });

  it('falls back as a whole when a part has no label', () => {
    const broken = [...fourItems.slice(0, 3), { title: '  ', description: 'x' }];
    expect(buildMaknaLogo({ items: broken }).parts).toEqual(MAKNA_LOGO_FALLBACK.parts);
  });

  it('resolves each named photo through its storage path, and leaves a missing one to the default', () => {
    const content = buildMaknaLogo({ images: [{ key: 'symbol', path: 'legacy/brand/x.png' }] });
    expect(content.symbolSrc).toBe('https://media.test/legacy/brand/x.png');
    expect(content.wordmarkSrc).toBeNull();
  });
});

describe('the Makna Logo editor', () => {
  const page = narrativePageFor('makna-logo')!;

  it('starts both photos on the ones the site shows today, when nothing is stored', () => {
    const value = narrativeFormValue(page, null);
    expect(value.images).toEqual({ symbol: MAKNA_IMAGE_PATHS.symbol, wordmark: MAKNA_IMAGE_PATHS.wordmark });
  });

  it('shows the saved photo for each slot', () => {
    const value = narrativeFormValue(page, { images: [{ key: 'wordmark', path: 'tentang/wm.png' }] });
    expect(value.images.wordmark).toBe('tentang/wm.png');
    expect(value.images.symbol).toBe(MAKNA_IMAGE_PATHS.symbol);
  });

  it('hides the description and asks for exactly four items', () => {
    expect(page.usesDescription).toBe(false);
    expect(page.itemCount).toBe(4);
  });
});

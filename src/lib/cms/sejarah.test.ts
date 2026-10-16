import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { buildSejarah } from './sejarah';
import { SEJARAH_FALLBACK, paragraphsOf, segmentsOf } from './sejarah-content';

const blockItems = SEJARAH_FALLBACK.blocks.map((b) => ({ title: '', description: `${b.text}\n\nTambahan` }));

describe('buildSejarah', () => {
  it('shows the current copy and placeholders when no row exists', () => {
    const view = buildSejarah(null, null);
    expect(view.title).toBe(SEJARAH_FALLBACK.title);
    expect(view.blocks).toEqual(SEJARAH_FALLBACK.blocks);
    expect(view.photos).toEqual([null, null]);
  });

  it('takes the copy from the rows', () => {
    const view = buildSejarah(
      { eyebrow: 'E', title: 'T', description: 'Lead', extra_label: 'Sekilas', items: blockItems, images: [{ key: 'blok-1', path: 'x/a.jpg' }] },
      { eyebrow: 'Tl', title: 'Judul', description: 'Intro' }
    );
    expect(view.lead).toBe('Lead');
    expect(view.sekilasLabel).toBe('Sekilas');
    expect(view.blocks[0].text).toContain('Tambahan');
    expect(view.photos).toEqual(['https://media.test/x/a.jpg', null]);
    expect(view.timeline).toEqual({ eyebrow: 'Tl', title: 'Judul', intro: 'Intro' });
  });

  it('falls back as a whole when there are not exactly three blocks', () => {
    const view = buildSejarah({ items: blockItems.slice(0, 2) }, null);
    expect(view.blocks).toEqual(SEJARAH_FALLBACK.blocks);
  });
});

describe('paragraph and bold parsing', () => {
  it('splits paragraphs on a blank line', () => {
    expect(paragraphsOf('satu\n\ndua\n\n\ntiga')).toEqual(['satu', 'dua', 'tiga']);
  });

  it('marks text between ** as bold', () => {
    expect(segmentsOf('biasa **tebal** biasa')).toEqual([
      { text: 'biasa ', bold: false },
      { text: 'tebal', bold: true },
      { text: ' biasa', bold: false },
    ]);
  });
});

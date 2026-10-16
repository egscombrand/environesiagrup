import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { buildStruktur } from './struktur-organisasi';
import { STRUKTUR_FALLBACK } from './struktur-organisasi-content';

describe('buildStruktur', () => {
  it('shows the heading and the default chart when no row exists', () => {
    expect(buildStruktur(null)).toEqual({
      title: STRUKTUR_FALLBACK.title,
      imageSrc: null,
      imageAlt: STRUKTUR_FALLBACK.imageAlt,
      metaTitle: STRUKTUR_FALLBACK.metaTitle,
      metaDescription: STRUKTUR_FALLBACK.metaDescription,
    });
  });

  it('shows the stored chart with its alt text', () => {
    const content = buildStruktur({
      title: 'Judul baru',
      images: [{ key: 'bagan', path: 'legacy/bagan.jpg', alt: 'Alt baru' }],
    });
    expect(content).toEqual({
      title: 'Judul baru',
      imageSrc: 'https://media.test/legacy/bagan.jpg',
      imageAlt: 'Alt baru',
      metaTitle: STRUKTUR_FALLBACK.metaTitle,
      metaDescription: STRUKTUR_FALLBACK.metaDescription,
    });
  });

  it('keeps the default alt text when none is stored', () => {
    expect(buildStruktur({ images: [{ key: 'bagan', path: 'legacy/bagan.jpg' }] }).imageAlt).toBe(STRUKTUR_FALLBACK.imageAlt);
  });
});

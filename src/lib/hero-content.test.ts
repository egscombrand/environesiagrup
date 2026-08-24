import { describe, expect, it } from 'vitest';
import { getCollection } from './content';
import type { HeroSlideEntry } from './content-types';

describe('hero content', () => {
  it('reads 2 slides sorted by urutan with the expected fields', () => {
    const slides = getCollection<HeroSlideEntry>('hero')
      .map((e) => e.data)
      .sort((a, b) => a.urutan - b.urutan);

    expect(slides).toHaveLength(2);
    expect(slides[0]).toMatchObject({
      type: 'image',
      src: '/hero/slide-1.svg',
      ctaUrl: '/entitas',
    });
    expect(slides[1]).toMatchObject({
      type: 'image',
      src: '/hero/slide-2.svg',
      ctaUrl: '/proyek',
    });
  });
});

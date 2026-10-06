import { describe, expect, it } from 'vitest';
import { TENTANG_KAMI_ROUTES, findTentangKamiRoute } from './tentang-kami-routes';

describe('TENTANG_KAMI_ROUTES', () => {
  it('lists the 6 tab-system pages in order, with Makna Logo deliberately excluded', () => {
    expect(TENTANG_KAMI_ROUTES.map((route) => route.slug)).toEqual([
      'sejarah',
      'visi-misi-tatanilai',
      'struktur-organisasi',
      'direktur',
      'penghargaan',
      'legalitas',
    ]);
    expect(TENTANG_KAMI_ROUTES.some((route) => route.slug === 'makna-logo')).toBe(false);
  });

  it('gives every route a label, a card description, and a meta description', () => {
    for (const route of TENTANG_KAMI_ROUTES) {
      expect(route.label.length).toBeGreaterThan(0);
      expect(route.deskripsi.length).toBeGreaterThan(0);
      expect(route.metaDescription.length).toBeGreaterThan(0);
    }
  });

  it('looks a route up by slug and throws on an unknown one', () => {
    expect(findTentangKamiRoute('sejarah').label).toBe('Perjalanan Kami');
    expect(() => findTentangKamiRoute('tidak-ada')).toThrow();
    expect(() => findTentangKamiRoute('makna-logo')).toThrow();
  });
});

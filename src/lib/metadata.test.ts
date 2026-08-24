import { describe, expect, it } from 'vitest';
import { buildMetadata } from './metadata';

describe('buildMetadata', () => {
  it('builds title, description, and canonical for a locale-prefixed path', () => {
    const meta = buildMetadata({
      title: 'Entitas Kami',
      description: 'Lima entitas dalam satu grup.',
      locale: 'id',
      path: '/entitas',
    });

    expect(meta.title).toBe('Entitas Kami');
    expect(meta.description).toBe('Lima entitas dalam satu grup.');
    expect(meta.alternates?.canonical).toBe('/id/entitas');
  });

  it('lists both locales as hreflang alternates for the same path', () => {
    const meta = buildMetadata({
      title: 'T',
      description: 'D',
      locale: 'en',
      path: '/bisnis',
    });

    expect(meta.alternates?.languages).toEqual({
      id: '/id/bisnis',
      en: '/en/bisnis',
    });
  });

  it('treats the site root as a bare locale path, not a trailing slash', () => {
    const meta = buildMetadata({ title: 'T', description: 'D', locale: 'id', path: '/' });
    expect(meta.alternates?.canonical).toBe('/id');
  });

  it('carries title and description into openGraph', () => {
    const meta = buildMetadata({ title: 'T', description: 'D', locale: 'id', path: '/entitas' });
    expect(meta.openGraph?.title).toBe('T');
    expect(meta.openGraph?.description).toBe('D');
  });
});

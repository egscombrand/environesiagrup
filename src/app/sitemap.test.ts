import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('includes the homepage for both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id');
    expect(urls).toContain('https://example.invalid/en');
  });

  it('includes every entity detail page in both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/entitas/greenlab');
    expect(urls).toContain('https://example.invalid/en/entitas/bikin-indonesia-berdaya');
  });

  it('includes every pillar detail page in both locales', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://example.invalid/id/bisnis/konsultasi');
    expect(urls).toContain('https://example.invalid/en/bisnis/sertifikasi-profesi');
  });

  it('never emits a duplicate url', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('gives the homepage a higher priority than a detail page', () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url.endsWith('/id'));
    const detail = entries.find((entry) => entry.url.endsWith('/id/entitas/greenlab'));
    expect(home?.priority).toBeGreaterThan(detail?.priority ?? 1);
  });
});

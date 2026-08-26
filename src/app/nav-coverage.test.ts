import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

// Navigation now lives in Supabase (navigation_items), not a static export —
// this mirrors the exact set seeded by scripts/seed-navigation-and-settings.ts
// so this test still catches "added a nav item with no matching route".
const HEADER_ITEMS = [
  { href: '/' },
  { href: '/entitas' },
  { href: '/pimpinan' },
  { href: '/bisnis' },
  { href: '/tentang-kami' },
  { href: '/proyek' },
  { href: '/berita' },
  { href: '/karier' },
  { href: '/kontak' },
];

const FOOTER_ITEMS = [
  { href: '/entitas' },
  { href: '/proyek' },
  { href: '/berita' },
  { href: '/karier' },
  { href: '/unduhan' },
  { href: '/kontak' },
  { href: '/kebijakan-privasi' },
];

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntitySlugs: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/lib/cms/pillars', () => ({
  getPublishedPillarSlugs: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/lib/cms/posts', () => ({
  getPublishedPostSlugs: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/lib/cms/projects', () => ({
  getPublishedProjectSlugs: vi.fn().mockResolvedValue([]),
}));

const { default: sitemap } = await import('./sitemap');

const APP_DIR = path.join(process.cwd(), 'src/app/[locale]');

function routeExists(href: string) {
  if (href === '/') {
    return fs.existsSync(path.join(APP_DIR, 'page.tsx'));
  }
  return fs.existsSync(path.join(APP_DIR, href.replace(/^\//, ''), 'page.tsx'));
}

function missingFromSitemap(items: ReadonlyArray<{ href: string }>, urls: string[]) {
  return items
    .filter(
      (item) => !urls.includes(`https://example.invalid/id${item.href === '/' ? '' : item.href}`)
    )
    .map((item) => item.href);
}

describe('navigation coverage', () => {
  it('has a real page for every header link', () => {
    const missing = HEADER_ITEMS.filter((item) => !routeExists(item.href)).map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it('has a real page for every footer link', () => {
    const missing = FOOTER_ITEMS.filter((item) => !routeExists(item.href)).map(
      (item) => item.href
    );
    expect(missing).toEqual([]);
  });

  it('lists every header link in the sitemap', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(missingFromSitemap(HEADER_ITEMS, urls)).toEqual([]);
  });

  it('lists every footer link in the sitemap', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(missingFromSitemap(FOOTER_ITEMS, urls)).toEqual([]);
  });
});

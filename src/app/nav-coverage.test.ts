import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '@/components/layout/header';
import { FOOTER_LINKS } from '@/components/layout/footer';
import sitemap from './sitemap';

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
    const missing = NAV_ITEMS.filter((item) => !routeExists(item.href)).map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it('has a real page for every footer link', () => {
    const missing = FOOTER_LINKS.filter((item) => !routeExists(item.href)).map(
      (item) => item.href
    );
    expect(missing).toEqual([]);
  });

  it('lists every header link in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(missingFromSitemap(NAV_ITEMS, urls)).toEqual([]);
  });

  it('lists every footer link in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(missingFromSitemap(FOOTER_LINKS, urls)).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { extractImageCandidates, isAllowedImageType, isPrivateAddress } from './news-thumbnail-parse';

const BASE = 'https://radartuban.id/berita/era-ai';

describe('extractImageCandidates', () => {
  it('prefers og:image, then twitter:image, then JSON-LD image, in that order', () => {
    const html = `
      <head>
        <script type="application/ld+json">{"@type":"NewsArticle","image":["https://cdn.radartuban.id/ld.jpg"]}</script>
        <meta name="twitter:image" content="https://cdn.radartuban.id/tw.jpg">
        <meta property="og:image" content="https://cdn.radartuban.id/og.jpg">
      </head>`;
    expect(extractImageCandidates(html, BASE).map((c) => c.source)).toEqual(['og', 'twitter', 'json_ld']);
    expect(extractImageCandidates(html, BASE)[0].url).toBe('https://cdn.radartuban.id/og.jpg');
  });

  it('resolves relative image paths against the article URL', () => {
    const html = `<meta property="og:image" content="/uploads/foto.jpg">`;
    expect(extractImageCandidates(html, BASE)).toEqual([{ source: 'og', url: 'https://radartuban.id/uploads/foto.jpg' }]);
  });

  it('reads attributes in either order and single or double quotes', () => {
    const html = `<meta content='https://x.id/a.jpg' property='og:image'><meta name="twitter:image:src" content="https://x.id/b.jpg">`;
    expect(extractImageCandidates(html, BASE).map((c) => c.url)).toEqual(['https://x.id/a.jpg', 'https://x.id/b.jpg']);
  });

  it('finds nothing when the page declares no lead image — it never falls back to body images', () => {
    const html = `<article><img src="https://ads.example/banner.jpg"><img src="/logo.png"></article>`;
    expect(extractImageCandidates(html, BASE)).toEqual([]);
  });

  it('skips malformed JSON-LD without failing the rest of the page', () => {
    const html = `<script type="application/ld+json">{ broken</script><meta property="og:image" content="https://x.id/ok.jpg">`;
    expect(extractImageCandidates(html, BASE)).toEqual([{ source: 'og', url: 'https://x.id/ok.jpg' }]);
  });

  it('ignores non-http image URLs', () => {
    const html = `<meta property="og:image" content="javascript:alert(1)"><meta property="og:image" content="data:image/png;base64,AAAA">`;
    expect(extractImageCandidates(html, BASE)).toEqual([]);
  });
});

describe('isAllowedImageType', () => {
  it('accepts only jpeg, png, and webp', () => {
    expect(isAllowedImageType('image/jpeg; charset=binary')).toBe(true);
    expect(isAllowedImageType('image/png')).toBe(true);
    expect(isAllowedImageType('image/webp')).toBe(true);
    expect(isAllowedImageType('image/svg+xml')).toBe(false);
    expect(isAllowedImageType('text/html')).toBe(false);
    expect(isAllowedImageType(null)).toBe(false);
  });
});

describe('isPrivateAddress', () => {
  it.each(['127.0.0.1', '10.1.2.3', '192.168.0.9', '172.16.5.5', '169.254.169.254', '0.0.0.0', '100.64.1.1'])(
    'blocks %s',
    (ip) => expect(isPrivateAddress(ip)).toBe(true)
  );
  it.each(['::1', 'fc00::1', 'fe80::1', '::ffff:10.0.0.1'])('blocks IPv6 %s', (ip) => expect(isPrivateAddress(ip)).toBe(true));
  it.each(['8.8.8.8', '203.0.113.7', '180.250.1.1'])('allows public %s', (ip) => expect(isPrivateAddress(ip)).toBe(false));
});

import { extractBodyImageCandidates, pageHeadline } from './news-thumbnail-parse';

const TITLE = 'Dari Pedalaman Rokan Hilir Menuju Sukses Global: Perjalanan Inspiratif Saprian';
const ART = 'https://news.example.id/read/123';

describe('extractBodyImageCandidates', () => {
  it('finds the article photo in the article body, matched to the headline by alt text', () => {
    const html = `
      <header><img src="/logo-site.png" alt="logo"></header>
      <article>
        <h1>${TITLE}</h1>
        <img src="https://news.example.id/media/news/28276914-IMG-WA0004.jpg" alt="${TITLE}">
        <p>Isi berita…</p>
      </article>`;
    const [first] = extractBodyImageCandidates(html, ART);
    expect(first.url).toBe('https://news.example.id/media/news/28276914-IMG-WA0004.jpg');
    expect(first.source).toBe('article_image');
  });

  it('reads lazy-loaded images from data-src instead of the placeholder in src', () => {
    const html = `<article><h1>${TITLE}</h1><img class="lazy featured" src="data:image/gif;base64,R0lGOD" data-src="https://cdn.example.id/foto/utama.jpg" alt="${TITLE}"></article>`;
    expect(extractBodyImageCandidates(html, ART)[0].url).toBe('https://cdn.example.id/foto/utama.jpg');
  });

  it('picks the widest entry from srcset', () => {
    const html = `<article><img srcset="https://cdn.example.id/a-480.jpg 480w, https://cdn.example.id/a-1200.jpg 1200w" src="https://cdn.example.id/a-480.jpg" alt="${TITLE}"></article>`;
    expect(extractBodyImageCandidates(html, ART)[0].url).toBe('https://cdn.example.id/a-1200.jpg');
  });

  it('uses the widest <source> of a <picture> element', () => {
    const html = `<article><picture><source srcset="https://cdn.example.id/p-800.webp 800w, https://cdn.example.id/p-1600.webp 1600w"><img src="https://cdn.example.id/p-800.jpg" alt="${TITLE}"></picture></article>`;
    expect(extractBodyImageCandidates(html, ART)[0].url).toBe('https://cdn.example.id/p-1600.webp');
  });

  it('never returns logos, ads, avatars, or anything inside header, nav, footer, aside, or related blocks', () => {
    const html = `
      <header><img src="https://x.id/header.jpg" alt="${TITLE}"></header>
      <nav><img src="https://x.id/menu.jpg"></nav>
      <aside><img src="https://x.id/sidebar.jpg" alt="${TITLE}"></aside>
      <div class="related-articles"><img src="https://x.id/related.jpg" alt="${TITLE}"></div>
      <article>
        <img src="https://x.id/logo.png" alt="logo">
        <img src="https://x.id/iklan/banner-ads.jpg" alt="iklan">
        <img src="https://secure.gravatar.com/avatar/abc?s=96&d=mm" alt="${TITLE}">
      </article>`;
    expect(extractBodyImageCandidates(html, ART)).toEqual([]);
  });

  it('skips tiny images declared with small dimensions (icons, spacers)', () => {
    const html = `<article><img src="https://x.id/icon.png" width="32" height="32" alt="${TITLE}"></article>`;
    expect(extractBodyImageCandidates(html, ART)).toEqual([]);
  });

  it('reads the headline from og:title or h1 for matching', () => {
    expect(pageHeadline(`<meta property="og:title" content="${TITLE}"><h1>Lain</h1>`)).toBe(TITLE);
    expect(pageHeadline(`<h1>${TITLE}</h1>`)).toBe(TITLE);
  });
});

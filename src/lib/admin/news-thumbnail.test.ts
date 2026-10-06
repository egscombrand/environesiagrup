import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const lookupMock = vi.fn();
vi.mock('node:dns/promises', () => {
  const lookup = (...args: unknown[]) => lookupMock(...args);
  return { lookup, default: { lookup } };
});

const ARTICLE = 'https://radartuban.id/berita/era-ai';

/** A JPEG-headed buffer big enough to count as a lead photo, not an icon. */
function photoBytes(): Uint8Array {
  const bytes = new Uint8Array(6000);
  bytes.set([0xff, 0xd8, 0xff, 0xe0], 0);
  return bytes;
}
const IMAGE = 'https://cdn.radartuban.id/era-ai.jpg';

function htmlPage(body: string) {
  return new Response(body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

describe('findArticleThumbnail', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    lookupMock.mockResolvedValue([{ address: '203.0.113.10', family: 4 }]);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('takes the og:image the article itself declares and returns its bytes', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<meta property="og:image" content="${IMAGE}">`)
        : new Response(photoBytes().buffer as ArrayBuffer, { headers: { 'content-type': 'image/jpeg' } })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status).toBe('found');
    if (result.status === 'found') {
      expect(result.imageUrl).toBe(IMAGE);
      expect(result.contentType).toBe('image/jpeg');
      expect(result.extension).toBe('jpg');
      expect(result.bytes.length).toBe(6000);
    }
  });

  it('refuses to fetch a link that resolves to a private address', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    lookupMock.mockResolvedValue([{ address: '127.0.0.1', family: 4 }]);

    const result = await findArticleThumbnail('https://internal.example/berita');
    expect(result.status).toBe('not_found');
    expect(result.status === 'not_found' && result.reason).toContain('Alamat tujuan tidak diizinkan');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports not_found when the article declares no lead image, never a body image', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockResolvedValue(htmlPage('<article><img src="/banner.jpg"></article>'));

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status).toBe('not_found');
  });

  it('does not store a declared image that is not a JPEG, PNG, or WebP', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<meta property="og:image" content="${IMAGE}">`)
        : new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status).toBe('not_found');
  });

  it('accepts a real JPEG served as application/octet-stream, using the file bytes to decide its type', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    const jpeg = photoBytes();
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<meta property="og:image" content="${IMAGE}">`)
        : new Response(jpeg.buffer as ArrayBuffer, { headers: { 'content-type': 'application/octet-stream' } })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status).toBe('found');
    if (result.status === 'found') expect(result.contentType).toBe('image/jpeg');
  });

  it('skips a generic placeholder image and takes the next real candidate', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    const jpeg = photoBytes();
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<meta property="og:image" content="https://img.media.id/cache/b1-default-grey.jpg"><script type="application/ld+json">{"image":"https://img.media.id/news/real-photo.jpg"}</script>`)
        : new Response(jpeg.buffer as ArrayBuffer, { headers: { 'content-type': 'image/jpeg' } })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status === 'found' && result.imageUrl).toBe('https://img.media.id/news/real-photo.jpg');
  });

  it('finds the article body photo when the page declares no lead image at all', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    const body = 'https://news.example.id/media/news/28276914-foto.jpg';
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<h1>Era AI Makin Cepat, Praktisi Lingkungan</h1><article><img src="${body}" alt="Era AI Makin Cepat, Praktisi Lingkungan"></article>`)
        : new Response(photoBytes().buffer as ArrayBuffer, { headers: { 'content-type': 'image/jpeg' } })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status).toBe('found');
    if (result.status === 'found') {
      expect(result.imageUrl).toBe(body);
      expect(result.detection).toBe('article_image');
    }
  });

  it('falls back to the body photo when the declared og:image is broken (404)', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    const body = 'https://news.example.id/media/news/foto-body.jpg';
    fetchMock.mockImplementation(async (url: URL) => {
      if (url.toString() === ARTICLE)
        return htmlPage(`<meta property="og:image" content="https://news.example.id/broken.jpg"><h1>Era AI Makin Cepat</h1><article><img src="${body}" alt="Era AI Makin Cepat"></article>`);
      if (url.toString() === 'https://news.example.id/broken.jpg') return new Response('', { status: 404 });
      return new Response(photoBytes().buffer as ArrayBuffer, { headers: { 'content-type': 'image/jpeg' } });
    });

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status === 'found' && result.imageUrl).toBe(body);
  });

  it('reports page_blocked for a 403 article page, with the reason in the trace', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockResolvedValue(new Response('', { status: 403 }));

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status === 'not_found' && result.code).toBe('page_blocked');
    expect(result.trace.join('\n')).toContain('403');
  });

  it('reports page_not_found for a 404 article page', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockResolvedValue(new Response('', { status: 404 }));

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status === 'not_found' && result.code).toBe('page_not_found');
  });

  it('reports image_not_accessible when an image is found but none of them downloads', async () => {
    const { findArticleThumbnail } = await import('./news-thumbnail');
    fetchMock.mockImplementation(async (url: URL) =>
      url.toString() === ARTICLE
        ? htmlPage(`<meta property="og:image" content="${IMAGE}">`)
        : new Response('', { status: 403 })
    );

    const result = await findArticleThumbnail(ARTICLE);
    expect(result.status === 'not_found' && result.code).toBe('image_not_accessible');
  });
});

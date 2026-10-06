import 'server-only';

import { lookup } from 'node:dns/promises';
import {
  extensionForImageType,
  extractBodyImageCandidates,
  extractImageCandidates,
  isAllowedImageType,
  isGenericContentType,
  isPrivateAddress,
  MIN_LEAD_IMAGE_BYTES,
  sniffImageType,
} from './news-thumbnail-parse';

// Fetches a news article's own lead image so it can be shown as the card
// thumbnail. Only the article page and the image it declares are requested;
// nothing is generated, and nothing is read from anywhere else.

const TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const MAX_IMAGE_TRIES = 6;
const USER_AGENT = 'Mozilla/5.0 (compatible; EnvironesiaNewsThumbnail/1.0; +https://environesia.co.id)';

class ThumbnailError extends Error {}

/** Refuses anything that isn't a plain http(s) URL pointing at a public address. */
async function assertPublicHttpUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ThumbnailError('Link berita tidak valid.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new ThumbnailError('Hanya link http(s) yang didukung.');
  if (url.username || url.password) throw new ThumbnailError('Link berita tidak valid.');

  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new ThumbnailError('Alamat tujuan tidak diizinkan.');
  }
  return url;
}

/** Follows redirects by hand so every hop is checked against the same rules. */
async function fetchPublic(raw: string, accept: string): Promise<{ response: Response; finalUrl: string }> {
  let current = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const url = await assertPublicHttpUrl(current);
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': USER_AGENT, accept },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, url).toString();
      continue;
    }
    return { response, finalUrl: url.toString() };
  }
  throw new ThumbnailError('Terlalu banyak redirect.');
}

async function readWithLimit(response: Response, maxBytes: number): Promise<Buffer> {
  const declared = Number(response.headers.get('content-length') ?? 0);
  if (declared > maxBytes) throw new ThumbnailError('Ukuran file terlalu besar.');
  if (!response.body) return Buffer.alloc(0);

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new ThumbnailError('Ukuran file terlalu besar.');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

/** Why a lookup didn't find an image — stored as thumbnail_error_reason. */
export type ThumbnailErrorCode =
  | 'page_blocked'
  | 'page_not_found'
  | 'page_unreachable'
  | 'no_image_found'
  | 'image_not_accessible'
  | 'image_type_invalid';

export type ThumbnailDetection = 'og_image' | 'twitter_image' | 'json_ld_image' | 'article_image';

export type ThumbnailLookup =
  | {
      status: 'found';
      imageUrl: string;
      contentType: string;
      extension: 'jpg' | 'png' | 'webp';
      bytes: Buffer;
      detection: ThumbnailDetection;
      trace: string[];
    }
  | { status: 'not_found'; code: ThumbnailErrorCode; reason: string; trace: string[] };

// Generic stand-ins that media sites use when an article has no photo. They
// are real files, so they pass every type check, but they aren't the article's
// image and must never be stored as its thumbnail.
const PLACEHOLDER_PATTERN = /(default|placeholder|no[-_]?image|blank|logo|grey|gray|dummy|avatar|gravatar|profil)/i;

function looksLikePlaceholder(url: string): boolean {
  const { hostname, pathname } = new URL(url);
  return PLACEHOLDER_PATTERN.test(pathname) || PLACEHOLDER_PATTERN.test(hostname);
}

const DETECTION_LABEL: Record<string, ThumbnailDetection> = {
  og: 'og_image',
  twitter: 'twitter_image',
  json_ld: 'json_ld_image',
  article_image: 'article_image',
};

/**
 * Finds the article's own image. Order: declared metadata (og, twitter,
 * JSON-LD), then the article body ranked by position, context, and headline
 * overlap. A candidate that fails to download is skipped and the next one is
 * tried, up to MAX_IMAGE_TRIES. Every step is recorded in `trace`, and a miss
 * carries a code and reason, so a not_found can always be explained.
 */
export async function findArticleThumbnail(sourceUrl: string): Promise<ThumbnailLookup> {
  const trace: string[] = [`Article URL: ${sourceUrl}`];
  const notFound = (code: ThumbnailErrorCode, reason: string): ThumbnailLookup => {
    trace.push(`NOT_FOUND [${code}]: ${reason}`);
    return { status: 'not_found', code, reason, trace };
  };

  try {
    const { response, finalUrl } = await fetchPublic(sourceUrl, 'text/html,application/xhtml+xml');
    const contentType = response.headers.get('content-type') ?? '';
    trace.push(`HTTP status: ${response.status}`, `Final URL setelah redirect: ${finalUrl}`, `Content-Type: ${contentType || '(kosong)'}`);

    if (response.status === 403 || response.status === 401) {
      return notFound('page_blocked', `FAILED: media site returned ${response.status} (kemungkinan memblokir crawler)`);
    }
    if (response.status === 404 || response.status === 410) {
      return notFound('page_not_found', `FAILED: halaman artikel sudah tidak ada (status ${response.status})`);
    }
    if (!response.ok) return notFound('page_unreachable', `FAILED: media site returned ${response.status}`);
    if (!contentType.includes('text/html')) {
      return notFound('page_unreachable', `FAILED: halaman bukan HTML (${contentType || 'tanpa content-type'})`);
    }

    const html = (await readWithLimit(response, MAX_HTML_BYTES)).toString('utf8');
    const declared = extractImageCandidates(html, finalUrl).map((c) => ({ ...c, detection: DETECTION_LABEL[c.source] }));
    const body = extractBodyImageCandidates(html, finalUrl).map((c) => ({ ...c, detection: DETECTION_LABEL[c.source] }));
    const sourceCount = (source: string) => declared.filter((c) => c.source === source).length;
    trace.push(
      `og:image: ${sourceCount('og')}`,
      `twitter:image: ${sourceCount('twitter')}`,
      `JSON-LD image: ${sourceCount('json_ld')}`,
      `kandidat gambar artikel (body): ${body.length}`
    );

    const seen = new Set<string>();
    const ordered = [...declared, ...body].filter((c) => (seen.has(c.url) ? false : (seen.add(c.url), true)));
    if (ordered.length === 0) {
      return notFound('no_image_found', 'og:image, twitter:image, JSON-LD image, dan gambar artikel tidak ditemukan pada halaman');
    }

    let tries = 0;
    let downloadFailures = 0;
    for (const candidate of ordered) {
      if (tries >= MAX_IMAGE_TRIES) break;
      trace.push(`Thumbnail candidate (${candidate.detection}): ${candidate.url}`);
      if (looksLikePlaceholder(candidate.url)) {
        trace.push('  dilewati: terlihat seperti gambar placeholder/default');
        continue;
      }
      tries++;
      try {
        const { response: image } = await fetchPublic(candidate.url, 'image/jpeg,image/png,image/webp,image/*;q=0.8');
        const imageType = image.headers.get('content-type') ?? '';
        trace.push(`  download status: ${image.status}, Content-Type: ${imageType || '(kosong)'}`);
        if (!image.ok) {
          downloadFailures++;
          continue;
        }
        if (!isGenericContentType(imageType) && !imageType.toLowerCase().startsWith('image/') && !isAllowedImageType(imageType)) {
          trace.push(`  FAILED: image download returned ${imageType}`);
          downloadFailures++;
          continue;
        }
        const bytes = await readWithLimit(image, MAX_IMAGE_BYTES);
        const sniffed = sniffImageType(bytes);
        if (!sniffed) {
          trace.push(`  FAILED: isi file bukan JPEG/PNG/WebP (header ${imageType || 'kosong'})`);
          downloadFailures++;
          continue;
        }
        if (bytes.length < MIN_LEAD_IMAGE_BYTES) {
          trace.push(`  dilewati: ${bytes.length} bytes, terlalu kecil untuk foto utama`);
          continue;
        }
        trace.push(`  OK: ${bytes.length} bytes, jenis file dari isi: ${sniffed}`);
        return {
          status: 'found',
          imageUrl: candidate.url,
          contentType: sniffed,
          extension: extensionForImageType(sniffed),
          bytes,
          detection: candidate.detection,
          trace,
        };
      } catch (error) {
        downloadFailures++;
        trace.push(`  FAILED: ${error instanceof Error ? error.message : 'unduhan gagal'}`);
      }
    }
    if (downloadFailures > 0) {
      return notFound('image_not_accessible', `gambar artikel ditemukan (${tries} dicoba) tetapi tidak dapat diunduh`);
    }
    return notFound('no_image_found', 'kandidat gambar tidak memenuhi syarat sebagai foto utama');
  } catch (error) {
    if (error instanceof ThumbnailError) return notFound('page_unreachable', `FAILED: ${error.message}`);
    return notFound('page_unreachable', `FAILED: ${error instanceof Error ? error.message : 'halaman tidak dapat diambil'} (timeout atau diblokir)`);
  }
}

// Pure helpers for finding an article's own lead image. The network work
// lives in news-thumbnail.ts; everything here runs on strings, so it can be
// tested without touching the internet.

export type ThumbnailCandidate = { source: 'og' | 'twitter' | 'json_ld'; url: string };

/** Lead photos are never this small; smaller files are icons, avatars, or spacers. */
export const MIN_LEAD_IMAGE_BYTES = 5000;

/**
 * Bump when the lookup logic changes. Articles checked by an older version are
 * picked up again by the batch, and nothing else is.
 */
export const THUMBNAIL_EXTRACTOR_VERSION = 2;

const ATTRIBUTE = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;

function attributes(tag: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const match of tag.matchAll(ATTRIBUTE)) {
    result[match[1].toLowerCase()] = (match[3] ?? match[4] ?? '').trim();
  }
  return result;
}

function resolveHttpUrl(value: string, baseUrl: string): string | null {
  try {
    const url = new URL(value.trim(), baseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function jsonLdImages(node: unknown, out: string[]): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) jsonLdImages(item, out);
    return;
  }
  const record = node as Record<string, unknown>;
  const image = record.image;
  if (typeof image === 'string') out.push(image);
  else if (Array.isArray(image)) {
    for (const item of image) {
      if (typeof item === 'string') out.push(item);
      else if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        out.push((item as { url: string }).url);
      }
    }
  } else if (image && typeof image === 'object' && typeof (image as { url?: unknown }).url === 'string') {
    out.push((image as { url: string }).url);
  }
  if (record['@graph']) jsonLdImages(record['@graph'], out);
}

/**
 * Image candidates from an article page, best first: og:image, then
 * twitter:image, then JSON-LD "image". Only the page's own declared lead
 * images are considered — body images, sidebars, ads, and footers are never
 * read, so an unrelated picture can't be picked up by accident.
 */
export function extractImageCandidates(html: string, baseUrl: string): ThumbnailCandidate[] {
  const candidates: ThumbnailCandidate[] = [];
  const seen = new Set<string>();
  const add = (source: ThumbnailCandidate['source'], raw: string | undefined) => {
    if (!raw) return;
    const url = resolveHttpUrl(raw, baseUrl);
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({ source, url });
  };

  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const ogUrls: string[] = [];
  const twitterUrls: string[] = [];
  for (const tag of metaTags) {
    const attrs = attributes(tag);
    const key = (attrs.property ?? attrs.name ?? '').toLowerCase();
    if (key === 'og:image' || key === 'og:image:secure_url' || key === 'og:image:url') ogUrls.push(attrs.content ?? '');
    if (key === 'twitter:image' || key === 'twitter:image:src') twitterUrls.push(attrs.content ?? '');
  }
  ogUrls.forEach((u) => add('og', u));
  twitterUrls.forEach((u) => add('twitter', u));

  const scripts = html.match(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
  const ldImages: string[] = [];
  for (const script of scripts) {
    const body = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '');
    try {
      jsonLdImages(JSON.parse(body), ldImages);
    } catch {
      // Malformed JSON-LD on a media site is common; skip that block only.
    }
  }
  ldImages.forEach((u) => add('json_ld', u));

  return candidates;
}

export function isAllowedImageType(contentType: string | null): contentType is 'image/jpeg' | 'image/png' | 'image/webp' {
  if (!contentType) return false;
  const base = contentType.split(';')[0].trim().toLowerCase();
  return base === 'image/jpeg' || base === 'image/png' || base === 'image/webp';
}

/**
 * Identifies JPEG, PNG, or WebP from the file's own leading bytes. Some media
 * CDNs serve real photos as application/octet-stream, so the header alone
 * can't decide what a file is.
 */
export function sniffImageType(bytes: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  const at = (i: number) => bytes[i];
  if (bytes.length >= 3 && at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => at(i) === b)) return 'image/png';
  const ascii = (start: number, text: string) => text.split('').every((c, i) => at(start + i) === c.charCodeAt(0));
  if (bytes.length >= 12 && ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'image/webp';
  return null;
}

/** Header values that say nothing about the file type, so the bytes must decide. */
export function isGenericContentType(contentType: string): boolean {
  const base = contentType.split(';')[0].trim().toLowerCase();
  return base === '' || base === 'application/octet-stream' || base === 'binary/octet-stream' || base === 'application/x-download';
}

export function extensionForImageType(contentType: string): 'jpg' | 'png' | 'webp' {
  const base = contentType.split(';')[0].trim().toLowerCase();
  return base === 'image/png' ? 'png' : base === 'image/webp' ? 'webp' : 'jpg';
}

/** True for addresses a server must never fetch from: loopback, private, link-local, and unspecified ranges. */
export function isPrivateAddress(address: string): boolean {
  const ip = address.toLowerCase();
  if (ip.includes(':')) {
    if (ip === '::1' || ip === '::') return true;
    if (ip.startsWith('::ffff:')) return isPrivateAddress(ip.slice(7));
    return /^f[cd]/.test(ip) || /^fe[89ab]/.test(ip);
  }
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

// ---------------------------------------------------------------------------
// Article body images. Used when the page declares no lead image, or when the
// declared one can't be downloaded. Each media site builds its page
// differently, so this works from context — where an image sits, how it's
// referenced, and how it relates to the headline — rather than one site's
// selectors.
// ---------------------------------------------------------------------------

export type BodyImageCandidate = { source: 'article_image'; url: string; score: number };

/** Chrome that's never the lead photo: logos, ads, navigation, related-article rails. */
const CHROME_BLOCK = /<(header|nav|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi;
const NON_CONTENT_BLOCK = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const RELATED_CLASS =
  /<(div|section|ul|ol)\b[^>]*(class|id)="[^"]*(related|terkait|recommend|populer|popular|trending|sidebar|komentar|comment|iklan|advert|ads?-)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi;

const BLACKLIST = /(logo|icon|avatar|gravatar|favicon|sprite|banner|iklan|advert|\bads?\b|sponsor|sidebar|related|terkait|recommend|footer|social|pixel|spacer|tracking|placeholder|default|dummy|emoticon|smiley|blank)/i;
const LEAD_HINT = /(featured|hero|cover|lead|utama|headline|thumbnail|article|artikel|foto-berita|berita)/i;
const FILE_HINT = /(news|berita|foto|photo|image|upload|wp-content|media|cdn|asset)/i;
const LAZY_ATTRS = ['data-src', 'data-lazy-src', 'data-original', 'data-image-src', 'data-image'];

export function cleanPageForImages(html: string): string {
  return html.replace(NON_CONTENT_BLOCK, '').replace(CHROME_BLOCK, '').replace(RELATED_CLASS, '');
}

export function pageHeadline(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '');
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return (og ?? h1 ?? title ?? '').replace(/\s+/g, ' ').trim();
}

/** Largest entry of a srcset ("a.jpg 480w, b.jpg 1200w" or "a.jpg 1x, b.jpg 2x"). */
function largestFromSrcset(srcset: string, baseUrl: string): { url: string; width: number } | null {
  let best: { url: string; width: number } | null = null;
  for (const part of srcset.split(',')) {
    const [raw, descriptor = ''] = part.trim().split(/\s+/);
    if (!raw) continue;
    const width = Number.parseFloat(descriptor) || 0;
    const url = resolveHttpUrl(raw, baseUrl);
    if (url && (!best || width > best.width)) best = { url, width };
  }
  return best;
}

function imgSource(tag: string, baseUrl: string): { url: string | null; width: number } {
  const attrs = attributes(tag);
  for (const name of LAZY_ATTRS) {
    if (attrs[name]) {
      const url = resolveHttpUrl(attrs[name], baseUrl);
      if (url) return { url, width: 0 };
    }
  }
  const srcset = attrs['data-srcset'] ?? attrs.srcset;
  const fromSet = srcset ? largestFromSrcset(srcset, baseUrl) : null;
  if (fromSet) return { url: fromSet.url, width: fromSet.width };
  if (attrs.src && !attrs.src.startsWith('data:')) return { url: resolveHttpUrl(attrs.src, baseUrl), width: 0 };
  return { url: null, width: 0 };
}

export function extractBodyImageCandidates(html: string, baseUrl: string): BodyImageCandidate[] {
  const cleaned = cleanPageForImages(html);
  const headline = pageHeadline(html).toLowerCase();
  const titleWords = [...new Set(headline.split(/[^a-z0-9]+/).filter((w) => w.length > 3))];
  const articleMatch = cleaned.search(/<article\b/i);
  const articleStart = articleMatch >= 0 ? articleMatch : 0;

  // <picture> blocks: the widest <source> stands in for the <img> inside it.
  const pictureRanges: { start: number; end: number; url: string }[] = [];
  for (const block of cleaned.matchAll(/<picture\b[\s\S]*?<\/picture>/gi)) {
    const start = block.index ?? 0;
    let best: { url: string; width: number } | null = null;
    for (const source of block[0].matchAll(/<source\b[^>]*>/gi)) {
      const srcset = attributes(source[0])['srcset'] ?? attributes(source[0])['data-srcset'];
      const candidate = srcset ? largestFromSrcset(srcset, baseUrl) : null;
      if (candidate && (!best || candidate.width > best.width)) best = candidate;
    }
    if (best) pictureRanges.push({ start, end: start + block[0].length, url: best.url });
  }

  const out: BodyImageCandidate[] = [];
  const seen = new Set<string>();
  let order = 0;
  for (const match of cleaned.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const position = match.index ?? 0;
    const attrs = attributes(tag);
    const { url: rawUrl, width: srcWidth } = imgSource(tag, baseUrl);
    const pictureUrl = pictureRanges.find((r) => position >= r.start && position < r.end)?.url;
    const url = pictureUrl ?? rawUrl;
    order++;
    if (!url || seen.has(url)) continue;

    const descriptor = `${url} ${attrs.class ?? ''} ${attrs.id ?? ''} ${attrs.alt ?? ''}`;
    if (BLACKLIST.test(descriptor)) continue;
    const width = Number.parseInt(attrs.width ?? '', 10) || 0;
    const height = Number.parseInt(attrs.height ?? '', 10) || 0;
    if ((width && width < 300) || (height && height < 200)) continue;

    let score = 0;
    if (position >= articleStart) score += 25;
    else score -= 10;
    if (order <= 3) score += 10;
    if (LEAD_HINT.test(`${attrs.class ?? ''} ${attrs.id ?? ''} ${attrs.alt ?? ''}`)) score += 15;
    if (width >= 600 || srcWidth >= 800) score += 20;
    else if (width >= 400 || srcWidth >= 480) score += 10;
    const alt = (attrs.alt ?? '').toLowerCase();
    const overlap = titleWords.filter((w) => alt.includes(w)).length;
    if (overlap >= 2) score += 20;
    else if (overlap === 1) score += 8;
    if (FILE_HINT.test(url)) score += 5;

    if (score >= 20) {
      seen.add(url);
      out.push({ source: 'article_image', url, score });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

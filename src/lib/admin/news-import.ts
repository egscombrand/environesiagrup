// Pure parsing and preview logic for Berita Perusahaan imports. No file or
// database access here — the server reads the file (news-import-server.ts)
// and passes plain string rows in, so this module is unit-testable as-is.

export type NewsField = 'title' | 'owner' | 'media' | 'published_at' | 'source_url';

export type NewsColumnMap = Partial<Record<NewsField, number>> & { title: number };

export type NewsRowStatus = 'ready' | 'need_review' | 'duplicate' | 'error';

export type NewsPreviewItem = {
  rowNumber: number;
  title: string;
  owner: string | null;
  media: string | null;
  published_at: string | null;
  source_url: string | null;
  status: NewsRowStatus;
  issues: string[];
};

export type NewsPreviewSummary = {
  found: number;
  ready: number;
  needReview: number;
  duplicates: number;
  errors: number;
};

const HEADER_ALIASES: Record<NewsField, string[]> = {
  title: ['judul press release', 'judul', 'judul berita', 'title'],
  owner: ['owner', 'brand', 'perusahaan'],
  media: ['media', 'sumber media', 'outlet'],
  published_at: ['tanggal rilis', 'tanggal', 'tanggal terbit', 'published_at'],
  source_url: ['link berita', 'link', 'tautan', 'url', 'source_url'],
};

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** RFC 4180-style CSV: quoted fields, doubled quotes, CRLF or LF, optional BOM. */
export function parseCsvText(text: string): string[][] {
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function detectNewsColumns(header: string[]): { ok: true; map: NewsColumnMap } | { ok: false; message: string } {
  const normalized = header.map(normalizeHeader);
  const map: Partial<Record<NewsField, number>> = {};

  for (const field of Object.keys(HEADER_ALIASES) as NewsField[]) {
    const index = normalized.findIndex((cell) => HEADER_ALIASES[field].includes(cell));
    if (index !== -1) map[field] = index;
  }

  if (map.title === undefined) {
    return { ok: false, message: 'Kolom "Judul Press Release" tidak ditemukan di baris pertama file.' };
  }
  return { ok: true, map: map as NewsColumnMap };
}

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  januari: 1, februari: 2, maret: 3, mei: 5, juni: 6, juli: 7, agustus: 8,
  oktober: 10, desember: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8,
  sep: 9, sept: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12,
};

function toIsoDate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Accepts 8/5/2024 and 08/05/2024 (day first, as used in Indonesia), 8-5-2024,
 * 2024-05-08, "May 8, 2024", and "8 Mei 2024". Returns YYYY-MM-DD or null.
 */
export function parseNewsDate(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const dmy = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) return toIsoDate(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));

  const monthFirst = value.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monthFirst) {
    const month = MONTHS[monthFirst[1].toLowerCase()];
    return month ? toIsoDate(Number(monthFirst[3]), month, Number(monthFirst[2])) : null;
  }

  const dayFirst = value.match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})$/);
  if (dayFirst) {
    const month = MONTHS[dayFirst[2].toLowerCase()];
    return month ? toIsoDate(Number(dayFirst[3]), month, Number(dayFirst[1])) : null;
  }

  return null;
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function cell(row: string[], index: number | undefined): string {
  if (index === undefined) return '';
  return (row[index] ?? '').trim();
}

export function duplicateKey(title: string, sourceUrl: string | null): string {
  return `${title.trim().toLowerCase()}\u0001${(sourceUrl ?? '').trim().toLowerCase()}`;
}

/**
 * Turns raw data rows into preview items. Each row lands in exactly one
 * bucket: error (no title — never imported), duplicate (same title + link
 * already in the database or earlier in the same file — never imported
 * automatically), need_review (imported, but a field is missing or the
 * link/date is unusable), or ready.
 */
export function buildNewsPreview(
  dataRows: string[][],
  map: NewsColumnMap,
  existing: { title: string; source_url: string | null }[],
  firstRowNumber = 2,
  links: string[][] = []
): { items: NewsPreviewItem[]; summary: NewsPreviewSummary } {
  const existingKeys = new Set(existing.map((row) => duplicateKey(row.title, row.source_url)));
  const seen = new Set<string>();
  const items: NewsPreviewItem[] = [];

  dataRows.forEach((row, index) => {
    if (row.every((value) => value.trim() === '')) return;

    const title = cell(row, map.title);
    const owner = cell(row, map.owner) || null;
    const media = cell(row, map.media) || null;
    const rawDate = cell(row, map.published_at);
    const publishedAt = parseNewsDate(rawDate);
    let sourceUrl = cell(row, map.source_url) || null;
    const linkTarget = map.source_url === undefined ? '' : (links[index]?.[map.source_url] ?? '').trim();
    if (linkTarget && (!sourceUrl || !isHttpUrl(sourceUrl))) sourceUrl = linkTarget;
    const issues: string[] = [];

    const base = {
      rowNumber: firstRowNumber + index,
      title,
      owner,
      media,
      published_at: publishedAt,
      source_url: sourceUrl,
    };

    if (!title) {
      items.push({ ...base, status: 'error', issues: ['Judul Press Release kosong — baris tidak diimport.'] });
      return;
    }

    const key = duplicateKey(title, sourceUrl);
    if (existingKeys.has(key) || seen.has(key)) {
      seen.add(key);
      items.push({ ...base, status: 'duplicate', issues: ['Judul dan link berita sudah ada.'] });
      return;
    }
    seen.add(key);

    if (!owner) issues.push('Owner kosong.');
    if (!media) issues.push('Media kosong.');
    if (!publishedAt) issues.push(rawDate ? 'Tanggal tidak dapat dibaca.' : 'Tanggal kosong.');
    if (!sourceUrl) issues.push('Link berita kosong.');
    else if (!isHttpUrl(sourceUrl)) issues.push('Link berita bukan URL http/https yang valid.');

    items.push({ ...base, status: issues.length > 0 ? 'need_review' : 'ready', issues });
  });

  const count = (status: NewsRowStatus) => items.filter((item) => item.status === status).length;
  return {
    items,
    summary: {
      found: items.length,
      ready: count('ready'),
      needReview: count('need_review'),
      duplicates: count('duplicate'),
      errors: count('error'),
    },
  };
}

export const SPREADSHEET_CONTENT_TYPES = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
} as const;

/** Accepted extensions and the MIME type each one is stored with. */
export function spreadsheetExtension(fileName: string): keyof typeof SPREADSHEET_CONTENT_TYPES | null {
  const match = fileName.toLowerCase().match(/\.(xlsx|xls|csv)$/);
  return match ? (match[1] as keyof typeof SPREADSHEET_CONTENT_TYPES) : null;
}

/**
 * Validation is by extension, never by the browser's MIME type: browsers send
 * CSV as text/csv, application/csv, or application/vnd.ms-excel depending on
 * the OS, so the MIME type alone can't decide. Storage gets the canonical type
 * for the extension, which is what the bucket allow-list checks.
 */
export function validateSpreadsheetFile(
  fileName: string
): { ok: true; extension: keyof typeof SPREADSHEET_CONTENT_TYPES; contentType: string } | { ok: false; message: string } {
  const extension = spreadsheetExtension(fileName);
  if (!extension) return { ok: false, message: 'Hanya file .xlsx, .xls, atau .csv yang didukung.' };
  return { ok: true, extension, contentType: SPREADSHEET_CONTENT_TYPES[extension] };
}

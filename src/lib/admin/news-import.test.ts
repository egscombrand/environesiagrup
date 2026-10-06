import { describe, expect, it, vi } from 'vitest';
import ExcelJS from 'exceljs';
import {
  buildNewsPreview,
  detectNewsColumns,
  parseCsvText,
  parseNewsDate,
} from './news-import';

vi.mock('server-only', () => ({}));

const HEADER = ['Judul Press Release', 'Owner', 'Media', 'Tanggal Rilis', 'Link Berita'];

describe('parseCsvText', () => {
  it('handles quoted commas, doubled quotes, CRLF, and a BOM', () => {
    const text = '﻿Judul,Owner\r\n"Judul, dengan koma","Ia berkata ""halo"""\r\nsatu,dua\r\n';
    expect(parseCsvText(text)).toEqual([
      ['Judul', 'Owner'],
      ['Judul, dengan koma', 'Ia berkata "halo"'],
      ['satu', 'dua'],
    ]);
  });
});

describe('detectNewsColumns', () => {
  it('finds the five columns regardless of case and spacing', () => {
    const result = detectNewsColumns(['  judul   press release ', 'OWNER', 'media', 'Tanggal rilis', 'link berita']);
    expect(result).toEqual({ ok: true, map: { title: 0, owner: 1, media: 2, published_at: 3, source_url: 4 } });
  });

  it('fails clearly when the title column is missing', () => {
    const result = detectNewsColumns(['Owner', 'Media']);
    expect(result.ok).toBe(false);
  });
});

describe('parseNewsDate', () => {
  it.each([
    ['8/5/2024', '2024-05-08'],
    ['08/05/2024', '2024-05-08'],
    ['2024-05-08', '2024-05-08'],
    ['May 8, 2024', '2024-05-08'],
    ['8 Mei 2024', '2024-05-08'],
  ])('reads %s as %s', (raw, iso) => {
    expect(parseNewsDate(raw)).toBe(iso);
  });

  it('returns null for empty or impossible dates instead of guessing', () => {
    expect(parseNewsDate('')).toBeNull();
    expect(parseNewsDate('31/02/2024')).toBeNull();
    expect(parseNewsDate('kemarin')).toBeNull();
  });
});

describe('buildNewsPreview', () => {
  const map = { title: 0, owner: 1, media: 2, published_at: 3, source_url: 4 };
  const complete = ['Greenlab Rilis Cabang', 'GreenLab', 'Beritasatu.com', '8/5/2024', 'https://www.beritasatu.com/a'];

  it('uses the hyperlink target for the link column when the cell only shows a label', () => {
    const { items } = buildNewsPreview(
      [['Judul', 'Owner', 'Media', '2024-01-01', 'Lihat berita']],
      map,
      [],
      2,
      [['', '', '', '', 'https://www.beritasatu.com/x']]
    );
    expect(items[0].source_url).toBe('https://www.beritasatu.com/x');
    expect(items[0].status).toBe('ready');
  });

  it('puts a complete row in ready and never requires owner/brand to be one of a fixed list', () => {
    const { items, summary } = buildNewsPreview([complete, ['Judul Lain', 'Brand Baru', 'Media Lokal', '2024-01-02', 'https://x.id/y']], map, []);
    expect(items.map((i) => i.status)).toEqual(['ready', 'ready']);
    expect(items[1].owner).toBe('Brand Baru');
    expect(summary).toEqual({ found: 2, ready: 2, needReview: 0, duplicates: 0, errors: 0 });
  });

  it('imports incomplete rows as need_review with the reasons listed, not dropped', () => {
    const { items } = buildNewsPreview([['Judul', 'Owner', '', '', 'bukan-url']], map, []);
    expect(items[0].status).toBe('need_review');
    expect(items[0].issues).toEqual(
      expect.arrayContaining(['Media kosong.', 'Tanggal kosong.', 'Link berita bukan URL http/https yang valid.'])
    );
  });

  it('treats a row with no title as an error and not importable', () => {
    const { items, summary } = buildNewsPreview([['', 'GreenLab', 'Kompas', '2024-01-01', 'https://k.com/a']], map, []);
    expect(items[0].status).toBe('error');
    expect(summary.errors).toBe(1);
  });

  it('flags duplicates against the database and within the same file, by title + link', () => {
    const existing = [{ title: 'Greenlab Rilis Cabang', source_url: 'https://www.beritasatu.com/a' }];
    const { items, summary } = buildNewsPreview([complete, complete, ['Judul Baru', 'X', 'Y', '2024-01-01', 'https://z.id']], map, existing);
    expect(items.map((i) => i.status)).toEqual(['duplicate', 'duplicate', 'ready']);
    expect(summary.duplicates).toBe(2);
  });

  it('skips completely empty spreadsheet rows and keeps the buckets adding up to the found total', () => {
    const { items, summary } = buildNewsPreview([complete, ['', '', '', '', ''], ['', 'x', '', '', '']], map, []);
    expect(items).toHaveLength(2);
    expect(summary.ready + summary.needReview + summary.duplicates + summary.errors).toBe(summary.found);
  });
});

describe('readSpreadsheetRows (xlsx round trip)', () => {
  it('reads the first sheet of an .xlsx file, including hyperlink cells', async () => {
    const { readSpreadsheetRows } = await import('./news-import-server');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Berita');
    sheet.addRow(HEADER);
    sheet.addRow([
      'Greenlab Indonesia Rilis Cabang',
      'Greenlab',
      'Beritasatu.com',
      new Date(Date.UTC(2024, 4, 8)),
      { text: 'Lihat berita', hyperlink: 'https://www.beritasatu.com/network/x' },
    ]);
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const { rows, links } = await readSpreadsheetRows(buffer, 'berita.xlsx');
    expect(rows[0]).toEqual(HEADER);
    expect(rows[1][0]).toBe('Greenlab Indonesia Rilis Cabang');
    expect(rows[1][3]).toBe('2024-05-08');
    expect(rows[1][4]).toBe('Lihat berita');
    expect(links[1][4]).toBe('https://www.beritasatu.com/network/x');
  });
});

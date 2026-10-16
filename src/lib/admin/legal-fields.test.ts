import { describe, expect, it } from 'vitest';
import { formatFieldLines, legalDocumentSchema, parseFieldLines } from './legal-fields';

describe('parseFieldLines', () => {
  it('splits each line at its first colon and trims both sides', () => {
    expect(parseFieldLines('Nomor: 29\n Tanggal :  26 Januari 2017 ')).toEqual([
      { label: 'Nomor', value: '29' },
      { label: 'Tanggal', value: '26 Januari 2017' },
    ]);
  });

  it('keeps colons inside the value, and skips blank lines', () => {
    expect(parseFieldLines('Website: https://example.com\n\nNPWP: 01.234')).toEqual([
      { label: 'Website', value: 'https://example.com' },
      { label: 'NPWP', value: '01.234' },
    ]);
  });

  it('treats a line without a colon as a label with no value', () => {
    expect(parseFieldLines('Tanpa nilai')).toEqual([{ label: 'Tanpa nilai', value: '' }]);
  });
});

describe('formatFieldLines', () => {
  it('round-trips with parseFieldLines', () => {
    const fields = [
      { label: 'Nomor', value: '1' },
      { label: 'Notaris', value: 'Asnahwati H. Herwidhi, S.H' },
    ];
    expect(parseFieldLines(formatFieldLines(fields))).toEqual(fields);
  });
});

describe('legalDocumentSchema', () => {
  it('rejects a link that is not http or https', () => {
    const result = legalDocumentSchema.safeParse({ title: 'Sertifikat', fields: [], external_url: 'javascript:alert(1)' });
    expect(result.success).toBe(false);
  });

  it('accepts a document with no link', () => {
    const result = legalDocumentSchema.safeParse({ title: 'Akta', fields: [], external_url: '' });
    expect(result.success).toBe(true);
  });
});

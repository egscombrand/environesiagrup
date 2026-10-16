import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTERS, distinctYears, filterRows, normalizeTextField, normalizeYear, type ProjectEditorRow } from './projects-table-editor-logic';

function row(overrides: Partial<ProjectEditorRow> = {}): ProjectEditorRow {
  return {
    id: 'p1',
    title: 'Kajian Lingkungan',
    client: 'PT Contoh',
    sector: 'Industri',
    city: 'Jawa Barat',
    year: 2022,
    services: 'AMDAL',
    company: 'Environesia',
    status: 'draft',
    ...overrides,
  };
}

describe('filterRows', () => {
  it('returns everything when no filters are set', () => {
    const rows = [row(), row({ id: 'p2', title: 'Lain' })];
    expect(filterRows(rows, DEFAULT_FILTERS)).toHaveLength(2);
  });

  it('matches search against title, client, and city, case-insensitively', () => {
    const rows = [row(), row({ id: 'p2', title: 'Proyek B', client: 'PT Lain', city: 'Bandung' })];
    expect(filterRows(rows, { ...DEFAULT_FILTERS, search: 'contoh' })).toEqual([row()]);
    expect(filterRows(rows, { ...DEFAULT_FILTERS, search: 'BANDUNG' })).toHaveLength(1);
  });

  it('filters by status, sector, company, and year independently', () => {
    const a = row({ id: 'a', status: 'published', sector: 'Industri', company: 'GreenLab', year: 2020 });
    const b = row({ id: 'b', status: 'draft', sector: 'Transportasi', company: 'GreenSkill', year: 2021 });
    const rows = [a, b];

    expect(filterRows(rows, { ...DEFAULT_FILTERS, status: 'published' })).toEqual([a]);
    expect(filterRows(rows, { ...DEFAULT_FILTERS, sector: 'Transportasi' })).toEqual([b]);
    expect(filterRows(rows, { ...DEFAULT_FILTERS, company: 'GreenLab' })).toEqual([a]);
    expect(filterRows(rows, { ...DEFAULT_FILTERS, year: '2021' })).toEqual([b]);
  });

  it('combines multiple active filters (AND, not OR)', () => {
    const a = row({ id: 'a', status: 'published', sector: 'Industri' });
    const b = row({ id: 'b', status: 'published', sector: 'Transportasi' });
    const rows = [a, b];
    expect(filterRows(rows, { ...DEFAULT_FILTERS, status: 'published', sector: 'Industri' })).toEqual([a]);
  });

  it('never loses a row with missing fields — null client/city/sector just never matches a specific filter', () => {
    const incomplete = row({ id: 'incomplete', client: null, city: null, sector: null, year: null });
    expect(filterRows([incomplete], DEFAULT_FILTERS)).toEqual([incomplete]);
    expect(filterRows([incomplete], { ...DEFAULT_FILTERS, search: 'kajian' })).toEqual([incomplete]);
  });
});

describe('distinctYears', () => {
  it('returns unique years sorted newest first, ignoring nulls', () => {
    const rows = [row({ year: 2019 }), row({ year: 2022 }), row({ year: 2019 }), row({ year: null })];
    expect(distinctYears(rows)).toEqual([2022, 2019]);
  });
});

describe('normalizeTextField', () => {
  it('trims whitespace and converts an empty result to null', () => {
    expect(normalizeTextField('  PT Contoh  ')).toBe('PT Contoh');
    expect(normalizeTextField('   ')).toBeNull();
    expect(normalizeTextField('')).toBeNull();
  });
});

describe('normalizeYear', () => {
  it('accepts a valid integer year', () => {
    expect(normalizeYear('2022')).toEqual({ ok: true, year: 2022 });
  });

  it('treats an empty value as clearing the field', () => {
    expect(normalizeYear('')).toEqual({ ok: true, year: null });
    expect(normalizeYear('   ')).toEqual({ ok: true, year: null });
  });

  it('rejects non-numeric or out-of-range input', () => {
    expect(normalizeYear('abc')).toEqual({ ok: false });
    expect(normalizeYear('1899')).toEqual({ ok: false });
    expect(normalizeYear('2101')).toEqual({ ok: false });
    expect(normalizeYear('2020.5')).toEqual({ ok: false });
  });
});

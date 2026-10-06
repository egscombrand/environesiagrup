import { describe, expect, it } from 'vitest';
import { toEditable, isRowValid, needsReview } from './pdf-import-review';
import type { ReviewCandidate } from '@/app/wp-admin/(protected)/content/projects/import/actions';

function candidate(overrides: Partial<ReviewCandidate> = {}): ReviewCandidate {
  return {
    project_name: 'Kajian Lingkungan',
    client: 'PT Contoh',
    sector: 'Industri',
    location: 'Jawa Barat',
    year: 2022,
    service: 'AMDAL',
    brand: 'Environesia Company Group',
    description: null,
    source_page: 1,
    confidence: 'high',
    possibleDuplicateOf: null,
    ...overrides,
  };
}

describe('toEditable', () => {
  it('defaults brand to "Environesia Company Group" when the candidate has none, never "Belum Ditentukan"', () => {
    const row = toEditable(candidate({ brand: undefined }), 0);
    expect(row.brand).toBe('Environesia Company Group');
  });

  it('keeps a specific entity brand exactly as given', () => {
    const row = toEditable(candidate({ brand: 'GreenLab' }), 0);
    expect(row.brand).toBe('GreenLab');
  });

  it('pre-selects a complete, high-confidence, non-duplicate row', () => {
    const row = toEditable(candidate(), 0);
    expect(row.selected).toBe(true);
  });

  it('never pre-selects a low-confidence row, even with every field present', () => {
    const row = toEditable(candidate({ confidence: 'low' }), 0);
    expect(row.selected).toBe(false);
  });

  it('never pre-selects a row flagged as a possible duplicate', () => {
    const row = toEditable(candidate({ possibleDuplicateOf: { id: 'x', title: 'Existing Project' } }), 0);
    expect(row.selected).toBe(false);
  });

  it('does not pre-select a row missing a field worth reviewing (but it is still a valid, importable row)', () => {
    const row = toEditable(candidate({ client: null }), 0);
    expect(row.selected).toBe(false);
    expect(isRowValid(row)).toBe(true);
  });

  it('leaves the Sektor dropdown unselected ("") when the extracted sector is "Perlu Ditinjau" or unrecognized', () => {
    const row = toEditable(candidate({ sector: 'Perlu Ditinjau' }), 0);
    expect(row.sector).toBe('');
  });
});

describe('isRowValid — the only true requirement is a project name', () => {
  it('is valid with every field present', () => {
    expect(isRowValid(toEditable(candidate(), 0))).toBe(true);
  });

  it('is still valid with client, location, sector, year, service, and description all missing — a project is never rejected for incomplete data', () => {
    const row = toEditable(
      candidate({ client: null, location: null, sector: null, year: null, service: null, description: null }),
      0
    );
    expect(isRowValid(row)).toBe(true);
    expect(row.project_name).toBe('Kajian Lingkungan');
  });

  it('is only invalid when the project name itself is missing', () => {
    const row = toEditable(candidate({ project_name: '' }), 0);
    expect(isRowValid(row)).toBe(false);
  });
});

describe('needsReview — a prompt to double-check, never a block on import', () => {
  it('does not need review when every field is present and confidence is not low', () => {
    const row = toEditable(candidate(), 0);
    expect(needsReview(row)).toBe(false);
  });

  it('needs review when client is missing, but the row is still valid (importable)', () => {
    const row = toEditable(candidate({ client: null }), 0);
    expect(needsReview(row)).toBe(true);
    expect(isRowValid(row)).toBe(true);
  });

  it('needs review when location is missing, but the row is still valid (importable)', () => {
    const row = toEditable(candidate({ location: null }), 0);
    expect(needsReview(row)).toBe(true);
    expect(isRowValid(row)).toBe(true);
  });

  it('needs review when sector is unresolved ("Perlu Ditinjau"), but the row is still valid (importable)', () => {
    const row = toEditable(candidate({ sector: 'Perlu Ditinjau' }), 0);
    expect(needsReview(row)).toBe(true);
    expect(isRowValid(row)).toBe(true);
  });

  it('needs review when confidence is low, even with all fields present', () => {
    const row = toEditable(candidate({ confidence: 'low' }), 0);
    expect(needsReview(row)).toBe(true);
  });

  it('does not need review for medium confidence with all fields present', () => {
    const row = toEditable(candidate({ confidence: 'medium' }), 0);
    expect(needsReview(row)).toBe(false);
  });

  it('a project missing year/service/description only (the non-reviewed fields) still does not need review', () => {
    const row = toEditable(candidate({ year: null, service: null, description: null }), 0);
    expect(needsReview(row)).toBe(false);
  });
});

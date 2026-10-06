import { describe, expect, it } from 'vitest';
import { findPossibleDuplicate, type ExistingProjectForDuplicateCheck } from './project-duplicate';

function makeCandidate(overrides: { project_name?: string; client?: string | null; year?: number | null } = {}) {
  return {
    project_name: 'Kajian AMDAL Pelabuhan',
    client: 'PT Pelindo',
    year: 2023,
    ...overrides,
  };
}

function makeExisting(overrides: Partial<ExistingProjectForDuplicateCheck> = {}): ExistingProjectForDuplicateCheck {
  return {
    id: 'existing-1',
    title: 'Kajian AMDAL Pelabuhan',
    client: 'PT Pelindo',
    city: 'Jawa Barat',
    year: 2023,
    ...overrides,
  };
}

describe('findPossibleDuplicate', () => {
  it('flags an exact (case/whitespace-insensitive) title match', () => {
    const candidate = makeCandidate({ project_name: '  Kajian   amdal Pelabuhan ' });
    const existing = [makeExisting()];

    expect(findPossibleDuplicate(candidate, existing)).toEqual(existing[0]);
  });

  it('flags a client+year match even when the project name differs', () => {
    const candidate = makeCandidate({ project_name: 'Audit Lingkungan Tahap 2', client: 'PT Pelindo', year: 2023 });
    const existing = [makeExisting({ title: 'Kajian AMDAL Pelabuhan Tahap 1' })];

    expect(findPossibleDuplicate(candidate, existing)).toEqual(existing[0]);
  });

  it('does not flag genuinely different projects', () => {
    const candidate = makeCandidate({
      project_name: 'Sertifikasi Kompetensi Operator',
      client: 'PT Lain',
      year: 2021,
    });
    const existing = [makeExisting()];

    expect(findPossibleDuplicate(candidate, existing)).toBeNull();
  });

  it('never flags a client+year match when the year is missing on the candidate', () => {
    const candidate = makeCandidate({ project_name: 'Proyek Baru', client: 'PT Pelindo', year: null });
    const existing = [makeExisting()];

    expect(findPossibleDuplicate(candidate, existing)).toBeNull();
  });

  it('returns null against an empty existing-projects list', () => {
    expect(findPossibleDuplicate(makeCandidate(), [])).toBeNull();
  });
});

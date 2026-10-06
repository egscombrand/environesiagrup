import { describe, expect, it } from 'vitest';
import {
  buildPageWindow,
  filterProjects,
  formatLocation,
  paginate,
  totalPages,
  type DirectoryProject,
} from './project-directory-logic';

function project(overrides: Partial<DirectoryProject> = {}): DirectoryProject {
  return {
    id: 'p1',
    title: 'Kajian Lingkungan',
    client: 'PT Contoh',
    sector: 'Industri',
    city: 'Bandung',
    country: 'Indonesia',
    year: 2022,
    ...overrides,
  };
}

describe('filterProjects', () => {
  it('returns everything with no active filters', () => {
    const projects = [project(), project({ id: 'p2', title: 'Lain' })];
    expect(filterProjects(projects, { search: '', sector: 'all' })).toHaveLength(2);
  });

  it('filters by exact sector', () => {
    const a = project({ id: 'a', sector: 'Industri' });
    const b = project({ id: 'b', sector: 'Transportasi' });
    expect(filterProjects([a, b], { search: '', sector: 'Transportasi' })).toEqual([b]);
  });

  it('searches title, client, and city case-insensitively', () => {
    const a = project({ id: 'a', title: 'Kajian Lingkungan', client: 'PT Contoh', city: 'Bandung' });
    const b = project({ id: 'b', title: 'Studi AMDAL', client: 'PT Lain', city: 'Surabaya' });
    expect(filterProjects([a, b], { search: 'surabaya', sector: 'all' })).toEqual([b]);
    expect(filterProjects([a, b], { search: 'PT CONTOH', sector: 'all' })).toEqual([a]);
  });

  it('combines sector and search filters (AND)', () => {
    const a = project({ id: 'a', sector: 'Industri', title: 'Kajian A' });
    const b = project({ id: 'b', sector: 'Industri', title: 'Kajian B' });
    const c = project({ id: 'c', sector: 'Transportasi', title: 'Kajian C' });
    expect(filterProjects([a, b, c], { search: 'kajian b', sector: 'Industri' })).toEqual([b]);
  });

  it('never loses a project with missing metadata — it just never matches a specific filter', () => {
    const incomplete = project({ id: 'incomplete', client: null, city: null, sector: null, year: null });
    expect(filterProjects([incomplete], { search: '', sector: 'all' })).toEqual([incomplete]);
  });
});

describe('totalPages / paginate', () => {
  it('computes page count from the real filtered count, at least 1', () => {
    expect(totalPages(0)).toBe(1);
    expect(totalPages(12)).toBe(1);
    expect(totalPages(13)).toBe(2);
    expect(totalPages(302)).toBe(26);
  });

  it('slices the correct 12-item window per page', () => {
    const items = Array.from({ length: 30 }, (_, i) => i + 1);
    expect(paginate(items, 1)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(paginate(items, 3)).toEqual([25, 26, 27, 28, 29, 30]);
  });
});

describe('buildPageWindow', () => {
  it('shows every page when there are 7 or fewer', () => {
    expect(buildPageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPageWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('windows around the current page with ellipsis gaps for many pages', () => {
    expect(buildPageWindow(1, 26)).toEqual([1, 2, '...', 26]);
    expect(buildPageWindow(5, 26)).toEqual([1, '...', 4, 5, 6, '...', 26]);
    expect(buildPageWindow(26, 26)).toEqual([1, '...', 25, 26]);
  });
});

describe('formatLocation', () => {
  it('joins city and country, and returns null when both are missing', () => {
    expect(formatLocation('Bandung', 'Indonesia')).toBe('Bandung, Indonesia');
    expect(formatLocation('Bandung', null)).toBe('Bandung');
    expect(formatLocation(null, null)).toBeNull();
  });
});

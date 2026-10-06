// Pure, non-'use client' helpers for the Projects CMS table editor —
// extracted so filtering/normalization can be unit-tested without
// mounting React (same pattern as pdf-import-review.ts).

export type ProjectEditorRow = {
  id: string;
  title: string;
  client: string | null;
  sector: string | null;
  city: string | null;
  year: number | null;
  services: string | null;
  company: string | null;
  status: string;
};

export type ProjectEditorFilters = {
  search: string;
  status: 'all' | 'draft' | 'published' | 'archived';
  sector: string;
  company: string;
  year: string;
};

export const DEFAULT_FILTERS: ProjectEditorFilters = {
  search: '',
  status: 'all',
  sector: 'all',
  company: 'all',
  year: 'all',
};

export function filterRows(rows: ProjectEditorRow[], filters: ProjectEditorFilters): ProjectEditorRow[] {
  let result = rows;

  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter((row) =>
      [row.title, row.client, row.city].some((v) => (v ?? '').toLowerCase().includes(q))
    );
  }
  if (filters.status !== 'all') {
    result = result.filter((row) => row.status === filters.status);
  }
  if (filters.sector !== 'all') {
    result = result.filter((row) => row.sector === filters.sector);
  }
  if (filters.company !== 'all') {
    result = result.filter((row) => row.company === filters.company);
  }
  if (filters.year !== 'all') {
    result = result.filter((row) => String(row.year ?? '') === filters.year);
  }

  return result;
}

export function distinctYears(rows: ProjectEditorRow[]): number[] {
  const years = new Set<number>();
  for (const row of rows) {
    if (row.year !== null) years.add(row.year);
  }
  return [...years].sort((a, b) => b - a);
}

/** Trims free-text; an empty result is stored as null, never "". */
export function normalizeTextField(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

/** Parses a year input; empty clears the field, anything non-numeric is rejected. */
export function normalizeYear(value: string): { ok: true; year: number | null } | { ok: false } {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, year: null };
  const year = Number(trimmed);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return { ok: false };
  return { ok: true, year };
}

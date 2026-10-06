// Pure helpers for the "Daftar Proyek" editorial list — filtering, paging,
// and the ellipsis-windowed page numbers — kept framework-free so they're
// unit-testable without mounting the client component.

// Rows in this directory are informational only — never a link to the
// project detail page (see project-directory-list.tsx) — so there is no
// slug here, only the fields actually displayed.
export type DirectoryProject = {
  id: string;
  title: string;
  client: string | null;
  sector: string | null;
  city: string | null;
  country: string | null;
  year: number | null;
};

export type DirectoryFilters = {
  search: string;
  sector: string;
};

export const PAGE_SIZE = 12;

export function filterProjects(projects: DirectoryProject[], filters: DirectoryFilters): DirectoryProject[] {
  let result = projects;

  if (filters.sector !== 'all') {
    result = result.filter((p) => p.sector === filters.sector);
  }

  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter((p) => [p.title, p.client, p.city].some((v) => (v ?? '').toLowerCase().includes(q)));
  }

  return result;
}

export function totalPages(count: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / pageSize));
}

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Windowed page numbers with "..." gaps, e.g. for page 5 of 26:
 * [1, '...', 4, 5, 6, '...', 26]. Always includes the first and last page,
 * the current page, and its immediate neighbors.
 */
export function buildPageWindow(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | '...')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
}

export function formatLocation(city: string | null, country: string | null): string | null {
  const joined = [city, country].filter(Boolean).join(', ');
  return joined || null;
}

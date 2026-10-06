'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { SECTOR_OPTIONS } from '@/lib/admin/project-options';
import { messagesFor } from '@/i18n/messages';
import {
  PAGE_SIZE,
  buildPageWindow,
  filterProjects,
  formatLocation,
  paginate,
  totalPages,
  type DirectoryFilters,
  type DirectoryProject,
} from './project-directory-logic';

const PRIMARY = '#2A7793';
const TEXT = '#444444';
const MUTED = '#666666';
const BORDER = '#E5E7EB';
const INDEX_MUTED = '#9CA3AF';

/**
 * The "Daftar Proyek" Project Directory — a single bordered archive panel
 * holding one editorial row per project, instead of a card grid. Rows are
 * informational only: no link, no href, no click handler, no navigation —
 * clicking a row does nothing. The only interactive elements in this
 * section are the search box, the sector dropdown, and pagination, all
 * running against the real project list already fetched server-side.
 */
export function ProjectDirectoryList({ locale, projects }: { locale: string; projects: DirectoryProject[] }) {
  const t = messagesFor(locale);
  const [filters, setFilters] = useState<DirectoryFilters>({ search: '', sector: 'all' });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterProjects(projects, filters), [projects, filters]);
  const pages = totalPages(filtered.length);
  const pageRows = useMemo(() => paginate(filtered, page), [filtered, page]);
  const pageWindow = useMemo(() => buildPageWindow(page, pages), [page, pages]);

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length);
  const rangeLabel = t.proyek.menampilkanTemplate
    .replace('{start}', String(rangeStart))
    .replace('{end}', String(rangeEnd))
    .replace('{total}', String(filtered.length));
  const indexRange = `${rangeStart}–${rangeEnd}`;

  function updateFilters(patch: Partial<DirectoryFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  if (projects.length === 0) {
    return (
      <p className="text-small" style={{ color: MUTED }}>
        {t.proyek.kosong}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: MUTED }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder={t.proyek.cariPlaceholder}
            className="w-full rounded-[10px] border py-2 pl-9 pr-3 text-small outline-none focus:border-[#2A7793]"
            style={{ borderColor: BORDER, color: TEXT }}
          />
        </div>
        <SectorFilterDropdown
          value={filters.sector}
          onChange={(sector) => updateFilters({ sector })}
          allLabel={t.proyek.filterSemua}
          searchPlaceholder={t.proyek.cariSektorPlaceholder}
        />
        <p className="whitespace-nowrap text-[12px] sm:ml-auto" style={{ color: MUTED }}>
          {rangeLabel}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-[16px] border bg-white" style={{ borderColor: BORDER }}>
        <div
          className="flex h-[50px] items-center justify-between px-5 sm:px-6"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
            {t.proyek.portofolioLabel}
          </p>
          <p className="text-[12px] font-medium" style={{ color: MUTED }}>
            {indexRange}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-small sm:px-6" style={{ color: MUTED }}>
            {t.proyek.tidakAdaHasil}
          </p>
        ) : (
          pageRows.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={(page - 1) * PAGE_SIZE + i + 1} />
          ))
        )}
      </div>

      {pages > 1 ? (
        <nav aria-label="Navigasi halaman proyek" className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="text-small disabled:opacity-40"
            style={{ color: TEXT }}
          >
            ← {t.proyek.sebelumnya}
          </button>

          <div className="flex items-center gap-1.5">
            {pageWindow.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-small" style={{ color: MUTED }}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className="h-8 min-w-8 rounded-[9px] border px-2 text-small transition-colors duration-200"
                  style={
                    p === page
                      ? { borderColor: PRIMARY, backgroundColor: PRIMARY, color: '#fff' }
                      : { borderColor: BORDER, color: TEXT }
                  }
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="text-small disabled:opacity-40"
            style={{ color: TEXT }}
          >
            {t.proyek.berikutnya} →
          </button>
        </nav>
      ) : null}
    </div>
  );
}

/**
 * One editorial, non-navigational row — a plain <div>, never an <a> or a
 * <button>. Clicking it does nothing: no href, no onClick, no router
 * navigation — Search/Filter/Pagination are the only interactive
 * affordances in this section. Hover only gives a subtle background
 * shift. A simple 2-column grid (small index · everything else) stays the
 * same at every breakpoint — content below the title wraps naturally
 * rather than needing a different mobile layout.
 */
function ProjectRow({ project, index }: { project: DirectoryProject; index: number }) {
  const location = formatLocation(project.city, project.country);
  const metaText = [location, project.year ? String(project.year) : null].filter(Boolean).join(' · ');

  return (
    <div
      className="grid grid-cols-[42px_minmax(0,1fr)] gap-x-2 border-b px-5 py-[15px] transition-colors duration-200 last:border-b-0 hover:bg-[#FAFAFA] sm:px-6 sm:py-[18px]"
      style={{ borderColor: BORDER }}
    >
      <span className="text-[16px] font-medium leading-[1.35] sm:text-[17px]" style={{ color: INDEX_MUTED }}>
        {index}
      </span>

      <div className="min-w-0">
        <p className="text-[16px] font-semibold leading-[1.35] sm:text-[17px]" style={{ color: PRIMARY }}>
          {project.title}
        </p>
        {project.client ? (
          <p className="mt-0.5 text-[13px] font-normal leading-[1.35]" style={{ color: MUTED }}>
            {project.client}
          </p>
        ) : null}
        {project.sector || metaText ? (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] leading-[1.4]" style={{ color: MUTED }}>
            {project.sector ? (
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-[3px] text-[12px] font-medium"
                style={{ borderColor: BORDER, color: TEXT, backgroundColor: '#F9FAFB' }}
              >
                {project.sector}
              </span>
            ) : null}
            {project.sector && metaText ? <span aria-hidden="true">·</span> : null}
            {metaText ? <span>{metaText}</span> : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SectorFilterDropdown({
  value,
  onChange,
  allLabel,
  searchPlaceholder,
}: {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const options = [{ value: 'all', label: allLabel }, ...SECTOR_OPTIONS];
  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));
  const currentLabel = options.find((o) => o.value === value)?.label ?? allLabel;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex w-full items-center justify-between gap-2 rounded-[10px] border px-3.5 py-2.5 text-small sm:w-56"
        style={{ borderColor: BORDER, color: TEXT }}
      >
        <span>{currentLabel}</span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: MUTED }} aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-full z-20 mt-1.5 w-64 rounded-[12px] border bg-white p-2 shadow-[0_8px_24px_rgba(16,34,28,0.12)]"
          style={{ borderColor: BORDER }}
        >
          <div className="relative mb-1.5">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: MUTED }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-[8px] border py-1.5 pl-8 pr-2 text-small outline-none focus:border-[#2A7793]"
              style={{ borderColor: BORDER, color: TEXT }}
            />
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="block w-full rounded-[8px] px-3 py-1.5 text-left text-small hover:bg-[#FAFAFA]"
                  style={{ color: option.value === value ? PRIMARY : TEXT }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

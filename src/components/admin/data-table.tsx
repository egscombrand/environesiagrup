'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpDown, PenLine, Search, Inbox } from 'lucide-react';
import type { ColumnConfig } from '@/lib/admin/resources/types';
import { StatusBadge } from './status-badge';
import { StatusSelect } from './status-select';
import { DeleteButton } from './delete-button';
import { EmptyState } from './empty-state';

export type TableRow = {
  id: string;
  values: Record<string, unknown>;
  editHref: string;
  onDelete: () => Promise<{ error?: string } | void>;
  onSetStatus?: (status: 'draft' | 'published' | 'archived') => Promise<{ error?: string } | void>;
};

const PAGE_SIZE = 20;
const STATUS_FILTERS = ['all', 'published', 'draft', 'archived'] as const;

function renderCell(kind: ColumnConfig['kind'], value: unknown) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate">—</span>;
  }

  switch (kind) {
    case 'status':
      return <StatusBadge status={String(value)} />;
    case 'image':
      return typeof value === 'string' && value.startsWith('http') ? (
        <Image src={value} alt="" width={40} height={40} className="h-10 w-10 rounded-[8px] object-cover" />
      ) : (
        <span className="text-slate">—</span>
      );
    case 'badge':
      return (
        <span className="inline-block rounded-full bg-stone px-2.5 py-1 font-mono text-label uppercase text-slate">
          {String(value)}
        </span>
      );
    case 'date':
      return new Date(String(value)).toLocaleDateString('id-ID');
    default:
      return String(value);
  }
}

export function DataTable({
  columns,
  rows,
  titleField,
  singular = 'item',
  searchPlaceholder = 'Search…',
  hasStatusFilter = true,
}: {
  columns: ColumnConfig[];
  rows: TableRow[];
  titleField: string;
  singular?: string;
  searchPlaceholder?: string;
  hasStatusFilter?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = rows;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((row) => String(row.values[titleField] ?? '').toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      result = result.filter((row) => row.values.status === statusFilter);
    }
    if (sort) {
      result = [...result].sort((a, b) => {
        const av = a.values[sort.key];
        const bv = b.values[sort.key];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [rows, search, statusFilter, sort, titleField]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
    setPage(0);
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={`No ${singular.toLowerCase()}s yet`}
        description={`${singular}s you create will appear here.`}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-[10px] border border-line bg-paper py-2 pl-9 pr-3 text-small text-ink outline-none focus:border-forest"
          />
        </div>

        {hasStatusFilter ? (
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(0);
            }}
            className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink outline-none focus:border-forest"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All statuses' : option[0].toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[14px] border border-line bg-paper p-8 text-center text-small text-slate">
          No results match your search.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-mono text-label uppercase text-slate">
                    {col.label ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="flex items-center gap-1 hover:text-ink"
                      >
                        {col.label}
                        <ArrowUpDown className={`h-3 w-3 ${sort?.key === col.key ? 'text-ink' : 'text-line'}`} aria-hidden="true" />
                      </button>
                    ) : null}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0 hover:bg-stone/40">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-ink">
                      {renderCell(col.kind, row.values[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {row.onSetStatus ? (
                        <StatusSelect status={String(row.values.status ?? 'draft')} onChange={row.onSetStatus} />
                      ) : null}
                      <Link
                        href={row.editHref}
                        aria-label={`Edit ${String(row.values[titleField] ?? '')}`}
                        title="Edit"
                        className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest"
                      >
                        <PenLine className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <DeleteButton
                        action={row.onDelete}
                        itemLabel={String(row.values[titleField] ?? '')}
                        iconOnly
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-small text-slate">
            {filtered.length} {filtered.length === 1 ? singular.toLowerCase() : `${singular.toLowerCase()}s`}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-[8px] border border-line px-3 py-1.5 text-small text-ink disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-small text-slate">
              Page {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-[8px] border border-line px-3 py-1.5 text-small text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

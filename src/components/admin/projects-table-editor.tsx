'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, ChevronDown, Inbox, Loader2, PenLine, Search, Trash2 } from 'lucide-react';
import {
  bulkDeleteAction,
  bulkSetStatusAction,
  bulkSetTextFieldAction,
  updateProjectStatusAction,
  updateProjectTextFieldAction,
  updateProjectTitleAction,
  updateProjectYearAction,
  type FieldResult,
  type ProjectTextField,
} from '@/app/wp-admin/(protected)/content/projects/table-actions';
import { SECTOR_OPTIONS, COMPANY_OPTIONS } from '@/lib/admin/project-options';
import {
  DEFAULT_FILTERS,
  distinctYears,
  filterRows,
  normalizeYear,
  type ProjectEditorFilters,
  type ProjectEditorRow,
} from './projects-table-editor-logic';
import { ComboboxField } from './combobox-field';
import { ConfirmDialog } from './confirm-dialog';
import { EmptyState } from './empty-state';
import { useToast } from './toast-provider';

const PAGE_SIZE = 20;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'saving') return <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#64748b]" aria-hidden="true" />;
  if (state === 'saved') return <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />;
  if (state === 'error') return <AlertCircle className="h-3.5 w-3.5 shrink-0 text-danger" aria-label="Gagal menyimpan" />;
  return null;
}

function useAutosave(onError: (message: string) => void) {
  const [state, setState] = useState<SaveState>('idle');
  const run = async (action: () => Promise<FieldResult>, onOk: () => void) => {
    setState('saving');
    const result = await action();
    if (result.ok) {
      setState('saved');
      onOk();
      setTimeout(() => setState((s) => (s === 'saved' ? 'idle' : s)), 2000);
    } else {
      setState('error');
      onError(result.error);
    }
  };
  return { state, run };
}

function TitleCell({
  row,
  onSaved,
  onError,
}: {
  row: ProjectEditorRow;
  onSaved: (title: string) => void;
  onError: (message: string) => void;
}) {
  const [draft, setDraft] = useState(row.title);
  const { state, run } = useAutosave(onError);

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(row.title);
      return;
    }
    if (trimmed === row.title) return;
    run(() => updateProjectTitleAction(row.id, trimmed), () => onSaved(trimmed));
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={draft}
        aria-label={`Nama proyek: ${row.title}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="w-full min-w-[180px] rounded-[8px] border border-transparent bg-transparent px-2 py-1 text-small text-ink outline-none hover:border-[#e3e8ee] focus:border-[#2a7793] focus:bg-white"
      />
      <SaveIndicator state={state} />
    </div>
  );
}

function TextFieldCell({
  row,
  field,
  value,
  options,
  onSaved,
  onError,
}: {
  row: ProjectEditorRow;
  field: ProjectTextField;
  value: string | null;
  options: string[];
  onSaved: (value: string | null) => void;
  onError: (message: string) => void;
}) {
  const { state, run } = useAutosave(onError);

  function commit(next: string) {
    const normalized = next.trim() || null;
    if (normalized === value) return;
    run(() => updateProjectTextFieldAction(row.id, field, next), () => onSaved(normalized));
  }

  return (
    <div className="flex items-center gap-1.5">
      <ComboboxField
        value={value ?? ''}
        options={options}
        onCommit={commit}
        ariaLabel={`${field} untuk ${row.title}`}
        className="min-w-[140px]"
      />
      <SaveIndicator state={state} />
    </div>
  );
}

function YearCell({
  row,
  onSaved,
  onError,
}: {
  row: ProjectEditorRow;
  onSaved: (year: number | null) => void;
  onError: (message: string) => void;
}) {
  const [draft, setDraft] = useState(row.year === null ? '' : String(row.year));
  const { state, run } = useAutosave(onError);

  function commit() {
    const parsed = normalizeYear(draft);
    if (!parsed.ok) {
      onError('Tahun tidak valid.');
      setDraft(row.year === null ? '' : String(row.year));
      return;
    }
    if (parsed.year === row.year) return;
    run(() => updateProjectYearAction(row.id, parsed.year), () => onSaved(parsed.year));
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={draft}
        aria-label={`Tahun proyek: ${row.title}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="w-20 rounded-[8px] border border-transparent bg-transparent px-2 py-1 text-small text-ink outline-none hover:border-[#e3e8ee] focus:border-[#2a7793] focus:bg-white"
      />
      <SaveIndicator state={state} />
    </div>
  );
}

function StatusCell({
  row,
  onSaved,
  onError,
}: {
  row: ProjectEditorRow;
  onSaved: (status: 'draft' | 'published') => void;
  onError: (message: string) => void;
}) {
  const { state, run } = useAutosave(onError);

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={row.status === 'published' ? 'published' : 'draft'}
        aria-label={`Status: ${row.title}`}
        onChange={(e) => {
          const next = e.target.value as 'draft' | 'published';
          run(() => updateProjectStatusAction(row.id, next), () => onSaved(next));
        }}
        className="rounded-[8px] border border-[#e3e8ee] bg-white px-2 py-1 text-small text-ink outline-none focus:border-[#2a7793]"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <SaveIndicator state={state} />
    </div>
  );
}

function BulkFieldControl({
  label,
  options,
  onApply,
}: {
  label: string;
  options: { value: string; label: string }[];
  onApply: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-[8px] border border-[#e3e8ee] bg-white px-3 py-1.5 text-small text-ink hover:border-[#2a7793]/30"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-30 mt-1 w-64 rounded-[10px] border border-[#e3e8ee] bg-white p-3 shadow-[0_8px_24px_rgba(16,34,28,0.12)]">
          <ComboboxField
            value={value}
            options={options.map((o) => o.value)}
            onCommit={setValue}
            onDraftChange={setValue}
            placeholder="Pilih atau ketik baru…"
            ariaLabel={label}
          />
          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => {
              onApply(value.trim());
              setOpen(false);
              setValue('');
            }}
            className="mt-2 w-full rounded-[8px] bg-[#2a7793] px-3 py-1.5 text-small font-medium text-white disabled:opacity-40"
          >
            Terapkan
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BulkStatusControl({ onApply }: { onApply: (status: 'draft' | 'published') => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<'draft' | 'published'>('published');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-[8px] border border-[#e3e8ee] bg-white px-3 py-1.5 text-small text-ink hover:border-[#2a7793]/30"
      >
        Ubah Status
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-[10px] border border-[#e3e8ee] bg-white p-3 shadow-[0_8px_24px_rgba(16,34,28,0.12)]">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value as 'draft' | 'published')}
            className="w-full rounded-[8px] border border-[#e3e8ee] bg-white px-2 py-1.5 text-small text-ink outline-none focus:border-[#2a7793]"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            type="button"
            onClick={() => {
              onApply(value);
              setOpen(false);
            }}
            className="mt-2 w-full rounded-[8px] bg-[#2a7793] px-3 py-1.5 text-small font-medium text-white"
          >
            Terapkan
          </button>
        </div>
      ) : null}
    </div>
  );
}

type PendingBulkAction = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive: boolean;
  run: () => Promise<void>;
};

export function ProjectsTableEditor({
  rows: initialRows,
  canWrite,
}: {
  rows: ProjectEditorRow[];
  canWrite: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [filters, setFilters] = useState<ProjectEditorFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingBulk, setPendingBulk] = useState<PendingBulkAction | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const clientOptions = useMemo(() => distinctValues(rows, 'client'), [rows]);
  const locationOptions = useMemo(() => distinctValues(rows, 'city'), [rows]);
  const serviceOptions = useMemo(() => distinctValues(rows, 'services'), [rows]);
  const years = useMemo(() => distinctYears(rows), [rows]);

  const filtered = useMemo(() => filterRows(rows, filters), [rows, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const selectedCount = selected.size;
  const allFilteredSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someFilteredSelected = filtered.some((r) => selected.has(r.id)) && !allFilteredSelected;
  const headerRef = useRef<HTMLInputElement>(null);
  if (headerRef.current) headerRef.current.indeterminate = someFilteredSelected;

  function updateFilters(patch: Partial<ProjectEditorFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }

  function patchRow(id: string, patch: Partial<ProjectEditorRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function onFieldError(message: string) {
    toast('error', message || 'Gagal menyimpan perubahan.');
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllFiltered(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const row of filtered) {
        if (checked) next.add(row.id);
        else next.delete(row.id);
      }
      return next;
    });
  }

  async function runBulk(action: () => Promise<{ ok: true; count: number } | { ok: false; error: string }>, onOk: () => void) {
    setBulkRunning(true);
    const result = await action();
    setBulkRunning(false);
    if (!result.ok) {
      toast('error', result.error);
      return;
    }
    onOk();
    toast('success', `${result.count} project berhasil diperbarui.`);
    router.refresh();
  }

  function applyBulkStatus(status: 'draft' | 'published') {
    const ids = [...selected];
    runBulk(
      () => bulkSetStatusAction(ids, status),
      () => setRows((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)))
    );
  }

  function requestBulkField(field: 'sector' | 'company', value: string) {
    const ids = [...selected];
    const fieldLabel = field === 'sector' ? 'Sektor' : 'Perusahaan';
    setPendingBulk({
      title: `Ubah ${fieldLabel} ${ids.length} project?`,
      description: `${fieldLabel} akan diubah menjadi "${value}" untuk ${ids.length} project yang dipilih.`,
      confirmLabel: 'Terapkan',
      destructive: false,
      run: async () => {
        await runBulk(
          () => bulkSetTextFieldAction(ids, field, value),
          () => setRows((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, [field]: value || null } : r)))
        );
      },
    });
  }

  function requestBulkDelete() {
    const ids = [...selected];
    setPendingBulk({
      title: `Hapus ${ids.length} project?`,
      description: 'Project yang dihapus tidak akan tampil lagi di website maupun daftar ini.',
      confirmLabel: 'Hapus',
      destructive: true,
      run: async () => {
        await runBulk(
          () => bulkDeleteAction(ids),
          () => {
            setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
            setSelected((prev) => {
              const next = new Set(prev);
              for (const id of ids) next.delete(id);
              return next;
            });
          }
        );
      },
    });
  }

  if (rows.length === 0) {
    return <EmptyState icon={Inbox} title="No projects yet" description="Projects you create will appear here." />;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" aria-hidden="true" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Cari nama proyek, klien, atau lokasi…"
            className="w-full rounded-[10px] border border-[#e3e8ee] bg-white py-2 pl-9 pr-3 text-small text-ink outline-none focus:border-[#2a7793]"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value as ProjectEditorFilters['status'] })}
          className="rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-small text-ink outline-none focus:border-[#2a7793]"
        >
          <option value="all">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filters.sector}
          onChange={(e) => updateFilters({ sector: e.target.value })}
          className="rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-small text-ink outline-none focus:border-[#2a7793]"
        >
          <option value="all">Semua Sektor</option>
          {SECTOR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filters.company}
          onChange={(e) => updateFilters({ company: e.target.value })}
          className="rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-small text-ink outline-none focus:border-[#2a7793]"
        >
          <option value="all">Semua Perusahaan</option>
          {COMPANY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filters.year}
          onChange={(e) => updateFilters({ year: e.target.value })}
          className="rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-small text-ink outline-none focus:border-[#2a7793]"
        >
          <option value="all">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {canWrite && selectedCount > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#2a7793]/20 bg-[#2a7793]/5 px-4 py-3">
          <span className="text-small font-medium text-ink">{selectedCount} project dipilih</span>
          {bulkRunning ? <Loader2 className="h-4 w-4 animate-spin text-[#2a7793]" aria-hidden="true" /> : null}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <BulkStatusControl onApply={applyBulkStatus} />
            <BulkFieldControl label="Ubah Sektor" options={SECTOR_OPTIONS} onApply={(v) => requestBulkField('sector', v)} />
            <BulkFieldControl label="Ubah Perusahaan" options={COMPANY_OPTIONS} onApply={(v) => requestBulkField('company', v)} />
            <button
              type="button"
              onClick={requestBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-danger/30 px-3 py-1.5 text-small font-medium text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Hapus
            </button>
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-[12px] border border-[#e3e8ee] bg-white p-8 text-center text-small text-[#64748b]">
          Tidak ada project yang cocok dengan pencarian/filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[12px] border border-[#e3e8ee] bg-white">
          <table className="w-full min-w-[960px] text-left text-small">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-[#e3e8ee]">
                {canWrite ? (
                  <th className="px-4 py-3">
                    <input
                      ref={headerRef}
                      type="checkbox"
                      aria-label="Pilih Semua"
                      checked={allFilteredSelected}
                      onChange={(e) => toggleSelectAllFiltered(e.target.checked)}
                      className="h-4 w-4 rounded border-[#e3e8ee]"
                    />
                  </th>
                ) : null}
                {['Nama Proyek', 'Klien', 'Sektor', 'Lokasi', 'Tahun', 'Layanan', 'Perusahaan', 'Status'].map((label) => (
                  <th key={label} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                    {label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-b border-[#e3e8ee] last:border-0 hover:bg-[#f4f6f9]/40">
                  {canWrite ? (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Pilih ${row.title}`}
                        checked={selected.has(row.id)}
                        onChange={(e) => toggleRow(row.id, e.target.checked)}
                        className="h-4 w-4 rounded border-[#e3e8ee]"
                      />
                    </td>
                  ) : null}
                  <td className="px-2 py-1.5">
                    <TitleCell row={row} onSaved={(title) => patchRow(row.id, { title })} onError={onFieldError} />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextFieldCell
                      row={row}
                      field="client"
                      value={row.client}
                      options={clientOptions}
                      onSaved={(client) => patchRow(row.id, { client })}
                      onError={onFieldError}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextFieldCell
                      row={row}
                      field="sector"
                      value={row.sector}
                      options={SECTOR_OPTIONS.map((o) => o.value)}
                      onSaved={(sector) => patchRow(row.id, { sector })}
                      onError={onFieldError}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextFieldCell
                      row={row}
                      field="city"
                      value={row.city}
                      options={locationOptions}
                      onSaved={(city) => patchRow(row.id, { city })}
                      onError={onFieldError}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <YearCell row={row} onSaved={(year) => patchRow(row.id, { year })} onError={onFieldError} />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextFieldCell
                      row={row}
                      field="services"
                      value={row.services}
                      options={serviceOptions}
                      onSaved={(services) => patchRow(row.id, { services })}
                      onError={onFieldError}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <TextFieldCell
                      row={row}
                      field="company"
                      value={row.company}
                      options={COMPANY_OPTIONS.map((o) => o.value)}
                      onSaved={(company) => patchRow(row.id, { company })}
                      onError={onFieldError}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <StatusCell row={row} onSaved={(status) => patchRow(row.id, { status })} onError={onFieldError} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/wp-admin/content/projects/${row.id}`}
                      aria-label={`Edit lengkap ${row.title}`}
                      title="Edit lengkap"
                      className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#2a7793]/10 hover:text-[#2a7793]"
                    >
                      <PenLine className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-small text-[#64748b]">
          {filtered.length} project{selectedCount > 0 ? ` · ${selectedCount} dipilih` : ''}
        </p>
        {totalPages > 1 ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-[8px] border border-[#e3e8ee] px-3 py-1.5 text-small text-ink disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-small text-[#64748b]">
              Page {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-[8px] border border-[#e3e8ee] px-3 py-1.5 text-small text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={pendingBulk !== null}
        title={pendingBulk?.title ?? ''}
        description={pendingBulk?.description}
        confirmLabel={pendingBulk?.confirmLabel}
        destructive={pendingBulk?.destructive ?? true}
        pending={bulkRunning}
        onConfirm={async () => {
          await pendingBulk?.run();
          setPendingBulk(null);
        }}
        onCancel={() => setPendingBulk(null)}
      />
    </div>
  );
}

function distinctValues(rows: ProjectEditorRow[], key: 'client' | 'city' | 'services'): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    const v = row[key];
    if (v && v.trim()) set.add(v.trim());
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

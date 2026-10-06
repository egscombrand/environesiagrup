'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { SECTOR_OPTIONS, COMPANY_OPTIONS } from '@/lib/admin/project-options';
import {
  startImportAction,
  saveImportChunkAction,
  completeImportAction,
  cancelImportAction,
  type SelectedProject,
} from '@/app/wp-admin/(protected)/content/projects/import/actions';
import { toEditable, isRowValid, needsReview, type EditableCandidate } from './pdf-import-review';
import { useToast } from './toast-provider';

const MAX_SIZE_LABEL = '20 MB';
const SAVE_CHUNK_SIZE = 25;

const PROCESSING_STAGES = ['Uploading PDF', 'Reading PDF', 'Extracting Projects', 'Classifying Projects', 'Preparing Review'];

const CONFIDENCE_LABEL: Record<EditableCandidate['confidence'], string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};
const CONFIDENCE_CLASS: Record<EditableCandidate['confidence'], string> = {
  high: 'text-success',
  medium: 'text-amber-600',
  low: 'text-danger',
};

const inputClass =
  'w-full rounded-[8px] border border-line bg-paper px-2.5 py-1.5 text-small text-ink outline-none focus:border-forest';

export function PdfImportWizard() {
  const toast = useToast();
  const [step, setStep] = useState<'upload' | 'processing' | 'review' | 'importing' | 'done'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [sourceDocument, setSourceDocument] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<EditableCandidate[]>([]);
  const [saving, setSaving] = useState(false);
  const [importProgress, setImportProgress] = useState({ done: 0, total: 0 });
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Purely cosmetic staged progress while the one real server call is in
  // flight — the stages are real conceptual steps, just not independently
  // observable from a single request/response round trip.
  useEffect(() => {
    if (step !== 'processing') return;
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, PROCESSING_STAGES.length - 1));
    }, 1100);
    return () => clearInterval(interval);
  }, [step]);

  async function handleFile(file: File) {
    setError(null);

    if (file.type !== 'application/pdf') {
      setError('Hanya file PDF yang didukung.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_SIZE_LABEL}.`);
      return;
    }

    setStep('processing');
    const formData = new FormData();
    formData.set('file', file);

    const result = await startImportAction(formData);

    if (!result.ok) {
      setError(result.error);
      setStep('upload');
      return;
    }

    setBatchId(result.batchId);
    setSourceDocument(result.sourceDocument);
    setCandidates(result.candidates.map(toEditable));
    setStep('review');
  }

  function updateRow(key: string, patch: Partial<EditableCandidate>) {
    setCandidates((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, ...patch };
        return next;
      })
    );
  }

  const selectedCount = candidates.filter((c) => c.selected).length;
  const allSelected = candidates.length > 0 && selectedCount === candidates.length;
  const someSelected = selectedCount > 0 && !allSelected;
  const needsReviewCount = candidates.filter((c) => needsReview(c)).length;
  const readyCount = candidates.length - needsReviewCount;
  const duplicateCount = candidates.filter((c) => c.possibleDuplicateOf).length;

  // "Pilih Semua" is a deliberate, explicit bulk action: it selects
  // everything, including rows that need review or are flagged as a
  // possible duplicate — the admin excludes any of those afterward with
  // their own individual checkbox, rather than the tool holding them back
  // by default the way initial auto-selection does.
  function toggleSelectAll(checked: boolean) {
    setCandidates((prev) => prev.map((row) => ({ ...row, selected: checked })));
  }

  async function handleSave() {
    if (!batchId || !sourceDocument) return;
    const selected: SelectedProject[] = candidates
      .filter((c) => c.selected && isRowValid(c))
      .map((c) => ({
        project_name: c.project_name,
        client: c.client,
        sector: c.sector,
        location: c.location,
        year: c.year ? Number(c.year) : null,
        service: c.service || null,
        brand: c.brand,
        description: c.description || null,
        source_page: c.source_page,
        confidence: c.confidence,
      }));

    if (selected.length === 0) {
      toast('error', 'Pilih minimal satu proyek yang siap diimport.');
      return;
    }

    setSaving(true);
    setStep('importing');
    setImportProgress({ done: 0, total: selected.length });

    // Saved in chunks (not one giant call) specifically so the progress
    // shown — "125 / 302" — reflects rows actually written so far, never a
    // simulated number. One chunk failing doesn't stop the rest; its rows
    // just aren't counted as saved, same "keep going" principle the
    // per-row insert already applies inside saveImportChunkAction.
    let totalSaved = 0;
    for (let i = 0; i < selected.length; i += SAVE_CHUNK_SIZE) {
      const chunk = selected.slice(i, i + SAVE_CHUNK_SIZE);
      const result = await saveImportChunkAction(batchId, sourceDocument, chunk);
      if (result.ok) totalSaved += result.savedCount;
      setImportProgress({ done: Math.min(i + SAVE_CHUNK_SIZE, selected.length), total: selected.length });
    }

    setSaving(false);

    if (totalSaved === 0) {
      setStep('review');
      toast('error', 'Tidak ada proyek yang berhasil disimpan — periksa kembali data yang dipilih.');
      return;
    }

    await completeImportAction(batchId, totalSaved);

    setSavedCount(totalSaved);
    setStep('done');
    toast('success', `${totalSaved} proyek berhasil diimport sebagai Draft.`);
  }

  function reset() {
    setStep('upload');
    setError(null);
    setBatchId(null);
    setSourceDocument(null);
    setCandidates([]);
    setSavedCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleCancel() {
    if (batchId) await cancelImportAction(batchId);
    reset();
  }

  if (step === 'upload') {
    return (
      <div className="max-w-2xl">
        <label className="font-mono text-label uppercase text-slate">Upload Portfolio PDF</label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed px-6 py-14 text-center transition-colors ${
            dragOver ? 'border-forest bg-forest/5' : 'border-line bg-paper hover:border-forest/40'
          }`}
        >
          <UploadCloud className="h-8 w-8 text-slate" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-body text-ink">Drag &amp; drop PDF di sini atau pilih file</p>
          <p className="text-small text-slate">PDF only, maksimal {MAX_SIZE_LABEL}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        {error ? (
          <p className="mt-3 flex items-center gap-1.5 text-small text-danger">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="flex max-w-2xl flex-col items-center gap-4 rounded-[14px] border border-line bg-paper px-6 py-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-forest" aria-hidden="true" />
        <p className="font-display text-h3 text-ink">{PROCESSING_STAGES[stageIndex]}…</p>
        <div className="flex gap-1.5">
          {PROCESSING_STAGES.map((stage, i) => (
            <span
              key={stage}
              className={`h-1.5 w-8 rounded-full ${i <= stageIndex ? 'bg-forest' : 'bg-stone'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 'importing') {
    const pct = importProgress.total > 0 ? Math.round((importProgress.done / importProgress.total) * 100) : 0;
    return (
      <div className="flex max-w-2xl flex-col items-center gap-4 rounded-[14px] border border-line bg-paper px-6 py-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-forest" aria-hidden="true" />
        <p className="font-display text-h3 text-ink">Mengimpor project…</p>
        <p className="text-small text-slate">
          {importProgress.done} / {importProgress.total}
        </p>
        <div className="h-1.5 w-full max-w-xs rounded-full bg-stone">
          <div
            className="h-1.5 rounded-full bg-forest transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex max-w-2xl flex-col items-center gap-3 rounded-[14px] border border-line bg-paper px-6 py-16 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
        <p className="font-display text-h3 text-ink">{savedCount} proyek berhasil diimport sebagai Draft</p>
        <p className="max-w-md text-small text-slate">
          Buka Projects untuk meninjau dan mempublikasikan proyek yang baru diimport.
        </p>
        <div className="mt-2 flex gap-3">
          <Link
            href="/wp-admin/content/projects"
            className="rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
          >
            Buka Projects
          </Link>
          <button
            type="button"
            onClick={reset}
            className="rounded-[10px] border border-line px-4 py-2 text-small text-ink hover:border-forest/30"
          >
            Import PDF Lain
          </button>
        </div>
      </div>
    );
  }

  // step === 'review'
  return (
    <div>
      <div className="rounded-[14px] border border-line bg-paper p-4">
        {/* Bulk selection is the primary, easiest path — one click selects
            everything (including rows that need review or look like a
            possible duplicate; the admin excludes any of those afterward
            with their own row checkbox), one click imports everything.
            Individual checkboxes below still work for a partial import. */}
        <div className="flex flex-wrap items-center gap-4 border-b border-line pb-4">
          <label className="flex items-center gap-2 text-small font-medium text-ink">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            Pilih Semua
          </label>
          <p className="text-small text-slate">
            {candidates.length} project ditemukan · {selectedCount} project dipilih
          </p>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={handleCancel} className="text-small text-slate hover:text-ink">
              Batal
            </button>
            <button
              type="button"
              disabled={saving || selectedCount === 0}
              onClick={handleSave}
              className="rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90 disabled:opacity-40"
            >
              {saving
                ? 'Menyimpan…'
                : allSelected
                  ? 'Import Semua sebagai Draft'
                  : `Import ${selectedCount} Project sebagai Draft`}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          <div>
            <p className="font-mono text-label uppercase text-slate">Projects found</p>
            <p className="font-display text-h3 text-ink">{candidates.length}</p>
          </div>
          <div>
            <p className="font-mono text-label uppercase text-slate">Ready to import</p>
            <p className="font-display text-h3 text-ink">{readyCount}</p>
          </div>
          <div>
            <p className="font-mono text-label uppercase text-slate">Need review</p>
            <p className="font-display text-h3 text-ink">{needsReviewCount}</p>
          </div>
          <div>
            <p className="font-mono text-label uppercase text-slate">Possible duplicates</p>
            <p className="font-display text-h3 text-ink">{duplicateCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[14px] border border-line bg-paper">
        <table className="w-full min-w-[1100px] text-left text-small">
          <thead>
            <tr className="border-b border-line">
              <th className="w-10 px-3 py-3" />
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Project</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Client</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Sector</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Location</th>
              <th className="w-20 px-3 py-3 font-mono text-label uppercase text-slate">Year</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Service</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Company</th>
              <th className="px-3 py-3 font-mono text-label uppercase text-slate">Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((row) => {
              const valid = isRowValid(row);
              return (
                <tr key={row.key} className="border-b border-line align-top last:border-0">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      disabled={!valid}
                      onChange={(e) => updateRow(row.key, { selected: e.target.checked })}
                      aria-label={`Pilih ${row.project_name || 'proyek ini'}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={row.project_name}
                      onChange={(e) => updateRow(row.key, { project_name: e.target.value })}
                      className={inputClass}
                      placeholder="Nama proyek"
                    />
                    {row.source_page ? (
                      <p className="mt-1 text-label text-slate">Hal. {row.source_page}</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={row.client}
                      onChange={(e) => updateRow(row.key, { client: e.target.value })}
                      className={inputClass}
                      placeholder="Klien"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={row.sector}
                      onChange={(e) => updateRow(row.key, { sector: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">— Perlu ditinjau —</option>
                      {SECTOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={row.location}
                      onChange={(e) => updateRow(row.key, { location: e.target.value })}
                      className={inputClass}
                      placeholder="Lokasi"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={row.year}
                      onChange={(e) => updateRow(row.key, { year: e.target.value.replace(/[^0-9]/g, '') })}
                      className={inputClass}
                      placeholder="—"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      value={row.service}
                      onChange={(e) => updateRow(row.key, { service: e.target.value })}
                      className={inputClass}
                      placeholder="—"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={row.brand}
                      onChange={(e) => updateRow(row.key, { brand: e.target.value })}
                      className={inputClass}
                    >
                      {COMPANY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <p className={`flex items-center gap-1 font-mono text-label uppercase ${CONFIDENCE_CLASS[row.confidence]}`}>
                      {CONFIDENCE_LABEL[row.confidence]}
                    </p>
                    {needsReview(row) ? (
                      <p className="mt-1 flex items-center gap-1 text-label text-amber-600">
                        <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                        Perlu ditinjau
                      </p>
                    ) : null}
                    {row.possibleDuplicateOf ? (
                      <p className="mt-1 text-label text-amber-600" title={row.possibleDuplicateOf.title}>
                        Possible duplicate
                      </p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-small text-slate">
        <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
        Sumber: {sourceDocument?.split('/').pop()}
      </p>
    </div>
  );
}

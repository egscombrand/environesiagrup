'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  importNewsAction,
  previewNewsImportAction,
  type NewsPreviewResult,
} from '@/app/wp-admin/(protected)/content/siaran-pers/import/actions';
import { validateSpreadsheetFile, type NewsPreviewItem, type NewsRowStatus } from '@/lib/admin/news-import';
import { useToast } from './toast-provider';
import { runThumbnailBatch, type ThumbnailProgress } from './thumbnail-batch';

type Preview = Extract<NewsPreviewResult, { ok: true }>;
type Step = 'select' | 'uploading' | 'preview' | 'importing' | 'done';

const STATUS_LABEL: Record<NewsRowStatus, string> = {
  ready: 'Siap',
  need_review: 'Need Review',
  duplicate: 'Possible Duplicate',
  error: 'Error',
};

const STATUS_STYLE: Record<NewsRowStatus, string> = {
  ready: 'border-success/30 text-success',
  need_review: 'border-amber-500/40 text-amber-700',
  duplicate: 'border-slate/30 text-slate',
  error: 'border-danger/30 text-danger',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
}

export function NewsImportWizard() {
  const toast = useToast();
  const [step, setStep] = useState<Step>('select');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [storagePath, setStoragePath] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<{ imported: number; failed: number } | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailProgress | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const validation = validateSpreadsheetFile(file.name);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    setStep('uploading');
    setFileName(file.name);
    // The file goes straight to Supabase Storage from the browser, so the
    // spreadsheet never travels through a Server Action payload.
    const path = `news-imports/${Date.now()}-${safeFileName(file.name)}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
      contentType: validation.contentType,
      upsert: false,
    });
    if (uploadError) {
      setError(`Gagal mengunggah file: ${uploadError.message}`);
      setStep('select');
      return;
    }

    setStoragePath(path);
    const result = await previewNewsImportAction(path, file.name);
    if (!result.ok) {
      setError(result.error);
      setStep('select');
      return;
    }
    setPreview(result);
    setStep('preview');
  }

  async function handleImport() {
    setStep('importing');
    const result = await importNewsAction(storagePath, fileName);
    if (!result.ok) {
      toast('error', result.error);
      setStep('preview');
      return;
    }
    setResult({ imported: result.imported, failed: result.failed });
    toast('success', `${result.imported} berita berhasil diimport.`);
    setStep('done');

    // Thumbnails come from each article's own link, so the lookup runs right
    // after the rows are saved. A failed lookup never undoes an import.
    try {
      setThumbnails(await runThumbnailBatch(setThumbnails));
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Gagal mengambil thumbnail.');
    }
  }

  function reset() {
    setStep('select');
    setError(null);
    setPreview(null);
    setResult(null);
    setFileName('');
    setStoragePath('');
  }

  if (step === 'select' || step === 'uploading') {
    return (
      <div className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-line bg-paper px-6 py-12 text-center hover:border-forest/40">
          {step === 'uploading' ? (
            <Loader2 className="h-6 w-6 animate-spin text-forest" aria-hidden="true" />
          ) : (
            <Upload className="h-6 w-6 text-slate" aria-hidden="true" />
          )}
          <span className="text-small text-ink">
            {step === 'uploading' ? `Mengunggah dan membaca ${fileName}…` : 'Pilih file Excel (.xlsx, .xls) atau CSV (.csv)'}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            disabled={step === 'uploading'}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
        </label>

        {error ? <p className="text-small text-danger">{error}</p> : null}

        <div className="rounded-[14px] border border-line bg-paper p-5 text-small text-slate">
          <p className="font-medium text-ink">Kolom yang dibaca dari baris pertama file</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <span className="text-ink">Judul Press Release</span> — wajib. Baris tanpa judul tidak diimport.
            </li>
            <li>
              <span className="text-ink">Owner</span>, <span className="text-ink">Media</span>, <span className="text-ink">Tanggal Rilis</span>,{' '}
              <span className="text-ink">Link Berita</span> — opsional. Data yang kosong tetap diimport dan ditandai Need Review.
            </li>
          </ul>
          <p className="mt-3">
            Format tanggal yang dibaca: 8/5/2024, 08/05/2024, 2024-05-08, May 8, 2024. File .xls dapat diunggah, tetapi
            pembacaannya belum tersedia — simpan sebagai .xlsx.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'done' && result) {
    return (
      <div className="rounded-[14px] border border-line bg-paper p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-success" aria-hidden="true" />
        <p className="mt-3 font-display text-h3 text-ink">{result.imported} berita berhasil diimport.</p>
        {result.failed > 0 ? (
          <p className="mt-1 text-small text-danger">{result.failed} baris gagal disimpan — periksa file dan coba lagi.</p>
        ) : null}
        {thumbnails ? (
          <p className="mt-2 text-small text-slate">
            {thumbnails.remaining > 0
              ? `Mengambil thumbnail… ${thumbnails.found} ditemukan, ${thumbnails.remaining} tersisa`
              : `Thumbnail: ${thumbnails.processed} diproses · ${thumbnails.found} ditemukan · ${thumbnails.unavailable} masih tidak tersedia · ${thumbnails.failed} gagal`}
          </p>
        ) : (
          <p className="mt-2 text-small text-slate">Mengambil thumbnail dari link berita…</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/wp-admin/content/siaran-pers"
            className="rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
          >
            Lihat Daftar Berita
          </Link>
          <button type="button" onClick={reset} className="rounded-[10px] border border-line px-4 py-2 text-small text-ink">
            Import file lain
          </button>
        </div>
      </div>
    );
  }

  if (!preview) return null;
  const { summary } = preview;
  const importCount = summary.ready + summary.needReview;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-line bg-paper p-4">
        <FileSpreadsheet className="h-5 w-5 text-forest" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium text-ink">{preview.fileName}</p>
          <p className="text-small text-slate">Ditemukan {summary.found} berita</p>
        </div>
        <button type="button" onClick={reset} className="text-small text-slate hover:text-ink">
          Ganti file
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Siap diimport" value={summary.ready} />
        <SummaryCard label="Need Review" value={summary.needReview} />
        <SummaryCard label="Possible Duplicate" value={summary.duplicates} hint="Tidak diimport otomatis" />
        <SummaryCard label="Error" value={summary.errors} hint="Judul kosong" />
      </div>

      <p className="text-small text-slate">
        Kolom terdeteksi: Judul
        {preview.columns.owner ? ', Owner' : ''}
        {preview.columns.media ? ', Media' : ''}
        {preview.columns.published_at ? ', Tanggal Rilis' : ''}
        {preview.columns.source_url ? ', Link Berita' : ''}. Menampilkan {preview.sample.length} baris pertama sebagai pratinjau.
      </p>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-small">
          <thead>
            <tr className="border-b border-line font-mono text-label uppercase text-slate">
              <th className="px-4 py-3">Judul Press Release</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Media</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {preview.sample.map((item) => (
              <PreviewRow key={item.rowNumber} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-[14px] border border-line bg-paper p-4 sm:flex-row sm:items-center">
        <p className="text-small text-ink">
          <span className="font-medium">{importCount} data siap diimport</span>
          <span className="text-slate"> · possible duplicate tidak ikut diimport</span>
        </p>
        <button
          type="button"
          onClick={handleImport}
          disabled={importCount === 0 || step === 'importing'}
          className="inline-flex items-center gap-2 rounded-[10px] bg-forest px-5 py-2.5 text-small font-medium text-paper hover:opacity-90 disabled:opacity-40"
        >
          {step === 'importing' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {step === 'importing' ? 'Mengimpor…' : 'Import Semua Data Baru'}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-paper p-4">
      <p className="font-mono text-label uppercase text-slate">{label}</p>
      <p className="mt-2 font-display text-h3 text-ink">{value}</p>
      {hint ? <p className="mt-1 text-label text-slate">{hint}</p> : null}
    </div>
  );
}

function PreviewRow({ item }: { item: NewsPreviewItem }) {
  return (
    <tr className="border-b border-line last:border-0 align-top">
      <td className="max-w-[280px] px-4 py-3 text-ink">{item.title || <span className="text-slate">—</span>}</td>
      <td className="px-4 py-3 text-ink">{item.owner ?? <span className="text-slate">—</span>}</td>
      <td className="px-4 py-3 text-ink">{item.media ?? <span className="text-slate">—</span>}</td>
      <td className="whitespace-nowrap px-4 py-3 text-ink">{formatDate(item.published_at)}</td>
      <td className="px-4 py-3">
        {item.source_url && /^https?:\/\//i.test(item.source_url) ? (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest underline-offset-4 hover:underline"
          >
            Lihat berita
          </a>
        ) : (
          <span className="text-slate">{item.source_url ?? '—'}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-label font-medium ${STATUS_STYLE[item.status]}`}>
          {STATUS_LABEL[item.status]}
        </span>
        {item.issues.length > 0 ? <p className="mt-1 max-w-[220px] text-label text-slate">{item.issues.join(' ')}</p> : null}
      </td>
    </tr>
  );
}

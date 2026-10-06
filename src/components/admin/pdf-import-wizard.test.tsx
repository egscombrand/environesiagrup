import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PdfImportWizard } from './pdf-import-wizard';
import { ToastProvider } from './toast-provider';
import type { ReviewCandidate } from '@/app/wp-admin/(protected)/content/projects/import/actions';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const startImportAction = vi.fn();
const saveImportChunkAction = vi.fn();
const completeImportAction = vi.fn();
const cancelImportAction = vi.fn();

vi.mock('@/app/wp-admin/(protected)/content/projects/import/actions', () => ({
  startImportAction: (...args: unknown[]) => startImportAction(...args),
  saveImportChunkAction: (...args: unknown[]) => saveImportChunkAction(...args),
  completeImportAction: (...args: unknown[]) => completeImportAction(...args),
  cancelImportAction: (...args: unknown[]) => cancelImportAction(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderWizard() {
  return render(
    <ToastProvider>
      <PdfImportWizard />
    </ToastProvider>
  );
}

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

async function uploadAndReachReview(candidates: ReviewCandidate[]) {
  startImportAction.mockResolvedValueOnce({
    ok: true,
    batchId: 'batch-1',
    sourceDocument: 'project-imports/test.pdf',
    candidates,
  });

  const user = userEvent.setup();
  renderWizard();

  const file = new File(['%PDF-1.4'], 'portfolio.pdf', { type: 'application/pdf' });
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  await user.upload(input, file);

  await waitFor(() => expect(screen.getByText(/project ditemukan/)).toBeInTheDocument());
  return user;
}

describe('PdfImportWizard — bulk selection', () => {
  it('starts with a clean, high-confidence row pre-selected and shows the real selected count', async () => {
    await uploadAndReachReview([candidate()]);
    expect(screen.getByText('1 project ditemukan · 1 project dipilih')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import Semua sebagai Draft' })).toBeInTheDocument();
  });

  it('"Pilih Semua" selects every row, including ones that need review and possible duplicates', async () => {
    const user = await uploadAndReachReview([
      candidate({ project_name: 'Proyek Lengkap' }),
      candidate({ project_name: 'Proyek Belum Lengkap', client: null, location: null, confidence: 'low' }),
      candidate({ project_name: 'Proyek Duplikat', possibleDuplicateOf: { id: 'x', title: 'Existing' } }),
    ]);

    // Only the clean row is pre-selected initially.
    expect(screen.getByText('3 project ditemukan · 1 project dipilih')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Pilih Semua' }));

    expect(screen.getByText('3 project ditemukan · 3 project dipilih')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import Semua sebagai Draft' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Pilih Proyek Belum Lengkap' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Pilih Proyek Duplikat' })).toBeChecked();
  });

  it('unchecking "Pilih Semua" after selecting all deselects every row', async () => {
    // Starts genuinely partial — "B" needs review, so it is not
    // pre-selected — so the first click on "Pilih Semua" really does go
    // to "select all" (not toggle off an already-fully-selected state).
    const user = await uploadAndReachReview([
      candidate({ project_name: 'A' }),
      candidate({ project_name: 'B', confidence: 'low' }),
    ]);

    const selectAll = screen.getByRole('checkbox', { name: 'Pilih Semua' });
    await user.click(selectAll); // select all
    expect(screen.getByText('2 project ditemukan · 2 project dipilih')).toBeInTheDocument();

    await user.click(selectAll); // deselect all
    expect(screen.getByText('2 project ditemukan · 0 project dipilih')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import/ })).toBeDisabled();
  });

  it('shows "Import N Project sebagai Draft" (not "Semua") for a partial selection', async () => {
    const user = await uploadAndReachReview([
      candidate({ project_name: 'A' }),
      candidate({ project_name: 'B', confidence: 'low' }),
    ]);

    // "B" starts unselected (low confidence); only "A" is selected.
    expect(screen.getByRole('button', { name: 'Import 1 Project sebagai Draft' })).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Pilih B' }));
    expect(screen.getByRole('button', { name: 'Import Semua sebagai Draft' })).toBeInTheDocument();
  });

  it('an individual checkbox still allows a partial import without using "Pilih Semua"', async () => {
    const user = await uploadAndReachReview([candidate({ project_name: 'A' }), candidate({ project_name: 'B' })]);

    await user.click(screen.getByRole('checkbox', { name: 'Pilih B' }));
    expect(screen.getByText('2 project ditemukan · 1 project dipilih')).toBeInTheDocument();

    const within1 = within(screen.getByRole('checkbox', { name: 'Pilih A' }).closest('tr') as HTMLElement);
    expect(within1.getByRole('checkbox')).toBeChecked();
  });
});

describe('PdfImportWizard — bulk import with real progress', () => {
  it('imports everything in one click, shows real chunked progress, and never asks for per-row confirmation', async () => {
    const candidates = Array.from({ length: 3 }, (_, i) => candidate({ project_name: `Proyek ${i + 1}` }));
    const user = await uploadAndReachReview(candidates);

    saveImportChunkAction.mockResolvedValueOnce({ ok: true, savedCount: 3 });
    completeImportAction.mockResolvedValueOnce({ ok: true });

    await user.click(screen.getByRole('button', { name: 'Import Semua sebagai Draft' }));

    await waitFor(() => expect(screen.getByText('3 proyek berhasil diimport sebagai Draft')).toBeInTheDocument());

    // One chunk call for 3 rows (well under the chunk size), one completion
    // call with the real saved count — never a per-row confirmation/call.
    expect(saveImportChunkAction).toHaveBeenCalledTimes(1);
    expect(saveImportChunkAction).toHaveBeenCalledWith('batch-1', 'project-imports/test.pdf', expect.arrayContaining([
      expect.objectContaining({ project_name: 'Proyek 1' }),
    ]));
    expect(completeImportAction).toHaveBeenCalledWith('batch-1', 3);
  });

  it('splits a large selection into multiple chunk calls and reports the real cumulative saved count', async () => {
    const candidates = Array.from({ length: 30 }, (_, i) => candidate({ project_name: `Proyek ${i + 1}` }));
    const user = await uploadAndReachReview(candidates);

    saveImportChunkAction.mockResolvedValueOnce({ ok: true, savedCount: 25 });
    saveImportChunkAction.mockResolvedValueOnce({ ok: true, savedCount: 5 });
    completeImportAction.mockResolvedValueOnce({ ok: true });

    await user.click(screen.getByRole('button', { name: 'Import Semua sebagai Draft' }));

    await waitFor(() => expect(screen.getByText('30 proyek berhasil diimport sebagai Draft')).toBeInTheDocument());

    expect(saveImportChunkAction).toHaveBeenCalledTimes(2);
    expect(completeImportAction).toHaveBeenCalledWith('batch-1', 30);
  });
});

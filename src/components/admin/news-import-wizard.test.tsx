import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsImportWizard } from './news-import-wizard';
import { ToastProvider } from './toast-provider';

const previewNewsImportAction = vi.fn();
const importNewsAction = vi.fn();

vi.mock('@/app/wp-admin/(protected)/content/siaran-pers/import/actions', () => ({
  previewNewsImportAction: (...args: unknown[]) => previewNewsImportAction(...args),
  importNewsAction: (...args: unknown[]) => importNewsAction(...args),
}));

const upload = vi.fn().mockResolvedValue({ error: null });
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ storage: { from: () => ({ upload }) } }),
}));

vi.mock('@/app/wp-admin/(protected)/content/siaran-pers/thumbnails/actions', () => ({
  processPendingThumbnailsAction: vi.fn().mockResolvedValue({ ok: true, processed: 0, found: 0, notFound: 0, remaining: 0 }),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

beforeEach(() => {
  vi.clearAllMocks();
  upload.mockResolvedValue({ error: null });
});

function renderWizard() {
  return render(
    <ToastProvider>
      <NewsImportWizard />
    </ToastProvider>
  );
}

describe('NewsImportWizard', () => {
  it('accepts .xls for upload with its own content type, and explains that reading it needs a .xlsx copy', async () => {
    previewNewsImportAction.mockResolvedValueOnce({
      ok: false,
      error: 'File .xls belum dapat dibaca oleh importer ini. Simpan ulang file sebagai .xlsx atau .csv, lalu unggah kembali.',
    });
    const user = userEvent.setup();
    renderWizard();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(['x'], 'lama.xls', { type: 'application/octet-stream' }));

    expect(await screen.findByText(/File \.xls belum dapat dibaca/)).toBeInTheDocument();
    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^news-imports\/\d+-lama\.xls$/),
      expect.any(File),
      expect.objectContaining({ contentType: 'application/vnd.ms-excel' })
    );
  });

  it('rejects files that are not spreadsheets before anything is uploaded', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderWizard();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(['x'], 'foto.png', { type: 'image/png' }));

    expect(await screen.findByText('Hanya file .xlsx, .xls, atau .csv yang didukung.')).toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });

  it('stores an .xlsx with the Excel MIME type even when the browser sends an empty type', async () => {
    previewNewsImportAction.mockResolvedValueOnce({
      ok: true,
      fileName: 'berita.xlsx',
      columns: { title: true, owner: true, media: true, published_at: true, source_url: true },
      summary: { found: 0, ready: 0, needReview: 0, duplicates: 0, errors: 0 },
      sample: [],
    });
    const user = userEvent.setup();
    renderWizard();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(['x'], 'berita.xlsx', { type: '' }));

    await waitFor(() =>
      expect(upload).toHaveBeenCalledWith(
        expect.stringMatching(/\.xlsx$/),
        expect.any(File),
        expect.objectContaining({
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )
    );
  });

  it('uploads a CSV, shows the real preview counts, and imports every new row in one click', async () => {
    previewNewsImportAction.mockResolvedValueOnce({
      ok: true,
      fileName: 'berita.csv',
      columns: { title: true, owner: true, media: true, published_at: true, source_url: true },
      summary: { found: 3, ready: 1, needReview: 1, duplicates: 1, errors: 0 },
      sample: [
        { rowNumber: 2, title: 'Greenlab Rilis', owner: 'GreenLab', media: 'Beritasatu.com', published_at: '2024-05-08', source_url: 'https://www.beritasatu.com/a', status: 'ready', issues: [] },
      ],
    });
    importNewsAction.mockResolvedValueOnce({ ok: true, imported: 2, failed: 0 });

    const user = userEvent.setup();
    renderWizard();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(['Judul Press Release\nGreenlab Rilis'], 'berita.csv', { type: 'text/csv' }));

    expect(await screen.findByText('Ditemukan 3 berita')).toBeInTheDocument();
    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^news-imports\/\d+-berita\.csv$/),
      expect.any(File),
      expect.objectContaining({ contentType: 'text/csv' })
    );
    expect(screen.getByText('2 data siap diimport')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Import Semua Data Baru' }));

    await waitFor(() => expect(screen.getAllByText('2 berita berhasil diimport.').length).toBeGreaterThan(0));
    expect(importNewsAction).toHaveBeenCalledTimes(1);
  });
});

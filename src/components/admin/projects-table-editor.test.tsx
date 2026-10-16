import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectsTableEditor } from './projects-table-editor';
import { ToastProvider } from './toast-provider';
import type { ProjectEditorRow } from './projects-table-editor-logic';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const updateProjectTitleAction = vi.fn();
const updateProjectTextFieldAction = vi.fn();
const updateProjectYearAction = vi.fn();
const updateProjectStatusAction = vi.fn();
const bulkSetStatusAction = vi.fn();
const bulkSetTextFieldAction = vi.fn();
const bulkDeleteAction = vi.fn();

vi.mock('@/app/wp-admin/(protected)/content/projects/table-actions', () => ({
  updateProjectTitleAction: (...args: unknown[]) => updateProjectTitleAction(...args),
  updateProjectTextFieldAction: (...args: unknown[]) => updateProjectTextFieldAction(...args),
  updateProjectYearAction: (...args: unknown[]) => updateProjectYearAction(...args),
  updateProjectStatusAction: (...args: unknown[]) => updateProjectStatusAction(...args),
  bulkSetStatusAction: (...args: unknown[]) => bulkSetStatusAction(...args),
  bulkSetTextFieldAction: (...args: unknown[]) => bulkSetTextFieldAction(...args),
  bulkDeleteAction: (...args: unknown[]) => bulkDeleteAction(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  updateProjectTitleAction.mockResolvedValue({ ok: true });
  updateProjectTextFieldAction.mockResolvedValue({ ok: true });
  updateProjectYearAction.mockResolvedValue({ ok: true });
  updateProjectStatusAction.mockResolvedValue({ ok: true });
  bulkSetStatusAction.mockResolvedValue({ ok: true, count: 0 });
  bulkSetTextFieldAction.mockResolvedValue({ ok: true, count: 0 });
  bulkDeleteAction.mockResolvedValue({ ok: true, count: 0 });
});

function row(overrides: Partial<ProjectEditorRow> = {}): ProjectEditorRow {
  return {
    id: 'p1',
    title: 'Kajian Lingkungan A',
    client: 'PT Contoh',
    sector: 'Industri',
    city: 'Jawa Barat',
    year: 2022,
    services: 'AMDAL',
    company: 'Environesia',
    status: 'draft',
    ...overrides,
  };
}

function renderEditor(rows: ProjectEditorRow[], canWrite = true) {
  return render(
    <ToastProvider>
      <ProjectsTableEditor rows={rows} canWrite={canWrite} />
    </ToastProvider>
  );
}

describe('ProjectsTableEditor — inline editing', () => {
  it('autosaves a title edit on blur and shows a saved indicator', async () => {
    const user = userEvent.setup();
    renderEditor([row()]);

    const input = screen.getByLabelText('Nama proyek: Kajian Lingkungan A');
    await user.clear(input);
    await user.type(input, 'Kajian Lingkungan Baru');
    await user.tab();

    await waitFor(() => expect(updateProjectTitleAction).toHaveBeenCalledWith('p1', 'Kajian Lingkungan Baru'));
  });

  it('never saves an empty title — reverts to the last known value instead', async () => {
    const user = userEvent.setup();
    renderEditor([row()]);

    const input = screen.getByLabelText('Nama proyek: Kajian Lingkungan A');
    await user.clear(input);
    await user.tab();

    expect(updateProjectTitleAction).not.toHaveBeenCalled();
    expect(input).toHaveValue('Kajian Lingkungan A');
  });

  it('saves a combobox field (Sektor) with a free-text value not in the predefined list', async () => {
    const user = userEvent.setup();
    renderEditor([row()]);

    const input = screen.getByLabelText('sector untuk Kajian Lingkungan A');
    await user.clear(input);
    await user.type(input, 'Sektor Baru Yang Belum Ada');
    await user.tab();

    await waitFor(() =>
      expect(updateProjectTextFieldAction).toHaveBeenCalledWith('p1', 'sector', 'Sektor Baru Yang Belum Ada')
    );
  });

  it('shows an error toast and keeps the row unchanged when a save fails', async () => {
    updateProjectTitleAction.mockResolvedValueOnce({ ok: false, error: 'Gagal menyimpan ke server.' });
    const user = userEvent.setup();
    renderEditor([row()]);

    const input = screen.getByLabelText('Nama proyek: Kajian Lingkungan A');
    await user.clear(input);
    await user.type(input, 'Percobaan Gagal');
    await user.tab();

    await waitFor(() => expect(screen.getByText('Gagal menyimpan ke server.')).toBeInTheDocument());
  });
});

describe('ProjectsTableEditor — search and filters', () => {
  it('filters rows by the search box across title/client/city', async () => {
    const user = userEvent.setup();
    renderEditor([row(), row({ id: 'p2', title: 'Proyek Lain', client: 'PT Beda', city: 'Surabaya' })]);

    await user.type(screen.getByPlaceholderText(/Cari nama proyek/), 'Surabaya');

    expect(screen.queryByLabelText('Nama proyek: Kajian Lingkungan A')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nama proyek: Proyek Lain')).toBeInTheDocument();
  });
});

describe('ProjectsTableEditor — bulk selection and actions', () => {
  it('"Pilih Semua" selects every currently filtered row and shows a live count', async () => {
    const user = userEvent.setup();
    renderEditor([row(), row({ id: 'p2', title: 'Proyek Lain' })]);

    await user.click(screen.getByRole('checkbox', { name: 'Pilih Semua' }));

    expect(screen.getByText('2 project · 2 dipilih')).toBeInTheDocument();
  });

  it('bulk-publishes every selected row without a per-row confirmation', async () => {
    bulkSetStatusAction.mockResolvedValueOnce({ ok: true, count: 2 });
    const user = userEvent.setup();
    renderEditor([row(), row({ id: 'p2', title: 'Proyek Lain' })]);

    await user.click(screen.getByRole('checkbox', { name: 'Pilih Semua' }));
    await user.click(screen.getByRole('button', { name: /Ubah Status/ }));
    await user.click(screen.getByRole('button', { name: 'Terapkan' }));

    await waitFor(() => expect(bulkSetStatusAction).toHaveBeenCalledWith(['p1', 'p2'], 'published'));
  });

  it('bulk "Ubah Sektor" asks for confirmation before overwriting every selected row', async () => {
    bulkSetTextFieldAction.mockResolvedValueOnce({ ok: true, count: 1 });
    const user = userEvent.setup();
    renderEditor([row()]);

    await user.click(screen.getByRole('checkbox', { name: 'Pilih Kajian Lingkungan A' }));
    await user.click(screen.getByRole('button', { name: 'Ubah Sektor' }));

    const popoverInput = screen.getByLabelText('Ubah Sektor');
    await user.type(popoverInput, 'Rumah Sakit');
    await user.click(screen.getByRole('button', { name: 'Terapkan' }));

    // Confirmation dialog appears — the bulk action must NOT fire yet.
    expect(bulkSetTextFieldAction).not.toHaveBeenCalled();
    expect(screen.getByText(/Ubah Sektor 1 project\?/)).toBeInTheDocument();

    const dialog = screen.getByRole('dialog', { hidden: true });
    await user.click(within(dialog).getByRole('button', { name: 'Terapkan' }));

    await waitFor(() => expect(bulkSetTextFieldAction).toHaveBeenCalledWith(['p1'], 'sector', 'Rumah Sakit'));
  });

  it('bulk delete requires confirmation and removes the rows locally on success', async () => {
    bulkDeleteAction.mockResolvedValueOnce({ ok: true, count: 1 });
    const user = userEvent.setup();
    renderEditor([row(), row({ id: 'p2', title: 'Proyek Lain' })]);

    await user.click(screen.getByRole('checkbox', { name: 'Pilih Kajian Lingkungan A' }));
    await user.click(screen.getByRole('button', { name: 'Hapus' }));

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(within(dialog).getByText('Hapus 1 project?')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Hapus' }));

    await waitFor(() => expect(bulkDeleteAction).toHaveBeenCalledWith(['p1']));
    await waitFor(() => expect(screen.queryByLabelText('Nama proyek: Kajian Lingkungan A')).not.toBeInTheDocument());
  });
});

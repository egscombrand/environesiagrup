import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteButton } from './delete-button';
import { ToastProvider } from './toast-provider';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh, push: vi.fn() }),
}));

beforeEach(() => {
  refresh.mockClear();
});

/**
 * Renders DeleteButton exactly as every real call site does: nested inside
 * a clickable row/card. `onRowClick` stands in for that row's own handler
 * (e.g. one that opens a Detail view) — it must never fire from anything
 * that happens inside DeleteButton, at any step.
 */
function renderInsideClickableRow(action: () => Promise<{ error?: string } | void>, onRowClick: () => void) {
  return render(
    <ToastProvider>
      <div onClick={onRowClick} data-testid="row">
        <DeleteButton action={action} itemLabel="Item Contoh" iconOnly />
      </div>
    </ToastProvider>
  );
}

describe('DeleteButton inside a clickable row/card', () => {
  it('clicking the trash icon opens the confirm dialog and never fires the row’s own click handler', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderInsideClickableRow(vi.fn().mockResolvedValue({}), onRowClick);

    await user.click(screen.getByRole('button', { name: /hapus/i }));

    expect(screen.getByRole('heading', { name: 'Hapus Data?' })).toBeInTheDocument();
    expect(
      screen.getByText('Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.')
    ).toBeInTheDocument();
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('clicking "Batal" closes the dialog, runs no action, and still never reaches the row’s click handler', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({});
    const onRowClick = vi.fn();
    renderInsideClickableRow(action, onRowClick);

    await user.click(screen.getByRole('button', { name: /hapus/i }));
    await user.click(screen.getByRole('button', { name: 'Batal' }));

    expect(screen.queryByRole('heading', { name: 'Hapus Data?' })).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('clicking "Ya, Hapus" runs the delete action, closes the dialog, refreshes the list, and never reaches the row’s click handler', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({});
    const onRowClick = vi.fn();
    renderInsideClickableRow(action, onRowClick);

    await user.click(screen.getByRole('button', { name: /hapus/i }));
    await user.click(screen.getByRole('button', { name: 'Ya, Hapus' }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Berhasil dihapus.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Hapus Data?' })).not.toBeInTheDocument();
    expect(refresh).toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('shows the action’s error as a toast, keeps the dialog state consistent, and still deletes nothing', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ error: 'Gagal menghapus.' });
    const onRowClick = vi.fn();
    renderInsideClickableRow(action, onRowClick);

    await user.click(screen.getByRole('button', { name: /hapus/i }));
    await user.click(screen.getByRole('button', { name: 'Ya, Hapus' }));

    expect(await screen.findByText('Gagal menghapus.')).toBeInTheDocument();
    expect(refresh).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
  });
});

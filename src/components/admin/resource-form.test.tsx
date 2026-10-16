import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResourceForm } from './resource-form';
import { ToastProvider } from './toast-provider';
import type { FieldConfig } from '@/lib/admin/resources/types';

const push = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

// ResourceForm renders ImageUploadField/IconPicker for other field types,
// which import the browser Supabase client — not exercised by these tests
// (no 'image'/'icon' field is used here), but it still needs a stub so the
// module loads without real env vars.
vi.mock('@/lib/supabase/client', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

const FIELDS: FieldConfig[] = [
  { name: 'title', label: 'Judul', type: 'text', required: true, section: 'Basic Information' },
  { name: 'notes', label: 'Catatan', type: 'textarea', section: 'Basic Information' },
];

function renderForm(action = vi.fn().mockResolvedValue({})) {
  render(
    <ToastProvider>
      <ResourceForm fields={FIELDS} initialValues={{}} action={action} cancelHref="/wp-admin/content/test" />
    </ToastProvider>
  );
  return action;
}

describe('ResourceForm required-field validation', () => {
  it('blocks Save, toasts, and lists only the empty required fields when one is missing', async () => {
    const user = userEvent.setup();
    const action = renderForm();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(action).not.toHaveBeenCalled();
    expect(await screen.findByText('Mohon lengkapi field yang wajib diisi.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Data Belum Lengkap' })).toBeInTheDocument();
    expect(screen.getByText('Silakan lengkapi field berikut sebelum menyimpan:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Judul/ })).toBeInTheDocument();
    // "Catatan" is optional — it must never show up as something to fix.
    expect(screen.queryByRole('button', { name: /Catatan/ })).not.toBeInTheDocument();
  });

  it('shows an inline error on the empty required field, which clears the moment it is filled', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Field ini wajib diisi.')).toBeInTheDocument();

    const titleInput = screen.getByRole('textbox', { name: /Judul/ });
    await user.type(titleInput, 'Judul contoh');

    expect(screen.queryByText('Field ini wajib diisi.')).not.toBeInTheDocument();
  });

  it('clicking the field in "Data Belum Lengkap" closes the modal and focuses that field', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: /Judul/ }));

    expect(screen.queryByRole('heading', { name: 'Data Belum Lengkap' })).not.toBeInTheDocument();
    const titleInput = screen.getByRole('textbox', { name: /Judul/ });
    await waitFor(() => expect(document.activeElement).toBe(titleInput));
  });

  it('never flags or blocks on an optional field left empty', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({});
    renderForm(action);

    const titleInput = screen.getByRole('textbox', { name: /Judul/ });
    await user.type(titleInput, 'Judul contoh');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Only the required field had to be filled — "notes" stayed empty and that's fine.
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { name: 'Data Belum Lengkap' })).not.toBeInTheDocument();
  });

  it('once every required field is filled, Save runs the action and toasts the fixed success message', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({});
    renderForm(action);

    await user.type(screen.getByRole('textbox', { name: /Judul/ }), 'Judul contoh');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Data berhasil disimpan.')).toBeInTheDocument();
    expect(refresh).toHaveBeenCalled();
  });
});

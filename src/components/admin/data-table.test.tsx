import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type TableRow } from './data-table';
import { ToastProvider } from './toast-provider';
import type { ColumnConfig } from '@/lib/admin/resources/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

function renderTable(props: Parameters<typeof DataTable>[0]) {
  return render(
    <ToastProvider>
      <DataTable {...props} />
    </ToastProvider>
  );
}

const COLUMNS: ColumnConfig[] = [
  { key: 'title', label: 'Nama Proyek' },
  { key: 'sector', label: 'Sektor' },
  { key: 'company', label: 'Perusahaan' },
  { key: 'status', label: 'Status', kind: 'status' },
];

function makeRow(overrides: Partial<TableRow['values']> & { id: string }): TableRow {
  const { id, ...values } = overrides;
  return {
    id,
    values: { status: 'published', ...values },
    editHref: `/wp-admin/content/projects/${id}`,
    onDelete: async () => {},
  };
}

const ROWS: TableRow[] = [
  makeRow({ id: '1', title: 'Kajian AMDAL Pelabuhan', sector: 'Transportasi', company: 'GreenLab' }),
  makeRow({ id: '2', title: 'Audit Lingkungan RS', sector: 'Rumah Sakit', company: 'Environesia Consultant' }),
  makeRow({ id: '3', title: 'Pengelolaan Limbah B3', sector: 'Transportasi', company: 'Belum Ditentukan' }),
];

describe('DataTable extra filters (Sektor / Perusahaan style)', () => {
  it('renders one dropdown per extra filter, alongside search and status, defaulting to "show all"', () => {
    renderTable({
      columns: COLUMNS,
      rows: ROWS,
      titleField: 'title',
      filters: [
        { key: 'sector', label: 'Semua Sektor', options: [{ value: 'Transportasi', label: 'Transportasi' }, { value: 'Rumah Sakit', label: 'Rumah Sakit' }] },
        { key: 'company', label: 'Semua Perusahaan', options: [{ value: 'GreenLab', label: 'GreenLab' }] },
      ],
    });

    expect(screen.getByDisplayValue('Semua Sektor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Semua Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('Kajian AMDAL Pelabuhan')).toBeInTheDocument();
    expect(screen.getByText('Audit Lingkungan RS')).toBeInTheDocument();
    expect(screen.getByText('Pengelolaan Limbah B3')).toBeInTheDocument();
  });

  it('filters rows by a selected Sektor option without affecting unrelated rows', async () => {
    const user = userEvent.setup();
    renderTable({
      columns: COLUMNS,
      rows: ROWS,
      titleField: 'title',
      filters: [
        {
          key: 'sector',
          label: 'Semua Sektor',
          options: [
            { value: 'Transportasi', label: 'Transportasi' },
            { value: 'Rumah Sakit', label: 'Rumah Sakit' },
          ],
        },
      ],
    });

    const sectorSelect = screen.getByDisplayValue('Semua Sektor');
    await user.selectOptions(sectorSelect, 'Rumah Sakit');

    expect(screen.getByText('Audit Lingkungan RS')).toBeInTheDocument();
    expect(screen.queryByText('Kajian AMDAL Pelabuhan')).not.toBeInTheDocument();
    expect(screen.queryByText('Pengelolaan Limbah B3')).not.toBeInTheDocument();
  });

  it('combines a Sektor filter and a Perusahaan filter (both must match)', async () => {
    const user = userEvent.setup();
    renderTable({
      columns: COLUMNS,
      rows: ROWS,
      titleField: 'title',
      filters: [
        {
          key: 'sector',
          label: 'Semua Sektor',
          options: [{ value: 'Transportasi', label: 'Transportasi' }],
        },
        {
          key: 'company',
          label: 'Semua Perusahaan',
          options: [
            { value: 'GreenLab', label: 'GreenLab' },
            { value: 'Belum Ditentukan', label: 'Belum Ditentukan' },
          ],
        },
      ],
    });

    await user.selectOptions(screen.getByDisplayValue('Semua Sektor'), 'Transportasi');
    await user.selectOptions(screen.getByDisplayValue('Semua Perusahaan'), 'Belum Ditentukan');

    expect(screen.getByText('Pengelolaan Limbah B3')).toBeInTheDocument();
    expect(screen.queryByText('Kajian AMDAL Pelabuhan')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit Lingkungan RS')).not.toBeInTheDocument();
  });

  it('renders no extra filters when none are configured (existing resources unaffected)', () => {
    renderTable({ columns: COLUMNS, rows: ROWS, titleField: 'title' });

    expect(screen.queryByText('Semua Sektor')).not.toBeInTheDocument();
    expect(screen.queryByText('Semua Perusahaan')).not.toBeInTheDocument();
  });
});

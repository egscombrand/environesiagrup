import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LeadershipGrid } from './leadership-grid';
import type { LeadershipEntry } from '@/lib/content-types';

const people: LeadershipEntry[] = [
  { nama: 'Contoh Satu', jabatan: 'Direktur Utama', tipe: 'direksi', urutan: 1 },
  { nama: 'Contoh Dua', jabatan: 'Direktur Operasional', tipe: 'direksi', urutan: 2 },
];

describe('LeadershipGrid', () => {
  it('renders a card per person, ordered by urutan', () => {
    render(<LeadershipGrid people={people} emptyLabel="Belum ada data." />);

    expect(screen.getByText('Contoh Satu')).toBeInTheDocument();
    expect(screen.getByText('Direktur Operasional')).toBeInTheDocument();
  });

  it('shows the empty label instead of an empty grid when there is nobody', () => {
    render(<LeadershipGrid people={[]} emptyLabel="Belum ada data." />);

    expect(screen.getByText('Belum ada data.')).toBeInTheDocument();
    expect(screen.queryByText('Contoh Satu')).not.toBeInTheDocument();
  });
});

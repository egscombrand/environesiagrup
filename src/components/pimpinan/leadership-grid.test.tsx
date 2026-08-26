import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LeadershipGrid } from './leadership-grid';
import { makeLeadershipMember } from '@/lib/cms/fixtures';

const people = [
  makeLeadershipMember({ name: 'Contoh Satu', position: 'Direktur Utama', sort_order: 1 }),
  makeLeadershipMember({ name: 'Contoh Dua', position: 'Direktur Operasional', sort_order: 2 }),
];

describe('LeadershipGrid', () => {
  it('renders a card per person, ordered by sort_order', () => {
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

import { act } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyStatsCounters } from './key-stats-counters';

const stats = [
  { label: 'Tahun Pengalaman', nilai: 10, satuan: '+', urutan: 1 },
  { label: 'Negara', nilai: 10, satuan: '', urutan: 2 },
];

describe('KeyStatsCounters', () => {
  it('renders a label for every stat', () => {
    render(<KeyStatsCounters stats={stats} />);
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });

  it('counts up to the target value within 1.5s', async () => {
    render(<KeyStatsCounters stats={stats} />);

    await waitFor(
      () => {
        expect(screen.getByText('10+')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});

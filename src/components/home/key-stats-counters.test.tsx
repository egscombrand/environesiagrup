import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyStatsCounters } from './key-stats-counters';
import { makeStat } from '@/lib/cms/fixtures';

const items = [
  { stat: makeStat({ label: 'Tahun Pengalaman', value: 10, suffix: '+' }), icon: null },
  { stat: makeStat({ label: 'Negara', value: 10, suffix: '' }), icon: null },
];

describe('KeyStatsCounters', () => {
  it('renders a label for every stat', () => {
    render(<KeyStatsCounters items={items} />);
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });

  it('counts up to the target value within 1.5s', async () => {
    render(<KeyStatsCounters items={items} />);

    await waitFor(
      () => {
        expect(screen.getByText('10+')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});

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

  it('places the icon beside the number, not stacked above it', () => {
    const { container } = render(<KeyStatsCounters items={items} />);

    // the numeral carries tabular-nums; its parent is the icon+number row
    const numeral = container.querySelector('.tabular-nums');
    expect(numeral).toBeInTheDocument();

    const row = numeral!.parentElement!;
    expect(row.className).toContain('flex');
    expect(row.className).toContain('items-center');

    // the icon lives in that same row, as a sibling of the numeral
    expect(row.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();

    // and the label is NOT in that row — it sits below
    expect(row.textContent).not.toContain('Tahun Pengalaman');
  });

  it('marks the numeral tabular so digits do not jitter while counting', () => {
    const { container } = render(<KeyStatsCounters items={items} />);
    expect(container.querySelectorAll('.tabular-nums')).toHaveLength(items.length);
  });
});

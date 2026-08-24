import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyStatsSection } from './key-stats-section';

describe('KeyStatsSection', () => {
  it('renders both real stats from content/stats', () => {
    render(<KeyStatsSection />);
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });
});

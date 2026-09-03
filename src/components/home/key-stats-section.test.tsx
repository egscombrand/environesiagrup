import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeStat } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/stats', () => ({
  getPublishedStats: vi.fn().mockResolvedValue([
    makeStat({ label: 'Tahun Pengalaman', value: 10, suffix: '+', sort_order: 1 }),
    makeStat({ label: 'Negara', value: 10, suffix: '', sort_order: 2 }),
  ]),
}));

const { KeyStatsSection } = await import('./key-stats-section');

describe('KeyStatsSection', () => {
  it('renders both real stats', async () => {
    render(await KeyStatsSection({ locale: 'id' }));
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Negara')).toBeInTheDocument();
  });
});

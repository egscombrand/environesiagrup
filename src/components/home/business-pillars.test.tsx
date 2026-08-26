import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makePillar } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/pillars', () => ({
  getPublishedPillars: vi.fn().mockResolvedValue([
    makePillar({ name: 'Konsultasi Lingkungan', slug: 'konsultasi', sort_order: 1 }),
    makePillar({ name: 'Pengujian & Sampling', slug: 'pengujian-sampling', sort_order: 2 }),
    makePillar({ name: 'Pelatihan Kompetensi', slug: 'pelatihan-kompetensi', sort_order: 3 }),
    makePillar({ name: 'Sertifikasi Profesi', slug: 'sertifikasi-profesi', sort_order: 4 }),
  ]),
}));

const { BusinessPillars } = await import('./business-pillars');

describe('BusinessPillars', () => {
  it('renders all 4 pillars in chain order with numbered labels', async () => {
    render(await BusinessPillars());
    const order = [
      'Konsultasi Lingkungan',
      'Pengujian & Sampling',
      'Pelatihan Kompetensi',
      'Sertifikasi Profesi',
    ];
    order.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });
});

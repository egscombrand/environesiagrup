import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StandardsSection } from './standards-section';

describe('StandardsSection', () => {
  it('renders the new heading', () => {
    render(<StandardsSection locale="id" />);

    expect(
      screen.getByRole('heading', {
        name: 'Proyek Yang Berkualitas Dibangun dari Budaya Kerja Environesian Yang Berintegritas',
      })
    ).toBeInTheDocument();
  });

  it('renders all 5 principle cards, in the required order, each with its title and description', () => {
    render(<StandardsSection locale="id" />);

    const titles = ['Accuration', 'On Time!', 'Integrity', 'Caring', 'Continuous Improvement'];
    for (const title of titles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }

    // DOM order must match the required 01–05 order, not just "present
    // somewhere" — that's what actually makes the 3+2 grid land Caring
    // under Accuration and Continuous Improvement under On Time.
    const headings = screen.getAllByText(new RegExp(titles.join('|')));
    expect(headings.map((el) => el.textContent)).toEqual(titles);

    expect(
      screen.getByText(/Environesia berkomitmen untuk menyediakan Laporan Hasil Pengujian \(LHU\)/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Semangat kami dalam peningkatan dan perbaikan kualitas layanan berstandar global/)
    ).toBeInTheDocument();
  });

  it('never shows a 01–05 index number on any card', () => {
    render(<StandardsSection locale="id" />);

    for (const n of ['01', '02', '03', '04', '05']) {
      expect(screen.queryByText(n)).not.toBeInTheDocument();
    }
  });

  it('never invents a 6th principle or drops one of the 5', () => {
    render(<StandardsSection locale="id" />);
    expect(screen.getAllByText(/^(Accuration|On Time!|Integrity|Caring|Continuous Improvement)$/)).toHaveLength(5);
  });
});

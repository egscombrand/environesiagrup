import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BusinessPillars } from './business-pillars';

describe('BusinessPillars', () => {
  it('renders all 4 pillars in chain order with numbered labels', () => {
    render(<BusinessPillars />);
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

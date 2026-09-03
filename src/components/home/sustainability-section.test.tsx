import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SustainabilitySection } from './sustainability-section';

describe('SustainabilitySection', () => {
  it('renders the three E/S/G pillars with generic, non-numeric copy', async () => {
    render(await SustainabilitySection({ locale: 'id' }));
    expect(screen.getByText('Lingkungan')).toBeInTheDocument();
    expect(screen.getByText('Sosial')).toBeInTheDocument();
    expect(screen.getByText('Tata Kelola')).toBeInTheDocument();
  });

  it('never uses a "coming soon" style status label', async () => {
    render(await SustainabilitySection({ locale: 'id' }));
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/segera hadir/i)).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CountryMapSection } from './country-map-section';

describe('CountryMapSection', () => {
  it('shows the honest empty state since content/projects has no entries yet', () => {
    render(<CountryMapSection />);
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });
});

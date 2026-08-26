import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/projects', () => ({
  getPublishedProjectPins: vi.fn().mockResolvedValue([]),
}));

const { CountryMapSection } = await import('./country-map-section');

describe('CountryMapSection', () => {
  it('shows the honest empty state when there are no projects yet', async () => {
    render(await CountryMapSection({ locale: 'id' }));
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });
});

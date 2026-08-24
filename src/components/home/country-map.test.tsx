import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CountryMap } from './country-map';

describe('CountryMap', () => {
  it('renders an honest empty state when there are no pins', () => {
    render(<CountryMap pins={[]} />);
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });

  it('renders a pin per project and shows a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <CountryMap
        pins={[{ judul: 'Proyek Uji', negara: 'Negara Uji', koordinat: [106.8, -6.2] }]}
      />
    );

    const pin = screen.getByRole('button', { name: 'Proyek Uji, Negara Uji' });
    await user.hover(pin);

    expect(screen.getByText('Proyek Uji')).toBeInTheDocument();
    expect(screen.getByText('Negara Uji')).toBeInTheDocument();
  });
});

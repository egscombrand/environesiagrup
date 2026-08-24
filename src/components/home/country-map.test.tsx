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

  it('pins the tooltip open on Enter so it survives losing focus, and un-pins it on a second Enter', async () => {
    const user = userEvent.setup();
    render(
      <CountryMap
        pins={[{ judul: 'Proyek Uji', negara: 'Negara Uji', koordinat: [106.8, -6.2] }]}
      />
    );

    const pin = screen.getByRole('button', { name: 'Proyek Uji, Negara Uji' });

    await user.click(pin);
    await user.keyboard('{Enter}');
    expect(screen.getByText('Proyek Uji')).toBeInTheDocument();

    // Blur the pin: a *pinned* tooltip must survive losing focus.
    await user.click(document.body);
    expect(screen.getByText('Proyek Uji')).toBeInTheDocument();

    // Re-focus, un-pin, and blur again: without a pin the tooltip is gone.
    await user.click(pin);
    await user.keyboard('{Enter}');
    await user.click(document.body);
    expect(screen.queryByText('Proyek Uji')).not.toBeInTheDocument();
  });

  it('lets hovering a different pin override a pinned tooltip', async () => {
    const user = userEvent.setup();
    render(
      <CountryMap
        pins={[
          { judul: 'Proyek A', negara: 'Negara A', koordinat: [106.8, -6.2] },
          { judul: 'Proyek B', negara: 'Negara B', koordinat: [-58.4, -34.6] },
        ]}
      />
    );

    const pinA = screen.getByRole('button', { name: 'Proyek A, Negara A' });
    const pinB = screen.getByRole('button', { name: 'Proyek B, Negara B' });

    await user.click(pinA);
    await user.keyboard('{Enter}'); // pin A open
    expect(screen.getByText('Proyek A')).toBeInTheDocument();

    await user.hover(pinB);

    // Hovering B must win over A's pin, not keep showing A's tooltip underneath it.
    expect(screen.getByText('Proyek B')).toBeInTheDocument();
    expect(screen.queryByText('Proyek A')).not.toBeInTheDocument();

    await user.unhover(pinB);

    // Once nothing is actively hovered/focused, the pinned tooltip (A) resurfaces.
    expect(screen.getByText('Proyek A')).toBeInTheDocument();
  });
});

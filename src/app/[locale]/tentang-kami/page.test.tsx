import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TentangKamiPage from './page';

describe('TentangKamiPage', () => {
  it('renders the heading and the group summary', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Tentang Kami' })).toBeInTheDocument();
    expect(screen.getByText(/empat lini layanan lingkungan/i)).toBeInTheDocument();
  });

  it('links to every sub-page with the active locale', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('link', { name: /Sejarah/ })).toHaveAttribute(
      'href',
      '/en/tentang-kami/sejarah'
    );
    expect(screen.getByRole('link', { name: /Green Business/ })).toHaveAttribute(
      'href',
      '/en/tentang-kami/green-business'
    );
  });

  it('reports the real entity count rather than a hardcoded number', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

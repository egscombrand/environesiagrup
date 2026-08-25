import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PimpinanPage from './page';
import DireksiPage from './direksi/page';
import KomisarisPage from './komisaris/page';

const params = Promise.resolve({ locale: 'id' });

describe('Pimpinan pages', () => {
  it('renders the overview with links to both sub-pages', async () => {
    render(await PimpinanPage({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Pimpinan' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Direksi/ })).toHaveAttribute(
      'href',
      '/en/pimpinan/direksi'
    );
    expect(screen.getByRole('link', { name: /Komisaris/ })).toHaveAttribute(
      'href',
      '/en/pimpinan/komisaris'
    );
  });

  it('shows an honest empty state on the direksi page, naming no one', async () => {
    render(await DireksiPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Direksi' })).toBeInTheDocument();
    expect(screen.getByText('Profil jajaran direksi sedang disiapkan.')).toBeInTheDocument();
  });

  it('states that the commissioners board is unconfirmed rather than empty', async () => {
    render(await KomisarisPage({ params }));

    expect(
      screen.getByText('Keberadaan dewan komisaris belum dikonfirmasi.')
    ).toBeInTheDocument();
  });
});

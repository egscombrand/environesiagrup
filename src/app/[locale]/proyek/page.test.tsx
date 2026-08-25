import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProyekPage from './page';

describe('ProyekPage', () => {
  it('renders the heading and the map', async () => {
    render(await ProyekPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Proyek' })).toBeInTheDocument();
    expect(
      screen.getByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).toBeInTheDocument();
  });

  it('reports honestly that no project records exist yet', async () => {
    render(await ProyekPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('Daftar proyek sedang disiapkan.')).toBeInTheDocument();
  });
});

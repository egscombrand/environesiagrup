import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/landing/clients-adapter', () => ({
  getClientsAndPartners: vi.fn().mockResolvedValue([]),
}));

const { ClientsPartners } = await import('./clients-partners');

describe('ClientsPartners', () => {
  it('renders an honest empty state rather than inventing client names', async () => {
    render(await ClientsPartners({ locale: 'id' }));
    expect(screen.getByText('Daftar klien dan mitra sedang disiapkan.')).toBeInTheDocument();
  });
});

describe('ClientsPartners with data', () => {
  it('renders each client name from the adapter', async () => {
    vi.resetModules();
    vi.doMock('@/lib/landing/clients-adapter', () => ({
      getClientsAndPartners: vi.fn().mockResolvedValue([{ id: '1', name: 'Contoh Klien', order: 1 }]),
    }));
    const { ClientsPartners: WithData } = await import('./clients-partners');
    render(await WithData({ locale: 'id' }));
    expect(screen.getByText('Contoh Klien')).toBeInTheDocument();
  });
});

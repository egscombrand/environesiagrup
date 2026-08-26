import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';
import { makeStat } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

vi.mock('@/lib/cms/stats', () => ({
  getPublishedStats: vi.fn().mockResolvedValue([makeStat({ label: 'Tahun Pengalaman', value: 10, suffix: '+' })]),
}));

const { default: TentangKamiPage } = await import('./page');

describe('TentangKamiPage', () => {
  it('renders the heading and the group summary', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Tentang Kami' })).toBeInTheDocument();
    expect(screen.getByText(/lima entitas/i)).toBeInTheDocument();
  });

  it('describes the entities without singling any of them out as supporting', async () => {
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.queryByText(/unit penunjang/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lini layanan lingkungan/i)).not.toBeInTheDocument();
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

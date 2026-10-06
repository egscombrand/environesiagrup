import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeMilestone } from '@/lib/cms/fixtures';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';

let mockPathname = '/id/tentang-kami';
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    site_name: 'Environesia Company Group',
    logoUrl: 'https://example.com/logo.png',
  }),
}));

vi.mock('@/lib/cms/milestones', () => ({
  getPublishedMilestones: vi.fn().mockResolvedValue([
    makeMilestone({ year: 2016, title: 'Environesia didirikan', description: 'Awal perjalanan grup.', sort_order: 1 }),
  ]),
}));

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

vi.mock('@/lib/cms/leadership', () => ({
  getPublishedLeadership: vi.fn().mockResolvedValue([]),
}));

const { default: TentangKamiPage } = await import('./page');

describe('TentangKamiPage', () => {
  it('renders the hero heading and subheading', async () => {
    mockPathname = '/id/tentang-kami';
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Tentang Environesia Group' })).toBeInTheDocument();
    expect(
      screen.getByText('Satu Grup, Beragam Keahlian, Terhubung dalam Satu Ekosistem.')
    ).toBeInTheDocument();
  });

  it('embeds Makna Logo below the hero, and keeps its own 01–04 selector separate from the one Tentang Kami nav', async () => {
    mockPathname = '/id/tentang-kami';
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 2, name: 'Makna Logo' })).toBeInTheDocument();
    for (const label of ['Simbol', 'Warna', 'Tipografi', 'Kesatuan Identitas']) {
      expect(screen.getAllByRole('button', { name: new RegExp(label) }).length).toBeGreaterThan(0);
    }

    // Exactly one Tentang Kami nav — Makna Logo's own part-selector isn't
    // a second "tabs" system, and the real nav carries no 01/02/03 numbers.
    const navs = screen.getAllByRole('navigation', { name: 'Navigasi Tentang Kami' });
    expect(navs).toHaveLength(1);
    expect(navs[0]).not.toHaveTextContent(/\b01\b/);
  });

  it('shows the 6-item tab system, "Perjalanan Kami" active by default and pointing at /sejarah', async () => {
    mockPathname = '/en/tentang-kami';
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'en' }) }));

    const perjalananLink = screen.getByRole('link', { name: /Perjalanan Kami/ });
    expect(perjalananLink).toHaveAttribute('href', '/en/tentang-kami/sejarah');
    expect(perjalananLink).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Sejarah')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Green Business/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legalitas & Sertifikasi/ })).toHaveAttribute(
      'href',
      '/en/tentang-kami/legalitas'
    );
  });

  it('shows Perjalanan Kami content by default under the tab nav, not the old homepage-style content', async () => {
    mockPathname = '/id/tentang-kami';
    render(await TentangKamiPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Satu Dekade Environesia' })).toBeInTheDocument();
    expect(screen.getAllByText('Environesia didirikan').length).toBeGreaterThan(0);

    // Content that used to live on this page but belongs to the homepage
    // now (holding description, entity/year stats, K3/ISO/KAN standards)
    // must not render here anymore.
    expect(screen.queryByText(/holding yang membawahi lima entitas/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Standar yang Kami Pegang dan Jalankan/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tahun Pengalaman/i)).not.toBeInTheDocument();
  });
});

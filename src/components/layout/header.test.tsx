import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeNavigationNode } from '@/lib/cms/fixtures';

const HEADER_LABELS = [
  'Beranda',
  'Entitas',
  'Pimpinan',
  'Bisnis',
  'Tentang Kami',
  'Proyek',
  'Berita',
  'Karier',
  'Kontak',
];

vi.mock('@/lib/cms/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/cms/navigation')>()),
  getPublishedNavigation: vi.fn().mockResolvedValue(
    HEADER_LABELS.map((label, i) =>
      makeNavigationNode({
        label,
        label_zh: label === 'Entitas' ? '旗下企业' : null,
        url: label === 'Beranda' ? '/' : `/${label.toLowerCase().replace(/ /g, '-')}`,
        sort_order: i,
      })
    )
  ),
}));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    site_name: 'Environesia Company Group',
    logoUrl: undefined,
  }),
}));

const { Header } = await import('./header');

describe('Header', () => {
  it('links the group logo to the locale home', async () => {
    render(await Header({ locale: 'id' }));
    expect(screen.getByRole('link', { name: 'Environesia Company Group' })).toHaveAttribute(
      'href',
      '/id'
    );
  });

  it('shows the brand tagline beneath the logo, outside the home link', async () => {
    render(await Header({ locale: 'id' }));

    expect(screen.getByText(/Integrated Green Ecosystem/)).toBeInTheDocument();
    // the tagline must not bloat the home link's accessible name
    expect(screen.getByRole('link', { name: 'Environesia Company Group' })).toBeInTheDocument();
  });

  it('renders the logo with explicit dimensions so it cannot shift the layout', async () => {
    render(await Header({ locale: 'id' }));
    const logo = screen.getByRole('img', { name: 'Environesia Company Group' });

    expect(logo).toHaveAttribute('width');
    expect(logo).toHaveAttribute('height');
  });

  it('renders every top-level sitemap link in the desktop nav', async () => {
    render(await Header({ locale: 'id' }));
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    expect(nav.querySelectorAll('a')).toHaveLength(9);
  });

  it('prefixes links with the active locale', async () => {
    render(await Header({ locale: 'en' }));
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    const projectLink = Array.from(nav.querySelectorAll('a')).find((a) => a.textContent === 'Proyek');
    expect(projectLink).toHaveAttribute('href', '/en/proyek');
  });

  it('renders a translated label on zh, and falls back to Indonesian when untranslated', async () => {
    render(await Header({ locale: 'zh' }));
    expect(screen.getByRole('link', { name: '旗下企业' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Karier' })).toBeInTheDocument();
  });
});

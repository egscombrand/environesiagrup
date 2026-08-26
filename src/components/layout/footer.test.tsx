import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeNavigationNode } from '@/lib/cms/fixtures';

const FOOTER_LABELS = ['Entitas', 'Proyek', 'Berita', 'Karier', 'Unduhan', 'Kontak', 'Kebijakan Privasi'];

vi.mock('@/lib/cms/navigation', () => ({
  getPublishedNavigation: vi.fn().mockResolvedValue(
    FOOTER_LABELS.map((label, i) =>
      makeNavigationNode({
        label,
        url: `/${label.toLowerCase().replace(/ /g, '-')}`,
        menu: 'footer',
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
    footer_copyright: null,
    address:
      'Grha Environesia (Lantai 2)\nJl. Jati Mataram No. 284B, Karangjati\nSinduadi, Mlati, Sleman\nDaerah Istimewa Yogyakarta 55284',
  }),
}));

const { Footer } = await import('./footer');

describe('Footer', () => {
  it('renders the group logo with an accessible name', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByRole('img', { name: 'Environesia Company Group' })).toBeInTheDocument();
  });

  it('shows the brand tagline beneath the logo', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByText(/Integrated Green Ecosystem/)).toBeInTheDocument();
  });

  it('renders the head office address', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders locale-prefixed footer links', async () => {
    render(await Footer({ locale: 'en' }));
    expect(screen.getByRole('link', { name: 'Kontak' })).toHaveAttribute('href', '/en/kontak');
  });

  it('renders every footer link', async () => {
    render(await Footer({ locale: 'id' }));
    const nav = screen.getByRole('navigation', { name: 'Navigasi footer' });
    expect(nav.querySelectorAll('a')).toHaveLength(7);
  });

  it('renders the current year in the copyright line', async () => {
    render(await Footer({ locale: 'id' }));
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});

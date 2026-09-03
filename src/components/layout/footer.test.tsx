import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeNavigationNode, makeEntity } from '@/lib/cms/fixtures';

const FOOTER_LABELS = ['Entitas', 'Proyek', 'Berita', 'Karier', 'Unduhan', 'Kontak', 'Kebijakan Privasi'];

vi.mock('@/lib/cms/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/cms/navigation')>()),
  getPublishedNavigation: vi.fn().mockResolvedValue(
    FOOTER_LABELS.map((label, i) =>
      makeNavigationNode({
        label,
        label_zh: label === 'Entitas' ? '旗下企业' : null,
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
    email: 'halo@environesia.co.id',
    phone: '+62 274 000000',
    whatsapp: null,
    social_instagram: null,
    social_linkedin: null,
    social_facebook: null,
    social_youtube: null,
    social_tiktok: null,
    social_twitter: null,
  }),
}));

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue([
    makeEntity({ name: 'Environesia', slug: 'environesia', sort_order: 1 }),
    makeEntity({ name: 'GreenLab', slug: 'greenlab', sort_order: 2 }),
  ]),
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

  it('renders a translated label on zh, and falls back to Indonesian when untranslated', async () => {
    render(await Footer({ locale: 'zh' }));
    expect(screen.getByRole('link', { name: '旗下企业' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Karier' })).toBeInTheDocument();
  });

  it('renders a Group Entities column linking to each entity detail page', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByRole('link', { name: 'GreenLab' })).toHaveAttribute('href', '/id/entitas/greenlab');
  });

  it('renders a Contact column with email and phone', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByRole('link', { name: 'halo@environesia.co.id' })).toHaveAttribute(
      'href',
      'mailto:halo@environesia.co.id'
    );
    expect(screen.getByText('+62 274 000000')).toBeInTheDocument();
  });
});

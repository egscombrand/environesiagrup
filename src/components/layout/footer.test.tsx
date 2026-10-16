import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeNavigationNode } from '@/lib/cms/fixtures';

function makeFooterTree() {
  return [
    makeNavigationNode({
      label: 'Tentang Kami',
      url: '/tentang-kami',
      sort_order: 0,
      children: [
        makeNavigationNode({ label: 'Sejarah', url: '/tentang-kami/sejarah', sort_order: 0 }),
        makeNavigationNode({ label: 'Legalitas dan Akreditasi', url: '/tentang-kami/legalitas', sort_order: 1 }),
      ],
    }),
    makeNavigationNode({
      label: 'Bisnis & Ekosistem',
      url: '/bisnis-layanan',
      sort_order: 1,
      children: [
        makeNavigationNode({ label: 'Greenlab Indonesia', url: '/bisnis-layanan/greenlab', sort_order: 0 }),
      ],
    }),
    makeNavigationNode({
      label: 'Proyek & Insight',
      label_zh: '项目与洞察',
      url: '/proyek-insight',
      sort_order: 2,
      children: [
        makeNavigationNode({ label: 'Klien & Mitra', url: '/proyek-insight/klien-mitra', sort_order: 0 }),
      ],
    }),
    // A 4th group with children, deliberately not shown — the footer only
    // ever renders 3 grouped columns, matching the approved reference.
    makeNavigationNode({
      label: 'Tata Kelola & Keberlanjutan',
      url: '/tata-kelola-keberlanjutan',
      sort_order: 3,
      children: [makeNavigationNode({ label: 'Kode Etik', url: '/tata-kelola-keberlanjutan/kode-etik', sort_order: 0 })],
    }),
    // A root item with no children — must never become an empty column.
    makeNavigationNode({ label: 'Karier', url: '/karier', sort_order: 4, children: [] }),
  ];
}

vi.mock('@/lib/cms/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/cms/navigation')>()),
  getPublishedNavigation: vi.fn().mockResolvedValue(makeFooterTree()),
}));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    site_name: 'Environesia',
    logoUrl: undefined,
    footer_copyright: null,
    address: 'Grha Environesia\nJl. Jati Mataram No. 284B, Karangjati\nSinduadi, Mlati, Sleman\nDaerah Istimewa Yogyakarta 55284',
    email: 'info@environesia.co.id',
    phone: '0822 6000 6030',
    whatsapp: null,
  }),
}));

const { Footer } = await import('./footer');

describe('Footer', () => {
  it('renders the group logo with an accessible name', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByRole('img', { name: 'Environesia' })).toBeInTheDocument();
  });

  it('does not show the brand tagline beneath the logo', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.queryByText(/Integrated Green Ecosystem/)).not.toBeInTheDocument();
  });

  it('renders the head office address with the first line emphasized', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByText('Grha Environesia')).toBeInTheDocument();
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders phone and email in the first column, not a separate Contact column', async () => {
    render(await Footer({ locale: 'id' }));
    expect(screen.getByRole('link', { name: /info@environesia\.co\.id/ })).toHaveAttribute(
      'href',
      'mailto:info@environesia.co.id'
    );
    expect(screen.getByRole('link', { name: /0822 6000 6030/ })).toHaveAttribute('href', 'tel:082260006030');
  });

  it('renders exactly 3 grouped link columns, each headed by its real parent nav item', async () => {
    render(await Footer({ locale: 'id' }));

    expect(screen.getByRole('link', { name: 'Tentang Kami' })).toHaveAttribute('href', '/id/tentang-kami');
    expect(screen.getByRole('link', { name: 'Sejarah' })).toHaveAttribute('href', '/id/tentang-kami/sejarah');
    expect(screen.getByRole('link', { name: 'Bisnis & Ekosistem' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Greenlab Indonesia' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proyek & Insight' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Klien & Mitra' })).toBeInTheDocument();

    // A 4th real group with children exists in the fixture but must not render a 4th column.
    expect(screen.queryByRole('link', { name: 'Tata Kelola & Keberlanjutan' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Kode Etik' })).not.toBeInTheDocument();
    // A childless root item must never become an empty column.
    expect(screen.queryByRole('link', { name: 'Karier' })).not.toBeInTheDocument();
  });

  it('renders a translated column label on zh, and falls back to Indonesian when untranslated', async () => {
    render(await Footer({ locale: 'zh' }));
    expect(screen.getByRole('link', { name: '项目与洞察' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Greenlab Indonesia' })).toBeInTheDocument();
  });

  it('renders the current year and a real privacy-policy link in the bottom bar', async () => {
    render(await Footer({ locale: 'id' }));
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kebijakan Privasi' })).toHaveAttribute('href', '/id/kebijakan-privasi');
  });
});

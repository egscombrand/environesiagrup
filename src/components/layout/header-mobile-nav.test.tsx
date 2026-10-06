import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileNav } from './header-mobile-nav';
import { makeNavigationNode } from '@/lib/cms/fixtures';

const items = [
  makeNavigationNode({ label: 'Beranda', url: '/' }),
  makeNavigationNode({ label: 'Kontak', url: '/kontak' }),
  makeNavigationNode({ label: 'Entitas', label_zh: '旗下企业', url: '/entitas' }),
];

const withChildren = makeNavigationNode({
  label: 'Tata Kelola & Keberlanjutan',
  url: '/tata-kelola-keberlanjutan',
  children: [
    makeNavigationNode({ label: 'Kode Etik', url: '/tata-kelola-keberlanjutan/kode-etik', parent_id: 'parent' }),
    makeNavigationNode({ label: 'Keberlanjutan', url: '/tata-kelola-keberlanjutan/keberlanjutan', parent_id: 'parent' }),
  ],
});

describe('MobileNav', () => {
  it('hides the menu until the toggle is clicked', () => {
    render(<MobileNav locale="id" items={items} />);
    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });

  it('shows locale-prefixed links after clicking the toggle', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('navigation', { name: 'Navigasi mobile' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kontak' })).toHaveAttribute('href', '/id/kontak');
  });

  it('closes the menu after a link is clicked', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('link', { name: 'Kontak' }));

    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });

  it('renders a translated label on zh, and falls back to Indonesian when untranslated', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="zh" items={items} />);

    await user.click(screen.getByRole('button', { name: '菜单' }));

    expect(screen.getByRole('link', { name: '旗下企业' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kontak' })).toBeInTheDocument();
  });

  it('turns the toggle into a close control while open', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    const closeToggle = screen.getByRole('button', { name: 'Tutup' });
    expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(closeToggle);
    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Navigasi mobile' })).not.toBeInTheDocument();
  });

  it('keeps every top-level item in the panel', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={[...items, withChildren]} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    for (const item of [...items, withChildren]) {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });

  it('keeps a parent with its own URL navigable, and expands its submenu from the chevron', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={[withChildren]} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const parentLink = screen.getByRole('link', { name: 'Tata Kelola & Keberlanjutan' });
    expect(parentLink).toHaveAttribute('href', '/id/tata-kelola-keberlanjutan');

    const chevron = screen.getByRole('button', { name: 'Tata Kelola & Keberlanjutan' });
    expect(chevron).toHaveAttribute('aria-expanded', 'false');

    await user.click(chevron);

    expect(chevron).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Kode Etik' })).toBeInTheDocument();
  });

  it('keeps the submenu out of the tab order while collapsed', async () => {
    const user = userEvent.setup();
    const { container } = render(<MobileNav locale="id" items={[withChildren]} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const submenu = container.ownerDocument.getElementById(`mobile-sub-${withChildren.id}`);
    expect(submenu).toHaveAttribute('inert');
  });

  it('includes the language switcher inside the panel', async () => {
    const user = userEvent.setup();
    render(<MobileNav locale="id" items={items} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('navigation', { name: 'Pilih bahasa' })).toBeInTheDocument();
  });
});

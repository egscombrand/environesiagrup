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
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './sidebar';

let currentPath = '/wp-admin/content/leadership';
vi.mock('next/navigation', () => ({ usePathname: () => currentPath }));

describe('Sidebar', () => {
  it('opens the group that contains the current page, and marks that page current', () => {
    currentPath = '/wp-admin/content/leadership';
    render(<Sidebar role="super_admin" />);

    const group = screen.getByRole('button', { name: /Direktur Utama & Dewan Direksi/ });
    expect(group).toHaveAttribute('aria-expanded', 'true');

    const page = screen.getByRole('link', { name: 'Orang & Profil' });
    expect(page).toHaveAttribute('aria-current', 'page');
  });

  it('keeps other groups closed', () => {
    currentPath = '/wp-admin/content/leadership';
    render(<Sidebar role="super_admin" />);

    expect(screen.getByRole('button', { name: /Proyek & Insight/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens each governance area as an admin editor, never as a public link', () => {
    currentPath = '/wp-admin/dashboard';
    render(<Sidebar role="super_admin" />);

    fireEventExpand('Tata Kelola & Keberlanjutan');
    const link = screen.getByRole('link', { name: 'Kode Etik' });
    expect(link).toHaveAttribute('href', '/wp-admin/content/narasi/kode-etik');
    expect(link).not.toHaveAttribute('target');
    expect(document.querySelector('a[target="_blank"]')).toBeNull();
  });

  it('hides super-admin items from an editor', () => {
    currentPath = '/wp-admin/dashboard';
    render(<Sidebar role="author" />);

    expect(screen.queryByRole('button', { name: /Homepage/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Homepage' })).not.toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });
});

// Opens a group by its label. Kept as a helper so the tests above stay readable.
function fireEventExpand(label: string) {
  const button = screen.getByRole('button', { name: new RegExp(label) });
  if (button.getAttribute('aria-expanded') === 'false') fireEvent.click(button);
}

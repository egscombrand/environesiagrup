import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavItem } from './nav-item';

const leaf = { id: '1', label: 'Proyek', url: '/proyek', open_new_tab: false, children: [] };
const parent = {
  id: '2',
  label: 'Tentang Kami',
  url: '/tentang-kami',
  open_new_tab: false,
  children: [
    { id: '3', label: 'Sejarah', url: '/tentang-kami/sejarah', open_new_tab: false, children: [] },
    { id: '4', label: 'Visi & Misi', url: '/tentang-kami/visi-misi', open_new_tab: false, children: [] },
  ],
};

describe('NavItem', () => {
  it('renders a plain link when there are no children', () => {
    const { container } = render(<NavItem item={leaf as never} locale="id" />);

    expect(screen.getByRole('link', { name: 'Proyek' })).toHaveAttribute('href', '/id/proyek');
    expect(container.querySelector('ul')).not.toBeInTheDocument();
  });

  it('still links the parent itself when it has children', () => {
    render(<NavItem item={parent as never} locale="id" />);
    expect(screen.getByRole('link', { name: 'Tentang Kami' })).toHaveAttribute(
      'href',
      '/id/tentang-kami'
    );
  });

  it('renders every child as a locale-prefixed link', () => {
    render(<NavItem item={parent as never} locale="en" />);

    expect(screen.getByRole('link', { name: 'Sejarah' })).toHaveAttribute(
      'href',
      '/en/tentang-kami/sejarah'
    );
    expect(screen.getByRole('link', { name: 'Visi & Misi' })).toHaveAttribute(
      'href',
      '/en/tentang-kami/visi-misi'
    );
  });

  it('keeps the submenu reachable by keyboard, not hover alone', () => {
    const { container } = render(<NavItem item={parent as never} locale="id" />);
    const submenu = container.querySelector('ul')!;

    // focus-within is what makes tabbing into the submenu reveal it; without
    // it the dropdown would be mouse-only
    expect(submenu.parentElement?.className).toContain('focus-within:');
  });
})

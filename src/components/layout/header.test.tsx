import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('links the group name to the locale home', () => {
    render(<Header locale="id" />);
    expect(screen.getByRole('link', { name: 'Environesia Group' })).toHaveAttribute('href', '/id');
  });

  it('renders every top-level sitemap link in the desktop nav', () => {
    render(<Header locale="id" />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    expect(nav.querySelectorAll('a')).toHaveLength(9);
  });

  it('prefixes links with the active locale', () => {
    render(<Header locale="en" />);
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' });
    const projectLink = Array.from(nav.querySelectorAll('a')).find((a) => a.textContent === 'Proyek');
    expect(projectLink).toHaveAttribute('href', '/en/proyek');
  });
});

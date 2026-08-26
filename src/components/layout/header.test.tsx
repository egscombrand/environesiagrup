import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('links the group logo to the locale home', () => {
    render(<Header locale="id" />);
    expect(screen.getByRole('link', { name: 'Environesia Company Group' })).toHaveAttribute(
      'href',
      '/id'
    );
  });

  it('shows the brand tagline beneath the logo, outside the home link', () => {
    render(<Header locale="id" />);

    expect(screen.getByText(/Integrated Green Ecosystem/)).toBeInTheDocument();
    // the tagline must not bloat the home link's accessible name
    expect(screen.getByRole('link', { name: 'Environesia Company Group' })).toBeInTheDocument();
  });

  it('renders the logo with explicit dimensions so it cannot shift the layout', () => {
    render(<Header locale="id" />);
    const logo = screen.getByRole('img', { name: 'Environesia Company Group' });

    expect(logo).toHaveAttribute('width');
    expect(logo).toHaveAttribute('height');
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

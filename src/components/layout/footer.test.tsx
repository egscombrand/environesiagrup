import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the head office address', () => {
    render(<Footer locale="id" />);
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders locale-prefixed footer links', () => {
    render(<Footer locale="en" />);
    expect(screen.getByRole('link', { name: 'Kontak' })).toHaveAttribute('href', '/en/kontak');
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer locale="id" />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});

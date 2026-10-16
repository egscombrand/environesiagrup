import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders a primary button with a trailing arrow by default', () => {
    render(<Button>Lorem Ipsum</Button>);
    const button = screen.getByRole('button', { name: 'Lorem Ipsum' });
    expect(button).toHaveClass('bg-forest', 'text-white');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the secondary (outline) variant', () => {
    render(<Button variant="secondary">Lorem Ipsum</Button>);
    const button = screen.getByRole('button', { name: 'Lorem Ipsum' });
    expect(button).toHaveClass('border-forest', 'text-ink');
    expect(button).not.toHaveClass('bg-forest');
  });

  it('omits the arrow when showArrow is false', () => {
    render(<Button showArrow={false}>Lorem Ipsum</Button>);
    expect(screen.getByRole('button', { name: 'Lorem Ipsum' }).querySelector('svg')).not.toBeInTheDocument();
  });

  it('is inert when disabled', () => {
    render(<Button disabled>Lorem Ipsum</Button>);
    expect(screen.getByRole('button', { name: 'Lorem Ipsum' })).toBeDisabled();
  });

  it('renders an internal href as a Next.js Link', () => {
    render(<Button href="/id/kontak">Hubungi Kami</Button>);
    const link = screen.getByRole('link', { name: /Hubungi Kami/ });
    expect(link).toHaveAttribute('href', '/id/kontak');
  });

  it('renders an external href as a plain anchor and forwards target/rel', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">
        Kunjungi Example
      </Button>
    );
    const link = screen.getByRole('link', { name: /Kunjungi Example/ });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

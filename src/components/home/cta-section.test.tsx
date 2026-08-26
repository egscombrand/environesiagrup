import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CTASection } from './cta-section';

describe('CTASection', () => {
  it('renders Indonesian copy for the id locale', () => {
    render(<CTASection locale="id" />);
    expect(screen.getByText('Mari berdiskusi tentang kebutuhan Anda')).toBeInTheDocument();
  });

  it('renders Chinese copy for the zh locale', () => {
    render(<CTASection locale="zh" />);
    expect(screen.getByText('欢迎与我们探讨您的需求')).toBeInTheDocument();
  });

  it('renders a locale-prefixed contact link', () => {
    render(<CTASection locale="en" />);
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute(
      'href',
      '/en/kontak'
    );
  });
});

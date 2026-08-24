import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CTASection } from './cta-section';

describe('CTASection', () => {
  it('renders the headline and a locale-prefixed contact link', () => {
    render(<CTASection locale="en" />);
    expect(
      screen.getByText('Mari berdiskusi tentang kebutuhan Anda')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hubungi Kami' })).toHaveAttribute(
      'href',
      '/en/kontak'
    );
  });
});

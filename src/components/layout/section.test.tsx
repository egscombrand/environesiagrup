import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

describe('Section', () => {
  it('renders children inside a max-width container', () => {
    render(
      <Section>
        <p>Hello</p>
      </Section>
    );

    const container = screen.getByText('Hello').parentElement;
    expect(container).toHaveClass('max-w-[1280px]', 'px-6', 'md:px-8', 'lg:px-12');
  });

  it('applies standard vertical padding by default', () => {
    render(
      <Section>
        <p>Hello</p>
      </Section>
    );

    const section = screen.getByText('Hello').closest('section');
    expect(section).toHaveClass('py-14', 'md:py-24');
  });

  it('renders as a div when as="div"', () => {
    render(
      <Section as="div" id="test-section">
        <p>Hello</p>
      </Section>
    );

    expect(document.getElementById('test-section')?.tagName).toBe('DIV');
  });

  it('merges a custom className onto the section element', () => {
    render(
      <Section className="bg-stone">
        <p>Hello</p>
      </Section>
    );

    const section = screen.getByText('Hello').closest('section');
    expect(section).toHaveClass('bg-stone');
  });
});

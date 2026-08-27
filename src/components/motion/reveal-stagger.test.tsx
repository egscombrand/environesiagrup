import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RevealStagger, RevealItem } from './reveal-stagger';

describe('RevealStagger', () => {
  it('renders every child', () => {
    render(
      <RevealStagger>
        <RevealItem>
          <p>One</p>
        </RevealItem>
        <RevealItem>
          <p>Two</p>
        </RevealItem>
      </RevealStagger>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('passes its className through so callers keep control of layout', () => {
    const { container } = render(
      <RevealStagger className="grid gap-6">
        <RevealItem>
          <p>One</p>
        </RevealItem>
      </RevealStagger>
    );

    expect(container.firstElementChild?.className).toContain('grid');
    expect(container.firstElementChild?.className).toContain('gap-6');
  });

  it('lets an item carry its own className', () => {
    render(
      <RevealStagger>
        <RevealItem className="h-full">
          <p>One</p>
        </RevealItem>
      </RevealStagger>
    );

    expect(screen.getByText('One').parentElement?.className).toContain('h-full');
  });
});

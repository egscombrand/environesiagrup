import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './reveal';

describe('Reveal', () => {
  it('renders its children', () => {
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies a custom className to the wrapper', () => {
    render(
      <Reveal className="test-class">
        <p>Hello</p>
      </Reveal>
    );
    expect(screen.getByText('Hello').parentElement).toHaveClass('test-class');
  });
});

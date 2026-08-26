import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EntityCards } from './entity-cards';

describe('EntityCards', () => {
  it('renders all 5 entities at the same level, none singled out', () => {
    const { container } = render(<EntityCards locale="id" />);

    expect(screen.getByText('Environesia')).toBeInTheDocument();
    expect(screen.getByText('GreenLab')).toBeInTheDocument();
    expect(screen.getByText('GreenSkill')).toBeInTheDocument();
    expect(screen.getByText('LSP Praktisi Lingkungan Indonesia')).toBeInTheDocument();
    expect(screen.getByText('Bikin Indonesia Berdaya')).toBeInTheDocument();

    expect(screen.queryByText('Unit Penunjang')).not.toBeInTheDocument();
    expect(container.querySelectorAll('a')).toHaveLength(5);
  });

  it('links each entity card to its locale-prefixed detail page', () => {
    render(<EntityCards locale="en" />);
    expect(screen.getByText('GreenLab').closest('a')).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
  });
});

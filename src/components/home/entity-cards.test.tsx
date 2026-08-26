import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EntityCards } from './entity-cards';

describe('EntityCards', () => {
  it('renders all 5 entities at the same level, none singled out', () => {
    const { container } = render(<EntityCards locale="id" />);

    // each card shows the entity's logo, so the name reaches assistive tech
    // through the link's accessible name rather than as body text
    for (const nama of [
      'Environesia',
      'GreenLab',
      'GreenSkill',
      'LSP Praktisi Lingkungan Indonesia',
      'Bikin Indonesia Berdaya',
    ]) {
      expect(screen.getByRole('link', { name: nama })).toBeInTheDocument();
    }

    expect(screen.queryByText('Unit Penunjang')).not.toBeInTheDocument();
    expect(container.querySelectorAll('a')).toHaveLength(5);
  });

  it('shows each entity logo rather than its name in text', () => {
    const { container } = render(<EntityCards locale="id" />);

    const logos = container.querySelectorAll('img');
    expect(logos).toHaveLength(5);
    // decorative: the link's aria-label already names the entity
    logos.forEach((logo) => expect(logo).toHaveAttribute('alt', ''));
  });

  it('links each entity card to its locale-prefixed detail page', () => {
    render(<EntityCards locale="en" />);
    expect(screen.getByRole('link', { name: 'GreenLab' })).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
  });
});

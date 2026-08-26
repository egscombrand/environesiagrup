import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeEntity } from '@/lib/cms/fixtures';

const entities = [
  makeEntity({ name: 'Environesia', slug: 'environesia', logo_path: 'logos/environesia.png', sort_order: 1 }),
  makeEntity({ name: 'GreenLab', slug: 'greenlab', logo_path: 'logos/greenlab.png', sort_order: 2 }),
  makeEntity({ name: 'GreenSkill', slug: 'greenskill', logo_path: 'logos/greenskill.png', sort_order: 3 }),
  makeEntity({
    name: 'LSP Praktisi Lingkungan Indonesia',
    slug: 'lsp-praktisi-lingkungan',
    logo_path: 'logos/lsp.png',
    sort_order: 4,
  }),
  makeEntity({
    name: 'Bikin Indonesia Berdaya',
    slug: 'bikin-indonesia-berdaya',
    lini: 'penunjang',
    logo_path: 'logos/bikin-indonesia-berdaya.png',
    sort_order: 5,
  }),
].map((entity) => ({ ...entity, logoUrl: `https://example.invalid/${entity.logo_path}` }));

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(entities),
}));

const { EntityCards } = await import('./entity-cards');

describe('EntityCards', () => {
  it('renders all 5 entities at the same level, none singled out', async () => {
    const { container } = render(await EntityCards({ locale: 'id' }));

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

  it('shows each entity logo rather than its name in text', async () => {
    const { container } = render(await EntityCards({ locale: 'id' }));

    const logos = container.querySelectorAll('img');
    expect(logos).toHaveLength(5);
    // decorative: the link's aria-label already names the entity
    logos.forEach((logo) => expect(logo).toHaveAttribute('alt', ''));
  });

  it('links each entity card to its locale-prefixed detail page', async () => {
    render(await EntityCards({ locale: 'en' }));
    expect(screen.getByRole('link', { name: 'GreenLab' })).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

const { default: EntitasPage } = await import('./page');

describe('EntitasPage', () => {
  it('renders the heading, the diagram, and all five entities', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Entitas Kami' })).toBeInTheDocument();
    // GroupStructureDiagram was rewritten from inline SVG to HTML/CSS (Task 2) so it can wrap
    // long entity names; it no longer exposes an `img` role. "Environesia Group" is the group
    // label only the diagram renders on this page, so it stands in as proof the diagram mounted.
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();

    ['Environesia', 'GreenLab', 'GreenSkill', 'LSP Praktisi Lingkungan Indonesia', 'Bikin Indonesia Berdaya'].forEach(
      (nama) => {
        expect(screen.getByRole('link', { name: nama })).toBeInTheDocument();
      }
    );
  });

  it('shows each entity exactly once, with no duplicate listing below the diagram', async () => {
    const { container } = render(await EntitasPage({ params: Promise.resolve({ locale: 'id' }) }));

    // one card per entity, and one description per entity — the page used to
    // render both a text diagram and a separate logo grid, repeating all five
    expect(container.querySelectorAll('a[href^="/id/entitas/"]')).toHaveLength(5);
    expect(screen.getAllByText('Laboratorium & sampling.')).toHaveLength(1);
  });

  it('links every entity to its locale-prefixed detail page', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'en' }) }));
    const link = screen.getByRole('link', { name: /GreenLab/ });
    expect(link).toHaveAttribute('href', '/en/entitas/greenlab');
  });

  it('lists every entity at the same level, with no supporting-unit heading', async () => {
    render(await EntitasPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.queryByText('Unit Penunjang')).not.toBeInTheDocument();
    expect(screen.queryByText('Lini Inti')).not.toBeInTheDocument();
  });
});

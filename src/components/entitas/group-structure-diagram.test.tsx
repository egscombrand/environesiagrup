import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupStructureDiagram } from './group-structure-diagram';
import { makeEntity } from '@/lib/cms/fixtures';

const entities = [
  makeEntity({ name: 'Environesia', slug: 'environesia', accent_color: '#0F4C3A', short_description: 'Konsultasi lingkungan.', sort_order: 1 }),
  makeEntity({ name: 'GreenLab', slug: 'greenlab', accent_color: '#1E7A6B', short_description: 'Laboratorium & sampling.', sort_order: 2 }),
  makeEntity({ name: 'GreenSkill', slug: 'greenskill', accent_color: '#B07C25', short_description: 'Pelatihan kompetensi.', sort_order: 3 }),
  makeEntity({ name: 'LSP Praktisi Lingkungan Indonesia', slug: 'lsp-praktisi-lingkungan', accent_color: '#454A85', short_description: 'Sertifikasi profesi.', sort_order: 4 }),
  makeEntity({ name: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya', lini: 'penunjang', accent_color: '#A8482D', short_description: 'Konveksi custom apparel.', sort_order: 5 }),
];

describe('GroupStructureDiagram', () => {
  it('renders the group name and links every entity', () => {
    render(<GroupStructureDiagram entities={entities} locale="id" />);
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
    entities.forEach((entity) => {
      expect(screen.getByRole('link', { name: entity.name })).toHaveAttribute(
        'href',
        `/id/entitas/${entity.slug}`
      );
    });
  });

  it('exposes each entity name and description to screen readers', () => {
    render(<GroupStructureDiagram entities={entities} locale="id" />);
    entities.forEach((entity) => {
      expect(screen.getByRole('link', { name: entity.name })).toBeInTheDocument();
      expect(screen.getByText(entity.short_description!)).toBeInTheDocument();
    });
  });

  it('presents every entity at the same level, with no supporting-unit singling-out', () => {
    const { container } = render(<GroupStructureDiagram entities={entities} locale="id" />);

    expect(screen.queryByText('Unit Penunjang')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.border-dashed')).toHaveLength(0);
  });

  it('renders all five entities as siblings in a single list', () => {
    const { container } = render(<GroupStructureDiagram entities={entities} locale="id" />);

    const lists = container.querySelectorAll('ul');
    expect(lists).toHaveLength(1);
    expect(lists[0].querySelectorAll('li')).toHaveLength(5);
  });

  it('carries a long entity name in full rather than truncating it', () => {
    render(<GroupStructureDiagram entities={entities} locale="id" />);
    expect(
      screen.getByRole('link', { name: 'LSP Praktisi Lingkungan Indonesia' })
    ).toBeInTheDocument();
  });
});

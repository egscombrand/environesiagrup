import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupStructureDiagram } from './group-structure-diagram';
import type { EntityEntry } from '@/lib/content-types';

const entities: EntityEntry[] = [
  { nama: 'Environesia', slug: 'environesia', lini: 'inti', warnaAksen: '#0F4C3A', deskripsi: 'Konsultasi lingkungan.', layanan: [], legalitas: [], urutan: 1 },
  { nama: 'GreenLab', slug: 'greenlab', lini: 'inti', warnaAksen: '#1E7A6B', deskripsi: 'Laboratorium & sampling.', layanan: [], legalitas: [], urutan: 2 },
  { nama: 'GreenSkill', slug: 'greenskill', lini: 'inti', warnaAksen: '#B07C25', deskripsi: 'Pelatihan kompetensi.', layanan: [], legalitas: [], urutan: 3 },
  { nama: 'LSP Praktisi Lingkungan Indonesia', slug: 'lsp-praktisi-lingkungan', lini: 'inti', warnaAksen: '#454A85', deskripsi: 'Sertifikasi profesi.', layanan: [], legalitas: [], urutan: 4 },
  { nama: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya', lini: 'penunjang', warnaAksen: '#A8482D', deskripsi: 'Konveksi custom apparel.', layanan: [], legalitas: [], urutan: 5 },
];

describe('GroupStructureDiagram', () => {
  it('renders the group name and links every entity', () => {
    render(<GroupStructureDiagram entities={entities} locale="id" />);
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
    entities.forEach((entity) => {
      expect(screen.getByRole('link', { name: entity.nama })).toHaveAttribute(
        'href',
        `/id/entitas/${entity.slug}`
      );
    });
  });

  it('exposes each entity name and description to screen readers', () => {
    render(<GroupStructureDiagram entities={entities} locale="id" />);
    entities.forEach((entity) => {
      expect(screen.getByRole('link', { name: entity.nama })).toBeInTheDocument();
      expect(screen.getByText(entity.deskripsi)).toBeInTheDocument();
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

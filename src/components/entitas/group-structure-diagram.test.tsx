import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupStructureDiagram } from './group-structure-diagram';
import type { EntityEntry } from '@/lib/content-types';

const entities: EntityEntry[] = [
  { nama: 'Environesia', slug: 'environesia', lini: 'inti', warnaAksen: '#0F4C3A', deskripsi: 'Konsultasi lingkungan.', layanan: [], legalitas: [], urutan: 1 },
  { nama: 'GreenLab', slug: 'greenlab', lini: 'inti', warnaAksen: '#1E7A6B', deskripsi: 'Laboratorium & sampling.', layanan: [], legalitas: [], urutan: 2 },
  { nama: 'GreenSkill', slug: 'greenskill', lini: 'inti', warnaAksen: '#B07C25', deskripsi: 'Pelatihan kompetensi.', layanan: [], legalitas: [], urutan: 3 },
  { nama: 'LSP PLI', slug: 'lsp-praktisi-lingkungan', lini: 'inti', warnaAksen: '#454A85', deskripsi: 'Sertifikasi profesi.', layanan: [], legalitas: [], urutan: 4 },
  { nama: 'Bikin Indonesia Berdaya', slug: 'bikin-indonesia-berdaya', lini: 'penunjang', warnaAksen: '#A8482D', deskripsi: 'Konveksi custom apparel.', layanan: [], legalitas: [], urutan: 5 },
];

describe('GroupStructureDiagram', () => {
  it('renders the group name and every entity name', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
    entities.forEach((entity) => {
      expect(screen.getByText(entity.nama)).toBeInTheDocument();
    });
  });

  it('has an accessible description of the structure', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByRole('img', { name: /struktur grup/i })).toBeInTheDocument();
  });

  it('connects the supporting entity with a dashed line, unlike the core entities', () => {
    const { container } = render(<GroupStructureDiagram entities={entities} />);
    const dashed = container.querySelectorAll('[stroke-dasharray]');
    expect(dashed).toHaveLength(1);
  });

  it('labels the supporting entity as a supporting unit', () => {
    render(<GroupStructureDiagram entities={entities} />);
    expect(screen.getByText('Unit Penunjang')).toBeInTheDocument();
  });
});

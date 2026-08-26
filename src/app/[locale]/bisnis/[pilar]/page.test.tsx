import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES, PILLARS } from '@/lib/cms/__fixtures__/site-content';

vi.mock('@/lib/cms/pillars', () => ({
  getPublishedPillars: vi.fn().mockResolvedValue(PILLARS),
  getPublishedPillarBySlug: vi.fn((slug: string) =>
    Promise.resolve(PILLARS.find((p) => p.slug === slug) ?? null)
  ),
}));

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

const { default: PillarDetailPage, generateStaticParams } = await import('./page');

describe('generateStaticParams', () => {
  it('returns a param set for every pillar in every locale', async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(12);
    expect(params).toContainEqual({ locale: 'id', pilar: 'konsultasi' });
    expect(params).toContainEqual({ locale: 'en', pilar: 'sertifikasi-profesi' });
    expect(params).toContainEqual({ locale: 'zh', pilar: 'pengujian-sampling' });
  });
});

describe('PillarDetailPage', () => {
  it('renders the pillar name and description', async () => {
    render(
      await PillarDetailPage({
        params: Promise.resolve({ locale: 'id', pilar: 'pengujian-sampling' }),
      })
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pengujian & Sampling' })
    ).toBeInTheDocument();
    expect(screen.getByText('Pengujian laboratorium dan sampling lapangan.')).toBeInTheDocument();
  });

  it('cross-links to the entity that delivers this pillar', async () => {
    render(
      await PillarDetailPage({
        params: Promise.resolve({ locale: 'id', pilar: 'pengujian-sampling' }),
      })
    );

    expect(screen.getByRole('link', { name: /GreenLab/ })).toHaveAttribute(
      'href',
      '/id/entitas/greenlab'
    );
  });

  it('renders an honest empty state when the services list is empty', async () => {
    render(
      await PillarDetailPage({ params: Promise.resolve({ locale: 'id', pilar: 'konsultasi' }) })
    );
    expect(screen.getByText('Rincian layanan akan segera hadir.')).toBeInTheDocument();
  });

  it('links back to the business overview with the active locale', async () => {
    render(
      await PillarDetailPage({ params: Promise.resolve({ locale: 'en', pilar: 'konsultasi' }) })
    );
    expect(screen.getByRole('link', { name: /All pillars/ })).toHaveAttribute('href', '/en/bisnis');
  });
});

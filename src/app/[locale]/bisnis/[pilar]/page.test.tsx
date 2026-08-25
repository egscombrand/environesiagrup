import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PillarDetailPage, { generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('returns a param set for every pillar in both locales', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(8);
    expect(params).toContainEqual({ locale: 'id', pilar: 'konsultasi' });
    expect(params).toContainEqual({ locale: 'en', pilar: 'sertifikasi-profesi' });
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
    expect(screen.getByRole('link', { name: /Semua pilar/ })).toHaveAttribute('href', '/en/bisnis');
  });
});

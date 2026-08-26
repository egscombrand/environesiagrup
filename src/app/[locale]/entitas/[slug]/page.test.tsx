import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
  getPublishedEntityBySlug: vi.fn((slug: string) =>
    Promise.resolve(ENTITIES.find((e) => e.slug === slug) ?? null)
  ),
}));

const { default: EntityDetailPage, generateStaticParams } = await import('./page');

describe('generateStaticParams', () => {
  it('returns a param set for every entity in both locales', async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(10);
    expect(params).toContainEqual({ locale: 'id', slug: 'greenlab' });
    expect(params).toContainEqual({ locale: 'en', slug: 'bikin-indonesia-berdaya' });
  });
});

describe('EntityDetailPage', () => {
  it('renders the entity name, description, and its accreditation', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenlab' }) })
    );

    expect(screen.getByRole('heading', { level: 1, name: 'GreenLab' })).toBeInTheDocument();
    expect(screen.getByText('Laboratorium & sampling.')).toBeInTheDocument();
    expect(screen.getByText(/KAN ISO\/IEC 17025/)).toBeInTheDocument();
  });

  it('renders an honest empty state when the services list is empty', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenskill' }) })
    );
    expect(screen.getByText('Rincian layanan akan segera hadir.')).toBeInTheDocument();
  });

  it('renders an honest empty state when there is no accreditation on file', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'environesia' }) })
    );
    expect(screen.getByText('Data legalitas akan segera hadir.')).toBeInTheDocument();
  });

  it('shows the website only for an entity that has one', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'id', slug: 'greenlab' }) })
    );
    expect(screen.getByRole('link', { name: 'toolsgl.my.id' })).toHaveAttribute(
      'href',
      'https://toolsgl.my.id'
    );
  });

  it('links back to the entity overview with the active locale', async () => {
    render(
      await EntityDetailPage({ params: Promise.resolve({ locale: 'en', slug: 'greenlab' }) })
    );
    expect(screen.getByRole('link', { name: /Semua entitas/ })).toHaveAttribute(
      'href',
      '/en/entitas'
    );
  });
});

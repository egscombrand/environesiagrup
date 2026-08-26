import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/posts', () => ({
  getPublishedPosts: vi.fn().mockResolvedValue([]),
}));

const { default: BeritaPage } = await import('./page');

describe('BeritaPage', () => {
  it('renders the heading', async () => {
    render(await BeritaPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByRole('heading', { level: 1, name: 'Berita & Insight' })).toBeInTheDocument();
  });

  it('reports honestly that no posts exist yet', async () => {
    render(await BeritaPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(screen.getByText('Belum ada berita terbaru.')).toBeInTheDocument();
  });
});

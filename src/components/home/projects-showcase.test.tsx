import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeProject } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/projects', () => ({
  getFeaturedPublishedProjects: vi.fn().mockResolvedValue([]),
}));

const { ProjectsShowcase } = await import('./projects-showcase');

describe('ProjectsShowcase', () => {
  it('renders an honest empty state when there are no projects yet', async () => {
    render(await ProjectsShowcase({ locale: 'id' }));
    expect(screen.getByText('Daftar proyek unggulan sedang disiapkan.')).toBeInTheDocument();
  });
});

describe('ProjectsShowcase with data', () => {
  it('renders the first project as a large featured card and the rest as a row list', async () => {
    vi.resetModules();
    vi.doMock('@/lib/cms/projects', () => ({
      getFeaturedPublishedProjects: vi.fn().mockResolvedValue([
        makeProject({ title: 'Proyek Utama', slug: 'proyek-utama', sector: 'Konsultasi', year: 2025 }),
        makeProject({ title: 'Proyek Kedua', slug: 'proyek-kedua', sector: 'Pengujian', year: 2024 }),
        makeProject({ title: 'Proyek Ketiga', slug: 'proyek-ketiga', sector: 'Pelatihan', year: 2023 }),
      ]),
    }));
    const { ProjectsShowcase: ProjectsShowcaseWithData } = await import('./projects-showcase');

    render(await ProjectsShowcaseWithData({ locale: 'id' }));

    expect(screen.getByRole('link', { name: /Proyek Utama/ })).toHaveAttribute('href', '/id/proyek/proyek-utama');
    expect(screen.getByText('Proyek Kedua')).toBeInTheDocument();
    expect(screen.getByText('Proyek Ketiga')).toBeInTheDocument();
  });
});

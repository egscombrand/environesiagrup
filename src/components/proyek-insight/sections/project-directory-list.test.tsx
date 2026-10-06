import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProjectDirectoryList } from './project-directory-list';
import type { DirectoryProject } from './project-directory-logic';

function project(overrides: Partial<DirectoryProject> = {}): DirectoryProject {
  return {
    id: 'p1',
    title: 'Kajian Lingkungan',
    client: 'PT Contoh',
    sector: 'Industri',
    city: 'Bandung',
    country: 'Indonesia',
    year: 2022,
    ...overrides,
  };
}

function manyProjects(count: number): DirectoryProject[] {
  return Array.from({ length: count }, (_, i) => project({ id: `p${i + 1}`, title: `Proyek Nomor ${i + 1}` }));
}

async function openSectorDropdown() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Semua Sektor' }));
  return user;
}

describe('ProjectDirectoryList — non-navigational rows', () => {
  it('renders a project row as a plain, non-interactive element — never a link, never a button', () => {
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);

    const title = screen.getByText('Kajian Lingkungan');
    expect(title.closest('a')).toBeNull();
    expect(title.closest('button')).toBeNull();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('clicking a row does not throw and does not navigate (no href anywhere in the directory)', async () => {
    const user = userEvent.setup();
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);

    await user.click(screen.getByText('Kajian Lingkungan'));

    expect(document.querySelector('a[href*="/proyek/"]')).toBeNull();
  });

  it('renders the numbered index, name, client, and sector/location/year as distinct elements', () => {
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Kajian Lingkungan')).toBeInTheDocument();
    expect(screen.getByText('PT Contoh')).toBeInTheDocument();
    expect(screen.getByText('Industri')).toBeInTheDocument();
    expect(screen.getByText('Bandung, Indonesia · 2022')).toBeInTheDocument();
  });

  it('never hides a project for missing client/sector/location/year — it only omits what is missing', () => {
    render(
      <ProjectDirectoryList
        locale="id"
        projects={[project({ id: 'nameonly', title: 'Project Tanpa Data', client: null, sector: null, city: null, country: null, year: null })]}
      />
    );

    expect(screen.getByText('Project Tanpa Data')).toBeInTheDocument();
    expect(screen.queryByText('·')).not.toBeInTheDocument();
  });
});

describe('ProjectDirectoryList — header, toolbar, and count', () => {
  it('shows the real "Menampilkan X–Y dari Z proyek" range', () => {
    render(<ProjectDirectoryList locale="id" projects={manyProjects(30)} />);
    expect(screen.getByText('Menampilkan 1–12 dari 30 proyek')).toBeInTheDocument();
  });

  it('shows "Portofolio Proyek" with the current page range inside the panel', () => {
    render(<ProjectDirectoryList locale="id" projects={manyProjects(30)} />);
    expect(screen.getByText('Portofolio Proyek')).toBeInTheDocument();
    expect(screen.getByText('1–12')).toBeInTheDocument();
  });
});

describe('ProjectDirectoryList — search', () => {
  it('filters by project name, client, or location', async () => {
    const user = userEvent.setup();
    const projects = [
      project({ id: 'a', title: 'Kajian Lingkungan Hidup' }),
      project({ id: 'b', title: 'Studi AMDAL', client: 'PT Lain', city: 'Surabaya' }),
    ];
    render(<ProjectDirectoryList locale="id" projects={projects} />);

    await user.type(screen.getByPlaceholderText('Cari nama proyek, klien, atau lokasi…'), 'Surabaya');

    expect(screen.queryByText('Kajian Lingkungan Hidup')).not.toBeInTheDocument();
    expect(screen.getByText('Studi AMDAL')).toBeInTheDocument();
  });

  it('shows the dedicated "no results" message when a search matches nothing, inside the panel', async () => {
    const user = userEvent.setup();
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);

    await user.type(screen.getByPlaceholderText('Cari nama proyek, klien, atau lokasi…'), 'tidak ada yang cocok sama sekali');

    expect(screen.getByText('Tidak ada proyek yang sesuai dengan pencarian.')).toBeInTheDocument();
  });
});

describe('ProjectDirectoryList — sector dropdown', () => {
  it('defaults to "Semua Sektor" and is not a long horizontal row of pills', () => {
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);

    expect(screen.getByRole('button', { name: 'Semua Sektor' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Transportasi' })).not.toBeInTheDocument();
  });

  it('picking a sector filters to exact matches and updates the trigger label', async () => {
    const projects = [
      project({ id: 'a', title: 'Proyek Transportasi', sector: 'Transportasi' }),
      project({ id: 'b', title: 'Proyek Industri', sector: 'Industri' }),
    ];
    render(<ProjectDirectoryList locale="id" projects={projects} />);

    const user = await openSectorDropdown();
    await user.click(screen.getByRole('button', { name: 'Transportasi' }));

    expect(screen.getByText('Proyek Transportasi')).toBeInTheDocument();
    expect(screen.queryByText('Proyek Industri')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Transportasi' })).toBeInTheDocument();
  });

  it('has its own search box to narrow a long option list', async () => {
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);
    const user = await openSectorDropdown();

    await user.type(screen.getByPlaceholderText('Cari sektor…'), 'migas');

    expect(screen.getByRole('button', { name: 'Migas & Pertambangan' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Industri' })).not.toBeInTheDocument();
  });
});

describe('ProjectDirectoryList — pagination', () => {
  it('paginates at 12 per page and advances with "Berikutnya"', async () => {
    const user = userEvent.setup();
    render(<ProjectDirectoryList locale="id" projects={manyProjects(30)} />);

    expect(screen.getByText('Proyek Nomor 1')).toBeInTheDocument();
    expect(screen.queryByText('Proyek Nomor 13')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Berikutnya/ }));

    expect(screen.getByText('Menampilkan 13–24 dari 30 proyek')).toBeInTheDocument();
    expect(screen.getByText('Proyek Nomor 13')).toBeInTheDocument();
    expect(screen.queryByText('Proyek Nomor 1')).not.toBeInTheDocument();
  });

  it('jumping to a specific page number works directly', async () => {
    const user = userEvent.setup();
    render(<ProjectDirectoryList locale="id" projects={manyProjects(30)} />);

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(screen.getByText('Menampilkan 25–30 dari 30 proyek')).toBeInTheDocument();
    expect(screen.getByText('Proyek Nomor 25')).toBeInTheDocument();
  });

  it('never shows pagination controls when everything fits on one page', () => {
    render(<ProjectDirectoryList locale="id" projects={[project()]} />);
    expect(screen.queryByRole('navigation', { name: 'Navigasi halaman proyek' })).not.toBeInTheDocument();
  });
});

describe('ProjectDirectoryList — no projects at all', () => {
  it('shows the honest empty message, without rendering the toolbar or panel', () => {
    render(<ProjectDirectoryList locale="id" projects={[]} />);

    expect(screen.getByText('Daftar proyek sedang disiapkan.')).toBeInTheDocument();
    expect(screen.queryByText('Portofolio Proyek')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Cari nama proyek, klien, atau lokasi…')).not.toBeInTheDocument();
  });
});

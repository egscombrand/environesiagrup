import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeProject, makeProjectPin, makePost } from '@/lib/cms/fixtures';

let mockPathname = '/id/proyek-insight';
const redirect = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  redirect: (...args: unknown[]) => redirect(...args),
}));

vi.mock('@/lib/cms/projects', () => ({
  getPublishedProjects: vi.fn().mockResolvedValue([
    makeProject({ title: 'Kajian Lingkungan Hidup', slug: 'kajian-lingkungan-hidup', city: 'Yogyakarta', country: 'Indonesia', year: 2023 }),
  ]),
  getPublishedProjectPins: vi.fn().mockResolvedValue([makeProjectPin({ country: 'Indonesia' })]),
}));

vi.mock('@/lib/cms/posts', () => ({
  getPublishedPosts: vi.fn().mockResolvedValue([
    makePost({ title: 'Environesia Raih Sertifikasi Baru', slug: 'environesia-raih-sertifikasi-baru', category: null }),
    makePost({ title: 'Peluncuran Layanan Baru', slug: 'peluncuran-layanan-baru', category: 'siaran-pers' }),
  ]),
}));

vi.mock('@/lib/landing/clients-adapter', () => ({
  getClientsAndPartners: vi.fn().mockResolvedValue([]),
}));

const { default: ProyekInsightPage } = await import('./page');
const { default: PortofolioProyekPage } = await import('./(tabs)/portofolio-proyek/page');
const { default: KlienMitraPage } = await import('./(tabs)/klien-mitra/page');
const { default: BeritaPerusahaanPage } = await import('./(tabs)/berita-perusahaan/page');
const { default: SiaranPersPage } = await import('./(tabs)/siaran-pers/page');

const params = Promise.resolve({ locale: 'id' });

describe('ProyekInsightPage (hub)', () => {
  it('fixes the 404: the bare /proyek-insight hub renders real content, defaulting to the Portofolio Proyek tab', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    // "Proyek & Insight" is always the primary h1 — the active tab's own
    // name is the small label above it, not the other way around.
    expect(screen.getByRole('heading', { level: 1, name: 'Proyek & Insight' })).toBeInTheDocument();
    expect(screen.getAllByText('Portofolio Proyek', { selector: 'p' }).length).toBeGreaterThan(0);
    expect(screen.getByText('Lebih dari 1.000 Proyek, Beragam Sektor dan Wilayah')).toBeInTheDocument();
    expect(screen.getByText('Kajian Lingkungan Hidup')).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: 'Navigasi Proyek & Insight' });
    expect(within(nav).getByRole('link', { name: 'Portofolio Proyek' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Klien & Mitra' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Berita Perusahaan' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Siaran Pers' })).toBeInTheDocument();
  });

  it('never shows "Rekam Jejak Global" — Daftar Proyek is the first (and only) section right after the tabs', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    expect(screen.queryByText('Rekam Jejak Global')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Rekam jejak pekerjaan grup bersama klien korporat dan instansi.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Peta jejak proyek akan tersedia setelah data 10 negara lengkap.')
    ).not.toBeInTheDocument();

    // The Portofolio Proyek tab panel's very first heading is the new
    // editorial headline — nothing else sits between the tab bar and it.
    const nav = screen.getByRole('navigation', { name: 'Navigasi Proyek & Insight' });
    const headline = screen.getByRole('heading', { level: 2, name: 'Rekam Jejak yang Terbentuk dari Proyek Nyata' });
    expect(nav.compareDocumentPosition(headline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shows the "Daftar Proyek" eyebrow, the big editorial headline, and the description above the Project Directory', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    expect(screen.getByText('Daftar Proyek')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Rekam Jejak yang Terbentuk dari Proyek Nyata' })
    ).toBeInTheDocument();
    expect(screen.getByText('Proyek Nyata')).toBeInTheDocument();
    expect(
      screen.getByText('Jelajahi pengalaman Environesia Company Group berdasarkan sektor, wilayah, dan periode pelaksanaan.')
    ).toBeInTheDocument();

    // The directory is numbered, non-navigational rows — the project name
    // is never wrapped in a link.
    expect(screen.getByText('1')).toBeInTheDocument();
    const projectTitle = screen.getByText('Kajian Lingkungan Hidup');
    expect(projectTitle.closest('a')).toBeNull();
  });

  it('never shows a "Proyek Pilihan" / Featured Project highlight', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    expect(screen.queryByText('Proyek Pilihan')).not.toBeInTheDocument();
    expect(screen.queryByText('Lihat Proyek')).not.toBeInTheDocument();
  });

  it('shows the real intro section (image + copy) once, right before the tab bar, the same on every tab', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    const image = screen.getByRole('img', {
      name: 'Tim Environesia Company Group mengerjakan proyek lingkungan di berbagai sektor',
    });
    expect(image).toHaveAttribute('src', expect.stringContaining('bannerinsight.png'));

    const heading = screen.getByRole('heading', { level: 2, name: /Lebih dari 1\.000 Proyek/ });
    expect(heading).toHaveTextContent('Lebih dari 1.000 Proyek, Beragam Sektor dan Wilayah');
    expect(screen.getByText('1.000 Proyek')).toHaveStyle({ color: 'rgb(1, 179, 161)' });
    expect(heading).toHaveStyle({ color: 'rgb(42, 119, 147)' });

    expect(screen.getByText(/Sejak 2016, Environesia telah terlibat/)).toBeInTheDocument();
    expect(screen.getByText(/Gunakan penyaring untuk menemukan proyek/)).toBeInTheDocument();

    // Same intro, unchanged, regardless of which tab is active.
    const nav = screen.getByRole('navigation', { name: 'Navigasi Proyek & Insight' });
    await userEvent.setup().click(within(nav).getByRole('link', { name: 'Klien & Mitra' }));
    expect(screen.getByRole('heading', { level: 2, name: /Lebih dari 1\.000 Proyek/ })).toBeInTheDocument();
  });

  it('shows all 5 "Satu Dekade dalam Angka" stats, equally, with no featured/highlighted card', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    expect(screen.getByRole('heading', { level: 2, name: 'Satu Dekade dalam Angka' })).toBeInTheDocument();
    // The intro paragraph was removed — heading goes straight into the cards.
    expect(
      screen.queryByText(/Lebih dari satu dekade pengalaman yang dibangun melalui proyek/)
    ).not.toBeInTheDocument();

    // Exactly 5 stats, none merged, none dropped, none given a 6th
    // "Sejak 2016" card (that fact already lives inside "10+ Tahun"). Each
    // card's number/label is one combined "{value} {unit}" row beside its
    // icon, e.g. "10+ Tahun" — not two separate stacked lines.
    expect(screen.getByText('10+ Tahun')).toBeInTheDocument();
    expect(screen.getByText('Pengalaman dan kapabilitas yang dibangun sejak 2016.')).toBeInTheDocument();

    expect(screen.getByText('1.000+ Proyek')).toBeInTheDocument();
    expect(screen.getByText('38 Provinsi')).toBeInTheDocument();
    expect(screen.getByText('10 Negara')).toBeInTheDocument();
    expect(screen.getByText('5 Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('Lima perusahaan dalam ekosistem Environesia Company Group.')).toBeInTheDocument();

    expect(screen.queryByText('Sejak 2016', { selector: 'p' })).not.toBeInTheDocument();

    // Every number/label row shares the same color/size — no card is
    // singled out with the accent color or a larger number.
    const labels = ['10+ Tahun', '1.000+ Proyek', '38 Provinsi', '10 Negara', '5 Perusahaan'];
    const colors = labels.map((n) => getComputedStyle(screen.getByText(n)).color);
    expect(new Set(colors).size).toBe(1);
    expect(colors[0]).toBe('rgb(42, 119, 147)');
  });

  it('tab links are real routes, and the active tab is marked from the current route', async () => {
    mockPathname = '/id/proyek-insight';
    render(await ProyekInsightPage({ params }));

    const nav = screen.getByRole('navigation', { name: 'Navigasi Proyek & Insight' });
    expect(within(nav).getByRole('link', { name: 'Klien & Mitra' })).toHaveAttribute('href', '/id/proyek-insight/klien-mitra');
    expect(within(nav).getByRole('link', { name: 'Berita Perusahaan' })).toHaveAttribute('href', '/id/proyek-insight/berita-perusahaan');
    expect(within(nav).getByRole('link', { name: 'Siaran Pers' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Portofolio Proyek' })).toHaveAttribute('aria-current', 'page');
  });

  it('a tab route renders only its own tab content, not the other tabs', async () => {
    mockPathname = '/id/proyek-insight/klien-mitra';
    render(await KlienMitraPage({ params }));

    expect(screen.queryByText('Kajian Lingkungan Hidup')).not.toBeInTheDocument();
    expect(screen.queryByText('Environesia Raih Sertifikasi Baru')).not.toBeInTheDocument();
  });
});

describe('Proyek & Insight sub-pages', () => {
  it('Portofolio Proyek tab route renders with its tab pre-selected', async () => {
    mockPathname = '/id/proyek-insight/portofolio-proyek';
    render(await PortofolioProyekPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Proyek & Insight' })).toBeInTheDocument();
    expect(screen.getAllByText('Portofolio Proyek', { selector: 'p' }).length).toBeGreaterThan(0);
    // The directory row is informational only — it never links to the
    // detail page from this tab.
    expect(screen.getByText('Kajian Lingkungan Hidup').closest('a')).toBeNull();
  });

  it('Klien & Mitra tab route renders with its tab pre-selected', async () => {
    mockPathname = '/id/proyek-insight/klien-mitra';
    render(await KlienMitraPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Proyek & Insight' })).toBeInTheDocument();
    expect(screen.getByText('Klien & Mitra', { selector: 'p' })).toBeInTheDocument();
  });

  it('Berita Perusahaan tab stays in place but does not repeat articles already listed in Siaran Pers', async () => {
    mockPathname = '/id/proyek-insight/berita-perusahaan';
    render(await BeritaPerusahaanPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Proyek & Insight' })).toBeInTheDocument();
    expect(screen.getByText('Berita Perusahaan', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Seluruh berita kini tersedia di Siaran Pers.')).toBeInTheDocument();
    expect(screen.queryByText('Environesia Raih Sertifikasi Baru')).not.toBeInTheDocument();
    expect(screen.queryByText('Peluncuran Layanan Baru')).not.toBeInTheDocument();
    expect(screen.queryByText('Baca Berita')).not.toBeInTheDocument();
  });

  it('Siaran Pers lists each article exactly once, linking to the real /berita detail route', async () => {
    mockPathname = '/id/proyek-insight/siaran-pers';
    render(await SiaranPersPage({ params }));

    expect(screen.getAllByText('Environesia Raih Sertifikasi Baru')).toHaveLength(1);
    expect(screen.getAllByText('Peluncuran Layanan Baru')).toHaveLength(1);
    const link = screen.getAllByText(/Baca Berita/)[0].closest('a');
    expect(link).toHaveAttribute('href', '/id/berita/environesia-raih-sertifikasi-baru');
  });

  it('Siaran Pers links "Baca Berita" straight to the original article, in a new tab, when a source link exists', async () => {
    mockPathname = '/id/proyek-insight/siaran-pers';
    const { getPublishedPosts } = await import('@/lib/cms/posts');
    vi.mocked(getPublishedPosts).mockResolvedValueOnce([
      makePost({
        title: 'Greenlab Indonesia Rilis Cabang',
        slug: 'greenlab-rilis-cabang',
        owner: 'GreenLab',
        media: 'Beritasatu.com',
        source_url: 'https://www.beritasatu.com/network/bisnistoday/247055/greenlab',
        published_at: '2024-05-08',
      }),
    ]);
    render(await SiaranPersPage({ params }));

    expect(screen.getByText('GreenLab')).toBeInTheDocument();
    // The stored media name appears in the attribution line and in the media panel.
    expect(screen.getAllByText(/Beritasatu\.com/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2, name: 'Siaran Pers' })).toBeInTheDocument();
    expect(screen.getByText('Sorotan Media')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Baca Berita/ });
    expect(link).toHaveAttribute('href', 'https://www.beritasatu.com/network/bisnistoday/247055/greenlab');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows the Siaran Pers empty state when there are no articles yet, never a fabricated one', async () => {
    mockPathname = '/id/proyek-insight/siaran-pers';
    const { getPublishedPosts } = await import('@/lib/cms/posts');
    vi.mocked(getPublishedPosts).mockResolvedValueOnce([]);
    render(await SiaranPersPage({ params }));

    expect(screen.getByText('Siaran pers sedang disiapkan.')).toBeInTheDocument();
  });
});

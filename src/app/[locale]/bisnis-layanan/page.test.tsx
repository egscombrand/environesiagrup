import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));
vi.mock('@/lib/cms/story-scenes', () => ({ getPublishedStoryScenesByEntity: vi.fn().mockResolvedValue({}) }));

// Entity Explorer fields (explorer*), as the real reader (src/lib/cms/entities.ts)
// would resolve them. This test mocks the whole module, so it sets these
// directly rather than relying on that reader's own fallback.
const ENTITIES = [
  {
    id: '1',
    name: 'Environesia',
    slug: 'environesia-consultant',
    logoUrl: '/brand/entitas-environesia.png',
    short_description: 'Konsultansi lingkungan Environesia.',
    explorerCategory: 'Environmental Consulting & Sustainability',
    explorerDescription: 'Environesia berfokus pada konsultansi dan pendampingan lingkungan.',
    explorerContribution: 'Membantu organisasi memahami dan mengelola kebutuhan lingkungan.',
    explorerFocus: ['Consulting', 'Assessment', 'Compliance', 'Monitoring'],
    explorerServices: ['Environmental Consulting', 'Environmental Assessment', 'Compliance', 'Monitoring'],
    explorerRole: 'Environesia menjadi bagian yang berfokus pada konsultansi dan pendampingan lingkungan.',
    explorerCtaUrl: 'https://environesia.co.id/',
  },
  {
    id: '2',
    name: 'GreenLab',
    slug: 'greenlab',
    logoUrl: '/brand/entitas-greenlab.png',
    short_description: 'Laboratorium pengujian GreenLab.',
    explorerCategory: 'Environmental Laboratory & Testing',
    explorerDescription: 'GreenLab berfokus pada pengujian dan analisis laboratorium.',
    explorerContribution: 'Menyediakan data hasil pengujian dan analisis.',
    explorerFocus: ['Laboratory', 'Testing', 'Analysis'],
    explorerServices: ['Laboratory', 'Testing', 'Analysis', 'Environmental Testing'],
    explorerRole: 'GreenLab berperan sebagai laboratorium pengujian dan analisis dalam ekosistem.',
    explorerCtaUrl: 'https://greenlab.co.id/',
  },
  {
    id: '3',
    name: 'GreenSkill',
    slug: 'greenskill',
    logoUrl: '/brand/entitas-greenskill.png',
    short_description: 'Pelatihan dan sertifikasi GreenSkill.',
    explorerCategory: 'Training & Professional Development',
    explorerDescription: 'GreenSkill berfokus pada pengembangan kompetensi melalui pembelajaran dan pelatihan.',
    explorerContribution: 'Membantu individu dan organisasi mengembangkan kompetensi.',
    explorerFocus: ['Training', 'Learning', 'Development'],
    explorerServices: ['Training', 'Learning', 'Development', 'Professional Development'],
    explorerRole: 'GreenSkill berperan mengembangkan kompetensi dan kapasitas sumber daya manusia.',
    explorerCtaUrl: 'https://greenskill.id/',
  },
  {
    id: '4',
    name: 'LSP Praktisi Lingkungan Indonesia',
    slug: 'lsp-praktisi-lingkungan',
    logoUrl: '/brand/entitas-lsp-praktisi-lingkungan.png',
    short_description: 'Lembaga sertifikasi profesi lingkungan.',
    explorerCategory: 'Competency Certification',
    explorerDescription: 'LSP Praktisi Lingkungan Indonesia berfokus pada sertifikasi kompetensi profesional.',
    explorerContribution: 'Mendukung pengakuan kompetensi profesional melalui asesmen dan sertifikasi.',
    explorerFocus: ['Competency', 'Assessment', 'Certification'],
    explorerServices: ['Competency', 'Assessment', 'Certification', 'Professional Certification'],
    explorerRole: 'LSP Praktisi Lingkungan Indonesia berperan memberikan pengakuan resmi atas kompetensi profesional.',
    explorerCtaUrl: 'https://lsp-praktisilingkungan.id/',
  },
  {
    id: '5',
    name: 'Bikin Indonesia Berdaya',
    slug: 'bikin-indonesia-berdaya',
    logoUrl: '/brand/entitas-bikin-indonesia-berdaya.png',
    short_description: 'Apparel dan produksi Bikin Indonesia Berdaya.',
    explorerCategory: 'Apparel & Professional Uniform',
    explorerDescription: 'Bikin Indonesia Berdaya mendukung kebutuhan apparel, seragam, dan pakaian kerja.',
    explorerContribution: 'Mendukung kebutuhan apparel dan pakaian kerja organisasi dan aktivitas profesional.',
    explorerFocus: ['Apparel', 'Uniform', 'Workwear'],
    explorerServices: ['Apparel', 'Uniform', 'Workwear', 'Custom Apparel'],
    explorerRole: 'Bikin Indonesia Berdaya berperan sebagai bagian pendukung kebutuhan organisasi dalam ekosistem.',
    explorerCtaUrl: 'https://bikin.co/',
  },
  {
    id: '6',
    name: 'Bangsap: Bangun Strategi & Perspektif',
    slug: 'bangsap',
    logoUrl: undefined,
    short_description: 'Platform media dan edukasi lingkungan melalui konten, diskusi, dan podcast.',
    explorerCategory: 'Media, Edukasi Lingkungan & Podcast',
    explorerDescription:
      'Bangsap adalah platform media dan edukasi lingkungan yang mengemas isu lingkungan dengan cara ringan, kritis, dan relevan.',
    explorerContribution: 'Menghubungkan fakta dan data lingkungan dengan masyarakat melalui konten, diskusi, dan podcast.',
    explorerFocus: ['Media', 'Edukasi Lingkungan', 'Podcast'],
    explorerServices: ['Konten Media', 'Edukasi Lingkungan', 'Podcast & Diskusi'],
    explorerRole: 'Bangsap berperan sebagai kanal media dan edukasi dalam ekosistem.',
    explorerCtaUrl: undefined,
    socialYoutubeUrl: 'https://www.youtube.com/@Bangsap.Podcast',
    socialTiktokUrl: 'https://www.tiktok.com/@abangsap_',
  },
];

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
  // Section 2's ecosystem diagram deliberately excludes Bangsap (see
  // getPublishedCoreEntities in src/lib/cms/entities.ts) — mirrored here
  // the same way the real function derives it, so this mock can't drift
  // out of sync with ENTITIES above.
  getPublishedCoreEntities: vi.fn().mockResolvedValue(ENTITIES.filter((e) => e.slug !== 'bangsap')),
}));

const { default: BisnisLayananPage } = await import('./page');

const renderPage = () => BisnisLayananPage();

describe('BisnisLayananPage', () => {
  it('Section 1 shows the hero heading and the exact given copy', async () => {
    render(await renderPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Bisnis & Ekosistem Environesia' })).toBeInTheDocument();
    expect(
      screen.getByText(/Environesia tumbuh dari satu perusahaan konsultansi lingkungan/)
    ).toBeInTheDocument();
  });

  it('Section 2 shows the verbatim ecosystem copy and every real entity in the ecosystem map', async () => {
    render(await renderPage());

    expect(
      screen.getByRole('heading', { level: 2, name: 'Ekosistem Hijau Terintegrasi Berstandar Global' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Environesia memulai perjalanan di Yogyakarta pada 2016/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Environesia menjadi sebuah ekosistem yang menghubungkan berbagai keahlian dan bidang usaha dalam satu grup.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Kami percaya pertumbuhan bukan hanya tentang menjadi lebih besar, tetapi tentang menjadi lebih lengkap dalam memberikan nilai.'
      )
    ).toBeInTheDocument();

    // The full Environesia wordmark+tagline lockup (the tagline is baked
    // into the asset itself, never typed as separate text) is the central
    // hub, and every real entity (never a fabricated brand) appears as its
    // own node around it.
    expect(
      screen.getByRole('img', { name: 'Environesia — The World-Class Integrated Green Ecosystem' })
    ).toHaveAttribute('src', expect.stringContaining('environesia-wordmark.png'));
    expect(screen.getByRole('img', { name: 'Environesia' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'GreenLab' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'GreenSkill' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'LSP Praktisi Lingkungan Indonesia' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Bikin Indonesia Berdaya' })).toBeInTheDocument();
  });

  it('Section 3 shows the editorial 50/50 layout: a left-aligned section heading, one real brand at a time on the right, selectable by click, with a CTA to each real external site', async () => {
    const user = userEvent.setup();
    render(await renderPage());

    const heading = screen.getByRole('heading', { level: 2, name: 'Kenali Perusahaan dalam Ekosistem Kami' });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Pilih perusahaan yang ingin Anda kenali lebih dekat.')).toBeInTheDocument();
    // Left-aligned per the redesign brief, never the old centered layout.
    expect(heading.closest('div')).toHaveClass('text-left');

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia' });

    // Exactly the five real companies are reachable, Environesia (the
    // consulting entity) among them.
    expect(within(exhibition).getByRole('button', { name: 'Pilih Environesia' })).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenLab' })).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenSkill' })).toBeInTheDocument();
    expect(
      within(exhibition).getByRole('button', { name: 'Pilih LSP Praktisi Lingkungan Indonesia' })
    ).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih Bikin Indonesia Berdaya' })).toBeInTheDocument();

    // A screen-reader-only list keeps every brand's real external site
    // reachable regardless of JS/motion support.
    expect(within(exhibition).getByRole('link', { name: 'GreenLab' })).toHaveAttribute(
      'href',
      'https://greenlab.co.id/'
    );

    // Environesia is the only one shown by default (one brand, one focus).
    // The right-hand information column carries its category/focus, role,
    // and contribution — nothing dropped from the data the old layout
    // also showed.
    const nameHeading = screen.getByRole('heading', { level: 3, name: 'Environesia' });
    expect(nameHeading).toBeInTheDocument();
    // The logo sits beside the name, in the same header row — not below it.
    const headerRow = nameHeading.closest('div');
    expect(within(headerRow!).getByRole('img', { name: 'Logo Environesia' })).toBeInTheDocument();
    expect(screen.getByText('Environmental Consulting & Sustainability')).toBeInTheDocument();
    expect(
      screen.getByText('Environesia berfokus pada konsultansi dan pendampingan lingkungan.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Membantu organisasi memahami dan mengelola kebutuhan lingkungan.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Environesia menjadi bagian yang berfokus pada konsultansi dan pendampingan lingkungan.')
    ).toBeInTheDocument();
    expect(within(exhibition).getByText('Consulting')).toBeInTheDocument();

    // The two profile cards are swapped from the previous pass: Peran &
    // Kontribusi now comes first (left), Fokus & Kategori second (right).
    const cardLabels = within(exhibition)
      .getAllByText(/^(Peran & Kontribusi|Fokus & Kategori)$/)
      .map((el) => el.textContent);
    expect(cardLabels).toEqual(['Peran & Kontribusi', 'Fokus & Kategori']);

    // "Layanan Utama" (the services icon list) was retired in favor of the
    // Fokus & Kategori card — it no longer renders anywhere in the section.
    expect(within(exhibition).queryByText('Layanan Utama')).not.toBeInTheDocument();

    // Selecting GreenLab swaps the whole right column to its own real
    // category and a CTA straight to its real site.
    await user.click(within(exhibition).getByRole('button', { name: 'Pilih GreenLab' }));
    expect(window.location.hash).toBe('#greenlab');
    expect(screen.getByRole('heading', { level: 3, name: 'GreenLab' })).toBeInTheDocument();
    expect(screen.getByText('Environmental Laboratory & Testing')).toBeInTheDocument();
    const greenLabCta = screen.getByRole('link', { name: /Kunjungi GreenLab/ });
    expect(greenLabCta).toHaveAttribute('href', 'https://greenlab.co.id/');
    expect(greenLabCta).toHaveAttribute('target', '_blank');
    expect(greenLabCta).toHaveAttribute('rel', 'noopener noreferrer');

    window.location.hash = '';
  });

  it('Section 3 always shows the Galeri carousel, padded with branded placeholders for a brand with no published scenes yet', async () => {
    render(await renderPage());

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia' });
    // The mocked entities module carries no story-scene data, so every
    // brand's "Galeri" block shows 6 on-brand placeholder slots rather
    // than being hidden or filling in a random/stock photo.
    expect(within(exhibition).getByText('Galeri Environesia')).toBeInTheDocument();
    expect(within(exhibition).getAllByText('Foto segera hadir')).toHaveLength(1);
    expect(within(exhibition).getAllByRole('button', { name: /^Slot foto \d — belum tersedia$/ })).toHaveLength(6);
  });

  it('has no Reset View control and never stops being navigable across repeated selections', async () => {
    const user = userEvent.setup();
    render(await renderPage());

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia' });
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();

    await user.click(within(exhibition).getByRole('button', { name: 'Pilih Bikin Indonesia Berdaya' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Bikin Indonesia Berdaya' })).toBeInTheDocument();

    // Navigation never becomes non-interactive — previous/next and direct
    // selection all keep working across repeated brand changes.
    await user.click(within(exhibition).getByRole('button', { name: 'Perusahaan sebelumnya' }));
    expect(screen.getByRole('heading', { level: 3, name: 'LSP Praktisi Lingkungan Indonesia' })).toBeInTheDocument();

    await user.click(within(exhibition).getByRole('button', { name: 'Pilih Environesia' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Environesia' })).toBeInTheDocument();

    await user.click(within(exhibition).getByRole('button', { name: 'Perusahaan berikutnya' }));
    expect(screen.getByRole('heading', { level: 3, name: 'GreenLab' })).toBeInTheDocument();

    window.location.hash = '';
  });

  it('lands with the right brand already selected when the URL carries that brand\'s hash (a nav menu deep link)', async () => {
    // Simulates clicking "GreenSkill" from the header/footer, whose
    // navigation item now points to /bisnis-layanan#greenskill instead of
    // a dedicated per-brand page.
    window.location.hash = '#greenskill';

    render(await renderPage());

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia' });
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenSkill' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('heading', { level: 3, name: 'GreenSkill' })).toBeInTheDocument();
    expect(screen.getByText('Training & Professional Development')).toBeInTheDocument();

    window.location.hash = '';
  });
});

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const ENTITIES = [
  {
    id: '1',
    name: 'Environesia',
    slug: 'environesia',
    logoUrl: '/brand/entitas-environesia.png',
    short_description: 'Konsultansi lingkungan Environesia.',
  },
  {
    id: '2',
    name: 'GreenLab',
    slug: 'greenlab',
    logoUrl: '/brand/entitas-greenlab.png',
    short_description: 'Laboratorium pengujian GreenLab.',
  },
  {
    id: '3',
    name: 'GreenSkill',
    slug: 'greenskill',
    logoUrl: '/brand/entitas-greenskill.png',
    short_description: 'Pelatihan dan sertifikasi GreenSkill.',
  },
  {
    id: '4',
    name: 'LSP Praktisi Lingkungan Indonesia',
    slug: 'lsp-praktisi-lingkungan',
    logoUrl: '/brand/entitas-lsp-praktisi-lingkungan.png',
    short_description: 'Lembaga sertifikasi profesi lingkungan.',
  },
  {
    id: '5',
    name: 'Bikin Indonesia Berdaya',
    slug: 'bikin-indonesia-berdaya',
    logoUrl: '/brand/entitas-bikin-indonesia-berdaya.png',
    short_description: 'Apparel dan produksi Bikin Indonesia Berdaya.',
  },
];

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

const { default: BisnisLayananPage } = await import('./page');

const renderPage = () => BisnisLayananPage();

describe('BisnisLayananPage', () => {
  it('Section 1 shows the hero heading and the exact given copy', async () => {
    render(await renderPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Bisnis & Ekosistem Environesia' })).toBeInTheDocument();
    expect(
      screen.getByText(/Environesia Group tumbuh dari satu perusahaan konsultansi lingkungan/)
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
        'Environesia Company Group menjadi sebuah ekosistem yang menghubungkan berbagai keahlian dan bidang usaha dalam satu grup.'
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

  it('Section 3 shows the growing-ecosystem heading, intro, and every ecosystem point verbatim', async () => {
    render(await renderPage());

    expect(screen.getByRole('heading', { level: 2, name: 'Ekosistem yang Terus Bertumbuh' })).toBeInTheDocument();
    expect(
      screen.getByText(/Setiap perusahaan di dalam Environesia memiliki keahlian dan fokusnya sendiri/)
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Tim Environesia Company Group' })).toHaveAttribute(
      'src',
      expect.stringContaining('ekosistgrup.png')
    );

    // Five visual capability cards, each named to its real associated
    // brand (or, for Media & Edukasi, labeled as a shared ecosystem
    // capability rather than an invented company).
    expect(screen.getByRole('heading', { level: 3, name: 'Konsultansi & Lingkungan' })).toBeInTheDocument();
    expect(
      screen.getByText(/Mendampingi kebutuhan pengelolaan, kajian, kepatuhan, dan pengembangan lingkungan/)
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Laboratorium & Pengujian' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Kompetensi & Sertifikasi' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Apparel & Seragam' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Media & Edukasi' })).toBeInTheDocument();
    expect(
      screen.getByText(/Mengembangkan media edukasi lingkungan bersama praktisi, akademisi/)
    ).toBeInTheDocument();
    expect(screen.getByText('GreenSkill + LSP Praktisi Lingkungan Indonesia')).toBeInTheDocument();
    expect(screen.getByText('Kapabilitas Ekosistem')).toBeInTheDocument();
  });

  it('Section 4 shows one real brand at a time as a premium showcase, selectable by click, with a CTA to each real external site', async () => {
    const user = userEvent.setup();
    render(await renderPage());

    expect(
      screen.getByRole('heading', { level: 2, name: 'Kenali Perusahaan dalam Ekosistem Kami' })
    ).toBeInTheDocument();
    expect(screen.getByText('Pilih perusahaan yang ingin Anda kenali lebih dekat.')).toBeInTheDocument();

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia Group' });

    // Exactly the five real companies are reachable — Environesia Group
    // itself is deliberately not one of the choices here.
    expect(within(exhibition).getByRole('button', { name: 'Pilih Environesia' })).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenLab' })).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenSkill' })).toBeInTheDocument();
    expect(
      within(exhibition).getByRole('button', { name: 'Pilih LSP Praktisi Lingkungan Indonesia' })
    ).toBeInTheDocument();
    expect(within(exhibition).getByRole('button', { name: 'Pilih Bikin Indonesia Berdaya' })).toBeInTheDocument();
    expect(within(exhibition).queryByRole('button', { name: 'Pilih Environesia Group' })).not.toBeInTheDocument();

    // A screen-reader-only list keeps every brand's real external site
    // reachable regardless of JS/motion support.
    expect(within(exhibition).getByRole('link', { name: 'GreenLab' })).toHaveAttribute(
      'href',
      'https://greenlab.co.id/'
    );

    // Environesia is the only one shown by default (one brand, one focus);
    // selecting GreenLab replaces it with GreenLab's own real category,
    // services, and a CTA straight to its real site.
    expect(screen.getByRole('heading', { level: 3, name: 'Environesia' })).toBeInTheDocument();

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

  it('has no Reset View control and never stops being navigable across repeated selections', async () => {
    const user = userEvent.setup();
    render(await renderPage());

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia Group' });
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

    const exhibition = screen.getByRole('group', { name: 'Jelajahi perusahaan dalam Environesia Group' });
    expect(within(exhibition).getByRole('button', { name: 'Pilih GreenSkill' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('heading', { level: 3, name: 'GreenSkill' })).toBeInTheDocument();
    expect(screen.getByText('Training & Professional Development')).toBeInTheDocument();

    window.location.hash = '';
  });
});

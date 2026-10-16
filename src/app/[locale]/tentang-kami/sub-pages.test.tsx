import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';
import { makeMilestone } from '@/lib/cms/fixtures';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/cms/legalitas-page', () => ({ getLegalitasPage: vi.fn().mockResolvedValue({ title: 'Legalitas & Sertifikasi', description: '', noteLabel: 'Legal Entity First', noteText: '', metaTitle: 'Legalitas & Sertifikasi', metaDescription: '' }) }));
vi.mock('@/lib/cms/penghargaan', () => ({ getPenghargaan: vi.fn().mockResolvedValue({ title: 'Penghargaan', description: '', metaTitle: 'Penghargaan', metaDescription: '' }) }));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));
vi.mock('@/lib/cms/leadership-profile', async () => {
  const actual = await vi.importActual<typeof import('@/lib/cms/leadership-profile')>('@/lib/cms/leadership-profile');
  return { ...actual, getDirektur: vi.fn().mockResolvedValue(actual.buildDirektur([], new Map(), null)) };
});
vi.mock('@/lib/cms/struktur-organisasi', async () => {
  const { STRUKTUR_FALLBACK } = await import('@/lib/cms/struktur-organisasi-content');
  return {
    getStruktur: vi.fn().mockResolvedValue({ title: STRUKTUR_FALLBACK.title, imageSrc: null, imageAlt: STRUKTUR_FALLBACK.imageAlt }),
  };
});
vi.mock('@/lib/cms/visi-misi', async () => {
  const { VISI_MISI_FALLBACK } = await import('@/lib/cms/visi-misi-content');
  return { getVisiMisi: vi.fn().mockResolvedValue(VISI_MISI_FALLBACK) };
});
vi.mock('@/lib/cms/sejarah', async () => {
  const { SEJARAH_FALLBACK } = await import('@/lib/cms/sejarah-content');
  return { getSejarah: vi.fn().mockResolvedValue({ ...SEJARAH_FALLBACK, photos: [null, null] }) };
});
vi.mock('@/lib/cms/makna-logo', () => ({
  getMaknaLogo: vi.fn().mockResolvedValue({
    eyebrow: 'Identitas Visual',
    title: 'Makna Logo',
    parts: [
      { label: 'Simbol', description: '' },
      { label: 'Tipografi', description: '' },
      { label: 'Warna', description: '' },
      { label: 'Kesatuan Identitas', description: '' },
    ],
    symbolSrc: null,
    wordmarkSrc: null,
  }),
}));
vi.mock('@/lib/cms/legal', async () => {
  // The page reads the database; the test uses the same data the fallback serves.
  const data = await vi.importActual<typeof import('@/lib/legalitas-data')>('@/lib/legalitas-data');
  return { getLegalEntities: async () => data.LEGALITAS_ENTITIES };
});

let mockPathname = '/id/tentang-kami/sejarah';
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

vi.mock('@/lib/cms/settings', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    site_name: 'Environesia',
    logoUrl: 'https://example.com/logo.png',
  }),
}));

vi.mock('@/lib/cms/milestones', () => ({
  getPublishedMilestones: vi.fn().mockResolvedValue([
    makeMilestone({ year: 2016, title: 'Environesia didirikan', description: 'Awal perjalanan grup.', sort_order: 1 }),
  ]),
}));

vi.mock('@/lib/cms/leadership', () => ({
  getPublishedLeadership: vi.fn().mockResolvedValue([]),
}));

const { default: SejarahPage } = await import('./(tabs)/sejarah/page');
const { default: VisiMisiTataNilaiPage } = await import('./(tabs)/visi-misi-tatanilai/page');
const { default: StrukturOrganisasiPage } = await import('./(tabs)/struktur-organisasi/page');
const { default: DirekturPage } = await import('./(tabs)/direktur/page');
const { default: PenghargaanPage } = await import('./(tabs)/penghargaan/page');
const { default: LegalitasPage } = await import('./(tabs)/legalitas/page');
const { default: GreenBusinessPage } = await import('./green-business/page');

const params = Promise.resolve({ locale: 'id' });

describe('Tentang Kami sub-pages', () => {
  it('Perjalanan Kami renders the real timeline, not the generic pending stub', async () => {
    mockPathname = '/id/tentang-kami/sejarah';
    render(await SejarahPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Satu Dekade Environesia' })).toBeInTheDocument();
    // The title and full description are both always-visible plain text
    // on the timeline node itself — no expand/collapse toggle to click
    // through, no modal.
    expect(screen.getByText('Environesia didirikan')).toBeInTheDocument();
    expect(screen.getByText('Awal perjalanan grup.')).toBeInTheDocument();
    expect(screen.getByText('2016')).toBeInTheDocument();
    expect(screen.getByText('Sekilas Environesia')).toBeInTheDocument();
    // "Milestone Perjalanan" was removed deliberately — its real dates
    // duplicated both the narrative above and the timeline below it.
    expect(screen.queryByText('Milestone Perjalanan')).not.toBeInTheDocument();
    expect(screen.queryByText('Konten halaman ini sedang disiapkan.')).not.toBeInTheDocument();
  });

  it('Visi, Misi & Komitmen renders the real Visi/Misi/Komitmen copy as plain editorial typography, not the old Tata Nilai list', async () => {
    mockPathname = '/id/tentang-kami/visi-misi-tatanilai';
    const { container } = render(await VisiMisiTataNilaiPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Visi, Misi & Komitmen' })).toBeInTheDocument();
    // "di Indonesia" is its own `<span>` (it carries a constant accent
    // color), so it's asserted directly; the rest of the headline is one
    // plain text node next to it, checked via the container's full text
    // rather than `getByText` (which doesn't match text split across
    // sibling elements).
    expect(screen.getByText('di Indonesia')).toBeInTheDocument();
    expect(container.textContent).toContain('Menjadi Perusahaan Ekosistem Lingkungan Terintegrasi Berkelas Dunia di Indonesia');
    expect(container.textContent).toContain('Misi kami memberikan pelayanan terbaik');
    expect(screen.getByText('Integritas dalam setiap keputusan')).toBeInTheDocument();
    expect(screen.getByText('Peduli terhadap lingkungan')).toBeInTheDocument();
    expect(screen.getByText('Keselamatan sebagai bagian dari pekerjaan')).toBeInTheDocument();
    expect(screen.getByText('Bertanggung jawab terhadap hasil')).toBeInTheDocument();
    // The old Tata Nilai list is gone for good.
    expect(screen.queryByText('Tata Nilai')).not.toBeInTheDocument();
  });

  it('frames Struktur Organisasi as the group ecosystem, with the real structure chart as its visual', async () => {
    mockPathname = '/id/tentang-kami/struktur-organisasi';
    render(await StrukturOrganisasiPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Environesia' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Struktur Organisasi dan Tata Kerja PT Environesia Global Saraya' })
    ).toBeInTheDocument();
  });

  it('Direktur Utama page separates the Direktur Utama from Dewan Direksi, real photos and names, no fabricated bios', async () => {
    mockPathname = '/id/tentang-kami/direktur';
    render(await DirekturPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Direktur Utama & Dewan Direksi' })).toBeInTheDocument();

    // Direktur Utama and Dewan Direksi are two distinct sections, not one
    // shared grid — each with its own heading.
    expect(screen.getByRole('heading', { level: 2, name: 'Direktur Utama' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Dewan Direksi' })).toBeInTheDocument();

    expect(screen.getByText('Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.')).toBeInTheDocument();
    expect(screen.getByText('Director Environesia')).toBeInTheDocument();
    expect(screen.getByText('Nurul Lahtifah, S.T.')).toBeInTheDocument();
    expect(screen.getByText('Director Corporate Services and Innovation')).toBeInTheDocument();
    expect(screen.getByText('Yusuf Wiryawan, S.T.M.Ling.M.T.')).toBeInTheDocument();
    expect(screen.getByText('Director of Operational')).toBeInTheDocument();
    expect(screen.getByText('Ir. Ariyan Eka Putra, S.T.M.T.')).toBeInTheDocument();
    expect(screen.getByText('Director Business Development')).toBeInTheDocument();

    // Every profile — Direktur Utama, the 3 Dewan Direksi, and Fauzan Madani
    // (Leadership Entitas Grup) — opens its detail through "Lihat Profil
    // Lengkap", never a second "Peran" label restating the jabatan already
    // shown.
    expect(screen.getAllByRole('button', { name: /Lihat Profil Lengkap/ })).toHaveLength(5);
    expect(screen.queryByText('Peran')).not.toBeInTheDocument();

    // The credential-breakdown table (S.T. = Sarjana Teknik, etc.) and
    // the old standalone subtitle line are gone — the full credential
    // string lives in the name itself now, nothing else.
    expect(screen.queryByText('Sarjana Teknik')).not.toBeInTheDocument();
    expect(screen.queryByText('Direktur Utama PT Environesia Global Saraya')).not.toBeInTheDocument();
  });

  it('Direktur Utama "Lihat Profil Lengkap" opens a centered modal dialog, not a side panel, with his real Pendidikan/Pengalaman/Kontribusi', async () => {
    mockPathname = '/id/tentang-kami/direktur';
    render(await DirekturPage({ params }));

    const user = userEvent.setup();
    const [firstButton] = screen.getAllByRole('button', { name: /Lihat Profil Lengkap/ });
    await user.click(firstButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.');
    expect(dialog).toHaveTextContent('Universitas Gadjah Mada (UGM)');
    expect(dialog).toHaveTextContent('1.000+');
    expect(dialog).toHaveTextContent('Kontribusi Profesional');
    expect(dialog).toHaveTextContent('Dosen Praktisi');
    // No CV-style skills section and no explanation of what a credential
    // abbreviation stands for.
    expect(screen.queryByText('Keahlian')).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Dewan Direksi "Lihat Profil Lengkap" shows an honest empty state — no data has been provided for them yet', async () => {
    mockPathname = '/id/tentang-kami/direktur';
    render(await DirekturPage({ params }));

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /Lihat Profil Lengkap/ });
    await user.click(buttons[1]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Nurul Lahtifah, S.T.');
    expect(dialog).toHaveTextContent('Profil lengkap akan segera hadir.');
  });

  it('Leadership Entitas Grup shows Fauzan Madani separately from Dewan Direksi, never labeled a Director of Environesia', async () => {
    mockPathname = '/id/tentang-kami/direktur';
    render(await DirekturPage({ params }));

    expect(screen.getByRole('heading', { level: 2, name: 'Leadership Entitas Grup' })).toBeInTheDocument();
    expect(
      screen.getByText('Kepemimpinan pada entitas yang menjadi bagian dari Environesia.')
    ).toBeInTheDocument();

    expect(screen.getAllByText('Bikin Indonesia Berdaya').length).toBeGreaterThan(0);
    expect(screen.getByText('Fauzan Madani')).toBeInTheDocument();
    // His jabatan is the plain "Direktur" of his own entity — never the
    // "Director Environesia" label used for Saprian above.
    expect(screen.getByText('Direktur')).toBeInTheDocument();

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /Lihat Profil Lengkap/ });
    await user.click(buttons[buttons.length - 1]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Fauzan Madani');
    expect(dialog).toHaveTextContent('Direktur');
    expect(dialog).toHaveTextContent('Bikin Indonesia Berdaya');
    expect(dialog).toHaveTextContent('Profil lengkap akan segera hadir.');
  });

  it('Penghargaan shows an honest empty state, never a fabricated award', async () => {
    mockPathname = '/id/tentang-kami/penghargaan';
    render(await PenghargaanPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Penghargaan' })).toBeInTheDocument();
    expect(screen.getByText('Penghargaan dan pencapaian akan ditampilkan di sini')).toBeInTheDocument();
  });

  it('Legalitas & Sertifikasi shows one unified credentials grid, entity-labeled per card, no filters or counters', async () => {
    mockPathname = '/id/tentang-kami/legalitas';
    render(await LegalitasPage({ params }));

    expect(screen.getByRole('heading', { level: 1, name: 'Legalitas & Sertifikasi' })).toBeInTheDocument();

    // Both entities' credentials render together, by default, in one grid —
    // never behind a tab, filter chip, or search the user has to use first.
    expect(screen.getAllByText('Environesia Global Saraya').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Greenlab Indonesia').length).toBeGreaterThan(0);
    expect(screen.getByText('Akte Pendirian Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('Nomor: 1 · Tanggal: 3 Mei 2016')).toBeInTheDocument();
    expect(screen.getByText('Notaris: Asnahwati H. Herwidhi, S.H')).toBeInTheDocument();
    expect(screen.getByText('Akta Pendirian Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('www.greenlab.co.id')).toBeInTheDocument();

    // No filter chips, no search box, no credential/entity counter.
    expect(screen.queryByRole('button', { name: 'Semua' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Greenlab' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Akta & AHU' })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Cari legalitas/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Credentials ·/)).not.toBeInTheDocument();

    // Documents from the same issuer are grouped into one large card
    // (title shown once), not one tiny card per document number.
    expect(screen.getByText('AHU & Kekayaan Intelektual')).toBeInTheDocument();
    expect(screen.getByText('Kep. Menkumham Akta Perubahan Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('Keputusan Menkumham Akta Pendirian Perusahaan')).toBeInTheDocument();
    expect(screen.getByText('Direktorat Jenderal Kekayaan Intelektual')).toBeInTheDocument();

    // CSMS shows its category as a small accent label and never a
    // "Notaris" field, which isn't relevant to this document type.
    expect(screen.getByText('RISIKO EKSTRIM')).toBeInTheDocument();
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
    const csmsDocument = screen.getByText('Contractor Safety Management System (CSMS)').closest('div');
    expect(csmsDocument).not.toHaveTextContent('Notaris');

    // A long description (KAN's) is clamped on the card with a "Lihat
    // Detail" button; a short description (an ISO standard's) is not.
    expect(screen.getByRole('button', { name: /Lihat Detail — Laboratorium Terakreditasi/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Lihat Detail — ISO 9001:2015/ })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Lihat Detail — Laboratorium Terakreditasi/ }));
    const detailDialog = screen.getByRole('dialog');
    expect(detailDialog).toHaveTextContent('Komite Akreditasi Nasional');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // The KAN accreditation file-preview CTA is built but stays hidden — no
    // local file exists for it yet, and the rule is no CTA without a real
    // file.
    expect(screen.queryByRole('button', { name: /Cek Sertifikat Akreditasi KAN/ })).not.toBeInTheDocument();

    // The BSI ISO CTA is a real, given external verification link, opened
    // in a new tab rather than the local-file preview modal.
    const bsiLink = screen.getByRole('link', { name: /Cek Sertifikat ISO BSI/ });
    expect(bsiLink).toHaveAttribute(
      'href',
      'https://www.bsigroup.com/en-GB/products-and-services/assessment-and-certification/validation-and-verification/client-directory-profile/PT_GRE-0047708467-000'
    );
    expect(bsiLink).toHaveAttribute('target', '_blank');

    // Never claims a document is "valid"/"aktif"/"terverifikasi" — that
    // status was never given as real data.
    expect(screen.queryByText(/masih berlaku/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/terverifikasi/i)).not.toBeInTheDocument();

    // The trust note clarifies documents are entity-scoped, not group-wide.
    expect(screen.getByText('Legal Entity First')).toBeInTheDocument();
  });

  it('Green Business stays reachable but is not part of the tab system', async () => {
    render(await GreenBusinessPage({ params }));
    expect(screen.getByRole('heading', { level: 1, name: 'Green Business' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Navigasi Tentang Kami' })).not.toBeInTheDocument();
  });
});

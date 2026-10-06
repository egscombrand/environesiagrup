// Single source of truth for the Tentang Kami tab system — the sub-nav
// shown on the landing page and these 6 sub-pages, the sitemap, and each
// page's own metadata, so a label/order change lands in one place rather
// than three. Order here is deliberate: journey → principles → structure →
// leadership → recognition → legal standing.
//
// Makna Logo is deliberately NOT in this list — it's an embedded section on
// the landing page itself, not a tab in this system (its own standalone
// route still exists at /tentang-kami/makna-logo for the main site header's
// dropdown, it just isn't part of this registry).
export type TentangKamiRoute = {
  slug: string;
  label: string;
  deskripsi: string;
  metaDescription: string;
};

export const TENTANG_KAMI_ROUTES: readonly TentangKamiRoute[] = [
  {
    slug: 'sejarah',
    label: 'Perjalanan Kami',
    deskripsi: 'Perjalanan grup dari tahun ke tahun.',
    metaDescription: 'Perjalanan Environesia Group dari tahun ke tahun.',
  },
  {
    slug: 'visi-misi-tatanilai',
    label: 'Visi, Misi & Tata Nilai',
    deskripsi: 'Arah dan prinsip kerja jangka panjang.',
    metaDescription: 'Visi, misi, dan tata nilai Environesia Group.',
  },
  {
    slug: 'struktur-organisasi',
    label: 'Struktur Organisasi',
    deskripsi: 'Susunan grup dan entitas di bawahnya.',
    metaDescription: 'Susunan Environesia Group dan entitas di bawahnya.',
  },
  {
    slug: 'direktur',
    label: 'Direktur Utama & Dewan Direksi',
    deskripsi: 'Pimpinan yang mengarahkan grup.',
    metaDescription: 'Direktur Utama dan Dewan Direksi Environesia Group.',
  },
  {
    slug: 'penghargaan',
    label: 'Penghargaan',
    deskripsi: 'Pengakuan dan apresiasi untuk grup.',
    metaDescription: 'Pengakuan dan apresiasi untuk Environesia Group.',
  },
  {
    slug: 'legalitas',
    label: 'Legalitas & Sertifikasi',
    deskripsi:
      'Legalitas, perizinan, sertifikasi, dan akreditasi yang mendukung operasional setiap entitas dalam Environesia Company Group.',
    metaDescription: 'Legalitas, perizinan, sertifikasi, dan akreditasi setiap entitas Environesia Company Group.',
  },
] as const;

export function findTentangKamiRoute(slug: string): TentangKamiRoute {
  const route = TENTANG_KAMI_ROUTES.find((candidate) => candidate.slug === slug);

  if (!route) {
    throw new Error(`Unknown tentang-kami route: ${slug}`);
  }

  return route;
}

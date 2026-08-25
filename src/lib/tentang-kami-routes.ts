// Single source of truth for the /tentang-kami sub-pages. Consumed by the
// sitemap, the section overview page, and each scaffold's own metadata, so a
// label or description change lands in one place rather than three.
export type TentangKamiRoute = {
  slug: string;
  label: string;
  deskripsi: string;
  metaDescription: string;
};

export const TENTANG_KAMI_ROUTES: readonly TentangKamiRoute[] = [
  {
    slug: 'sejarah',
    label: 'Sejarah',
    deskripsi: 'Perjalanan grup dari tahun ke tahun.',
    metaDescription: 'Perjalanan Environesia Company Group dari tahun ke tahun.',
  },
  {
    slug: 'visi-misi',
    label: 'Visi & Misi',
    deskripsi: 'Arah dan komitmen jangka panjang.',
    metaDescription: 'Arah dan komitmen jangka panjang Environesia Company Group.',
  },
  {
    slug: 'makna-logo',
    label: 'Makna Logo',
    deskripsi: 'Filosofi di balik identitas visual grup.',
    metaDescription: 'Filosofi di balik identitas visual Environesia Company Group.',
  },
  {
    slug: 'struktur-organisasi',
    label: 'Struktur Organisasi',
    deskripsi: 'Susunan organisasi grup.',
    metaDescription: 'Susunan Environesia Company Group dan entitas di bawahnya.',
  },
  {
    slug: 'green-business',
    label: 'Green Business',
    deskripsi: 'Manifesto keberlanjutan grup.',
    metaDescription: 'Manifesto keberlanjutan Environesia Company Group.',
  },
  {
    slug: 'penghargaan',
    label: 'Penghargaan',
    deskripsi: 'Pengakuan dan apresiasi untuk grup.',
    metaDescription: 'Pengakuan dan apresiasi untuk Environesia Company Group.',
  },
] as const;

export function findTentangKamiRoute(slug: string): TentangKamiRoute {
  const route = TENTANG_KAMI_ROUTES.find((candidate) => candidate.slug === slug);

  if (!route) {
    throw new Error(`Unknown tentang-kami route: ${slug}`);
  }

  return route;
}

// Single source of truth for the Proyek & Insight tab system — the sub-nav,
// each tab's own route, the hero's per-tab heading, and each page's own
// metadata — mirrors src/lib/tentang-kami-routes.ts exactly, same reasoning:
// one place for a label/order change instead of several. Four tabs: Siaran
// Pers lists press clippings (external media coverage), Berita Perusahaan
// lists self-authored company news — two distinct content types, each with
// its own admin editor (see src/lib/admin/resources/siaran-pers.ts and
// berita-perusahaan.ts), never the other's articles.
export type ProyekInsightRoute = {
  slug: string;
  label: string;
  heroSubheading: string;
  metaDescription: string;
};

export const PROYEK_INSIGHT_ROUTES: readonly ProyekInsightRoute[] = [
  {
    slug: 'portofolio-proyek',
    label: 'Portofolio Proyek',
    heroSubheading: 'Lebih dari 1.000 Proyek, Beragam Sektor dan Wilayah',
    metaDescription: 'Rekam jejak proyek Environesia di berbagai sektor dan wilayah.',
  },
  {
    slug: 'klien-mitra',
    label: 'Klien & Mitra',
    heroSubheading: 'Dipercaya oleh Klien Korporat dan Instansi Pemerintah',
    metaDescription: 'Klien dan mitra yang telah bekerja sama dengan Environesia.',
  },
  {
    slug: 'berita-perusahaan',
    label: 'Berita Perusahaan',
    heroSubheading: 'Kabar, kegiatan, pencapaian, dan informasi resmi terbaru dari Environesia.',
    metaDescription: 'Kabar, kegiatan, pencapaian, dan informasi resmi terbaru dari Environesia.',
  },
  {
    slug: 'siaran-pers',
    label: 'Siaran Pers',
    heroSubheading: 'Seluruh Kabar, Siaran Pers, dan Informasi Resmi Environesia',
    metaDescription: 'Seluruh kabar dan siaran pers resmi dari Environesia.',
  },
] as const;

export function findProyekInsightRoute(slug: string): ProyekInsightRoute {
  const route = PROYEK_INSIGHT_ROUTES.find((candidate) => candidate.slug === slug);

  if (!route) {
    throw new Error(`Unknown proyek-insight route: ${slug}`);
  }

  return route;
}

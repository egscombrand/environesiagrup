/**
 * The Legalitas & Sertifikasi tab's own text: its heading, lead paragraph, and
 * the closing "Legal Entity First" note. The entities, cards, and documents
 * themselves are read separately, by src/lib/cms/legal.ts.
 */
export type LegalitasPageContent = {
  title: string;
  description: string;
  noteLabel: string;
  noteText: string;
  metaTitle: string;
  metaDescription: string;
};

export const LEGALITAS_PAGE_FALLBACK: LegalitasPageContent = {
  title: 'Legalitas & Sertifikasi',
  description:
    'Legalitas, perizinan, sertifikasi, dan akreditasi yang mendukung operasional setiap entitas dalam Environesia.',
  noteLabel: 'Legal Entity First',
  noteText:
    'Dokumen pada halaman ini ditampilkan berdasarkan entitas pemiliknya. Legalitas, perizinan, sertifikasi, dan akreditasi dapat berbeda sesuai badan hukum, bidang kegiatan, dan ruang lingkup operasional masing-masing entitas.',
  metaTitle: 'Legalitas & Sertifikasi',
  metaDescription: 'Legalitas, perizinan, sertifikasi, dan akreditasi setiap entitas Environesia.',
};

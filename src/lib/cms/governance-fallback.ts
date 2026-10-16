import { LEGACY_MEDIA } from './legacy-media';

/**
 * The Tata Kelola & Keberlanjutan copy as it was hardcoded in the components,
 * kept as the fallback. The site shows the database rows (migrations 0029 and
 * 0030) when they exist and this copy when they do not, so nothing changes for
 * a visitor until the rows are seeded and checked in wp-admin.
 *
 * Do not delete this file once the content is live. A missing database row or
 * an empty field falls back to these values, and that is what keeps the page
 * showing text when the database is unreachable.
 *
 * Only Indonesian is written here. The English and Chinese translations come
 * from the `_en` and `_zh` columns, and when those are empty the reader falls
 * back to the Indonesian text below.
 */

export type GovernanceItem = { label?: string; title: string; description: string };
export type GovernanceStep = { label: string; description?: string };

export type GovernancePageSlug =
  | 'tata-kelola'
  | 'kode-etik'
  | 'kebijakan'
  | 'manajemen-risiko'
  | 'nilai-budaya'
  | 'keberlanjutan'
  | 'dampak';

export type GovernanceBlock = {
  eyebrow: string | null;
  title: string;
  description: string | null;
  items: GovernanceItem[];
  steps: GovernanceStep[];
  tags: string[];
  extraLabel: string | null;
  extraText: string | null;
  metaTitle: string;
  metaDescription: string;
};

export type GovernanceContent = {
  /** Section 1 of every route. Its SEO also serves the parent route. */
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    /** Resolved public URLs, or null to use the default photo in HeroPhoto. */
    desktopImage: string | null;
    mobileImage: string | null;
    metaTitle: string;
    metaDescription: string;
  };
  /** Section 2 of every route: the seven pillars. */
  kerangka: {
    eyebrow: string;
    title: string;
    description: string;
    items: GovernanceItem[];
  };
  pages: Record<GovernancePageSlug, GovernanceBlock>;
};

/**
 * The default hero photos: the two files that were in /public, now in Storage
 * under the paths the import recorded. A row with no photo uploaded shows these,
 * and the site shows the same photos from /public until the rows are seeded.
 */
export const GOVERNANCE_HERO_IMAGES = {
  desktop: LEGACY_MEDIA['/BannerS2.jpg'].path,
  mobile: LEGACY_MEDIA['/banermobile.jpg'].path,
} as const;

/** The database slug of every row this feature reads. */
export const GOVERNANCE_HERO_SLUG = 'tata-kelola-keberlanjutan';
export const GOVERNANCE_KERANGKA_SLUG = 'tata-kelola-kerangka';
export const GOVERNANCE_PAGE_SLUGS: readonly GovernancePageSlug[] = [
  'tata-kelola',
  'kode-etik',
  'kebijakan',
  'manajemen-risiko',
  'nilai-budaya',
  'keberlanjutan',
  'dampak',
];

function page(overrides: Partial<GovernanceBlock> & Pick<GovernanceBlock, 'metaTitle' | 'metaDescription'>): GovernanceBlock {
  return {
    eyebrow: null,
    title: overrides.metaTitle,
    description: null,
    items: [],
    steps: [],
    tags: [],
    extraLabel: null,
    extraText: null,
    ...overrides,
  };
}

export const GOVERNANCE_FALLBACK: GovernanceContent = {
  hero: {
    eyebrow: 'TATA KELOLA & KEBERLANJUTAN',
    title: 'Tata Kelola dan Keberlanjutan',
    description:
      'Sebagai bagian dari Environesia, kami percaya bahwa pertumbuhan bisnis harus berjalan bersama dengan cara kerja yang bertanggung jawab. Kualitas layanan, integritas, keselamatan, kepedulian terhadap lingkungan, serta tanggung jawab kepada para pemangku kepentingan menjadi bagian dari standar yang kami pegang dalam menjalankan kegiatan usaha.',
    desktopImage: null,
    mobileImage: null,
    metaTitle: 'Tata Kelola & Keberlanjutan',
    metaDescription:
      'Menjaga kepercayaan dan memastikan Environesia tumbuh melalui tata kelola perusahaan yang kuat, bertanggung jawab, dan berorientasi pada keberlanjutan.',
  },

  kerangka: {
    eyebrow: 'KERANGKA TATA KELOLA',
    title: 'Tujuh Pilar untuk Menjalankan Perusahaan Secara Bertanggung Jawab',
    description:
      'Kerangka ini menjadi bagian dari cara Environesia menjalankan perusahaan secara profesional, menjaga integritas, mengelola risiko, membangun budaya kerja, serta menciptakan nilai yang bertanggung jawab dan berkelanjutan.',
    items: [
      {
        title: 'Tata Kelola',
        description: 'Kerangka peran, tanggung jawab, dan pengambilan keputusan untuk menjalankan perusahaan secara profesional.',
      },
      {
        title: 'Kode Etik',
        description: 'Prinsip integritas dan perilaku profesional yang menjadi pedoman dalam setiap hubungan dan pekerjaan.',
      },
      {
        title: 'Kebijakan & Kepatuhan',
        description: 'Pedoman dan pengendalian untuk memastikan kegiatan perusahaan berjalan sesuai standar dan ketentuan yang berlaku.',
      },
      {
        title: 'Manajemen Risiko',
        description: 'Pendekatan untuk mengenali, menilai, mengendalikan, dan memantau risiko dalam kegiatan perusahaan.',
      },
      {
        title: 'Nilai & Budaya',
        description: 'Nilai yang membentuk cara kami bekerja, berkolaborasi, melayani, dan terus mengembangkan kemampuan.',
      },
      {
        title: 'Keberlanjutan',
        description: 'Komitmen untuk mempertimbangkan aspek lingkungan, manusia, tata kelola, dan nilai jangka panjang.',
      },
      {
        title: 'Inisiatif & Dampak',
        description: 'Upaya untuk menerjemahkan kompetensi dan layanan menjadi manfaat serta dampak yang bertanggung jawab.',
      },
    ],
  },

  pages: {
    'tata-kelola': page({
      // The principles, shown on the Tata Kelola pages after the navigation.
      extraLabel: 'PRINSIP TATA KELOLA DALAM PRAKTIK',
      items: [
        {
          label: 'Transparency',
          title: 'Keterbukaan yang dapat ditelusuri',
          description:
            'Mendorong informasi dan proses yang jelas dalam pelaksanaan pekerjaan, termasuk konsultansi, pengujian, dan kegiatan laboratorium.',
        },
        {
          label: 'Accountability',
          title: 'Setiap pekerjaan memiliki tanggung jawab',
          description: 'Peran, kewenangan, dan hasil pekerjaan dapat dipertanggungjawabkan sesuai fungsi dan tanggung jawabnya.',
        },
        {
          label: 'Responsibility',
          title: 'Bertanggung jawab terhadap dampak',
          description:
            'Setiap keputusan dan pekerjaan mempertimbangkan tanggung jawab profesional, lingkungan, serta kepentingan pemangku kepentingan.',
        },
        {
          label: 'Independence',
          title: 'Menjaga objektivitas profesional',
          description:
            'Menjaga independensi dan objektivitas dalam memberikan penilaian, rekomendasi, pengujian, maupun hasil pekerjaan.',
        },
        {
          label: 'Fairness',
          title: 'Hubungan yang adil dan profesional',
          description:
            'Membangun hubungan yang profesional, proporsional, dan saling menghormati dengan klien, mitra, karyawan, dan pemangku kepentingan.',
        },
      ],
      metaTitle: 'Tata Kelola Perusahaan',
      metaDescription:
        'Tata kelola perusahaan Environesia sebagai dasar dalam menjalankan bisnis secara profesional, bertanggung jawab, dan berkelanjutan.',
    }),

    'kode-etik': page({
      description:
        'Kode etik menjadi pedoman perilaku dalam menjalankan pekerjaan, mengambil keputusan, serta membangun hubungan yang profesional dengan klien, mitra, rekan kerja, dan pemangku kepentingan.',
      items: [
        {
          title: 'Integritas Profesional',
          description: 'Menjaga kejujuran, objektivitas, dan profesionalisme.',
        },
        {
          title: 'Independensi & Objektivitas',
          description: 'Menjaga penilaian profesional dari kepentingan yang dapat memengaruhi objektivitas.',
        },
        {
          title: 'Kerahasiaan Informasi',
          description: 'Menjaga informasi klien, data pekerjaan, hasil pengujian, dan informasi perusahaan sesuai kewenangan.',
        },
        {
          title: 'Konflik Kepentingan',
          description: 'Mengenali dan menangani potensi konflik kepentingan secara bertanggung jawab.',
        },
        {
          title: 'Kepatuhan',
          description: 'Menjalankan pekerjaan sesuai ketentuan, standar profesional, dan kebijakan yang berlaku.',
        },
        {
          title: 'Hubungan Profesional',
          description: 'Menjaga hubungan yang saling menghormati dengan klien, mitra, karyawan, dan pemangku kepentingan.',
        },
      ],
      extraLabel: 'KOMITMEN ETIKA',
      extraText:
        'Integritas perlu dijaga sejak perencanaan pekerjaan hingga penyampaian hasil. Setiap tahap menuntut kejujuran dan tanggung jawab profesional yang sama.',
      metaTitle: 'Kode Etik',
      metaDescription:
        'Kode etik Environesia sebagai pedoman perilaku dalam menjalankan pekerjaan, mengambil keputusan, dan berhubungan dengan klien serta mitra.',
    }),

    kebijakan: page({
      description:
        'Kebijakan internal, regulasi, standar profesional, persyaratan klien, dan prosedur operasional saling melengkapi dalam mengatur cara kerja Environesia.',
      items: [
        {
          title: 'Kepatuhan Regulasi',
          description: 'Menjalankan kegiatan sesuai ketentuan yang relevan dengan ruang lingkup usaha.',
        },
        {
          title: 'Standar Profesional',
          description: 'Menggunakan standar dan metodologi yang relevan.',
        },
        {
          title: 'Pengendalian Internal',
          description: 'Mendorong proses kerja yang terdokumentasi dan dapat dievaluasi.',
        },
        {
          title: 'Dokumentasi & Rekam Kerja',
          description: 'Menjaga dokumentasi yang diperlukan untuk konsistensi dan akuntabilitas.',
        },
        {
          title: 'Evaluasi Kepatuhan',
          description: 'Melakukan evaluasi dan penyempurnaan proses apabila diperlukan.',
        },
      ],
      extraText:
        'Penerapan kebijakan dan kepatuhan disesuaikan dengan ruang lingkup kegiatan, ketentuan yang berlaku, serta kebutuhan operasional perusahaan.',
      metaTitle: 'Kebijakan & Kepatuhan',
      metaDescription:
        'Hubungan antara kebijakan internal, peraturan perundang-undangan, standar profesi, dan prosedur operasional dalam kerja Environesia.',
    }),

    'manajemen-risiko': page({
      description:
        'Manajemen risiko membantu perusahaan mengantisipasi ketidakpastian, menjaga kualitas pekerjaan, dan mendukung pengambilan keputusan.',
      steps: [
        { label: 'Identifikasi', description: 'Mengenali risiko yang dapat memengaruhi pekerjaan dan operasional.' },
        { label: 'Penilaian', description: 'Memahami tingkat kemungkinan dan dampak risiko.' },
        { label: 'Pengendalian', description: 'Menetapkan tindakan yang proporsional untuk mengurangi risiko.' },
        { label: 'Monitoring', description: 'Memantau efektivitas pengendalian dan perubahan kondisi.' },
        { label: 'Perbaikan', description: 'Menggunakan hasil evaluasi untuk meningkatkan proses.' },
      ],
      extraLabel: 'KATEGORI RISIKO',
      tags: ['Operasional', 'Kualitas', 'Keselamatan & Kesehatan Kerja', 'Kepatuhan', 'Reputasi', 'Keberlanjutan'],
      metaTitle: 'Manajemen Risiko',
      metaDescription:
        'Bagaimana Environesia mengidentifikasi, menilai, mengendalikan, memantau, dan memperbaiki risiko untuk menjaga keandalan pekerjaan.',
    }),

    'nilai-budaya': page({
      description:
        'Lima nilai inti berikut menjadi acuan dalam setiap pekerjaan, keputusan, dan hubungan Environesia dengan klien serta rekan kerja.',
      items: [
        { title: 'ACCURACY', description: 'Ketelitian dalam setiap pekerjaan dan informasi yang kami hasilkan.' },
        { title: 'ON TIME', description: 'Menghargai waktu melalui komitmen terhadap target dan penyelesaian pekerjaan.' },
        { title: 'INTEGRITY', description: 'Menjaga kejujuran, konsistensi, dan tanggung jawab profesional.' },
        { title: 'CARING', description: 'Peduli terhadap klien, rekan kerja, lingkungan, dan dampak dari setiap pekerjaan.' },
        {
          title: 'CONTINUOUS DEVELOPMENT',
          description: 'Terus belajar, mengevaluasi, dan meningkatkan kompetensi serta cara kerja.',
        },
      ],
      metaTitle: 'Nilai & Budaya Perusahaan',
      metaDescription:
        'Lima nilai inti Environesia, yaitu Accuracy, On Time, Integrity, Caring, dan Continuous Development, sebagai cara kerja sehari-hari.',
    }),

    keberlanjutan: page({
      description:
        'Keberlanjutan menjadi bagian dari cara Environesia menjalankan bisnis dan memberikan layanan kepada klien serta pemangku kepentingan.',
      items: [
        { title: 'Lingkungan', description: 'Mendukung pengelolaan lingkungan melalui kompetensi dan layanan yang relevan.' },
        {
          title: 'Manusia',
          description: 'Memperhatikan keselamatan, kompetensi, pengembangan, dan kesejahteraan sumber daya manusia.',
        },
        { title: 'Tata Kelola', description: 'Menjalankan perusahaan secara bertanggung jawab dan profesional.' },
        { title: 'Nilai Jangka Panjang', description: 'Membangun layanan dan hubungan yang memberikan manfaat berkelanjutan.' },
      ],
      metaTitle: 'Keberlanjutan',
      metaDescription:
        'Bagaimana perspektif keberlanjutan menjadi bagian dari cara Environesia menjalankan bisnis dan memberikan layanan kepada klien.',
    }),

    dampak: page({
      description:
        'Pekerjaan Environesia dirancang untuk menghasilkan dampak yang bertanggung jawab bagi klien, lingkungan, dan pemangku kepentingan.',
      steps: [{ label: 'Kompetensi' }, { label: 'Layanan' }, { label: 'Solusi' }, { label: 'Dampak' }],
      items: [
        {
          title: 'Dampak terhadap Lingkungan',
          description: 'Bagaimana layanan membantu klien memahami dan mengelola aspek lingkungan.',
        },
        {
          title: 'Dampak terhadap Bisnis',
          description: 'Mendukung pengambilan keputusan dan pengelolaan risiko lingkungan.',
        },
        {
          title: 'Dampak terhadap Masyarakat',
          description: 'Mendukung praktik yang lebih bertanggung jawab terhadap masyarakat dan pemangku kepentingan.',
        },
        {
          title: 'Pengembangan Kompetensi',
          description: 'Mendorong peningkatan kapasitas profesional dan pengetahuan teknis.',
        },
      ],
      metaTitle: 'Inisiatif & Dampak',
      metaDescription:
        'Hubungan antara kompetensi, layanan, dan solusi Environesia dengan dampak yang dihasilkan bagi lingkungan, bisnis, dan masyarakat.',
    }),
  },
};

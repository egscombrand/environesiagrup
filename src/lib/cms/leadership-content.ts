import { LEGACY_MEDIA } from './legacy-media';

/**
 * Direktur Utama & Dewan Direksi as the tab shows it today. Pure, so the seed
 * (migration 0038) is generated from it and the code fallback cannot drift.
 *
 * Each person is a row in `leadership`: the bio is the `bio` column, and the
 * rest of the modal's detail is the `profile` JSON. Photos and logos are stored
 * as Storage paths, copied from /public by scripts/import-public-media.ts.
 */

export type LeadershipRole = 'direktur_utama' | 'direksi' | 'entitas_grup';

export type EducationEntry = {
  level: string;
  institution: string;
  degree?: string;
  scholarship?: string;
  note?: string;
  /** Storage path of the institution's logo. */
  logoPath?: string;
};

export type TeachingEntry = {
  institution: string;
  program: string;
  description: string;
  logoPath?: string;
};

export type LeadershipProfile = {
  descriptor?: string;
  education: EducationEntry[];
  experience: string[];
  stats: { value: string; label: string }[];
  contributionLabel?: string;
  contribution: string[];
  teaching: TeachingEntry[];
  /** Professional/social links shown at the bottom of the profile modal — each only when actually set. */
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
};

export type LeadershipPerson = {
  slug: string;
  name: string;
  position: string;
  role: LeadershipRole;
  /** Storage path of the portrait. */
  photoPath: string;
  photoSize: { width: number; height: number };
  bio: string | null;
  profile: LeadershipProfile;
  /** The entity's name, for a group-entity leader. */
  entitySlug?: string;
};

export type LeadershipHeadings = {
  direkturUtama: string;
  dewan: string;
  entitas: { title: string; intro: string };
};

export const DIREKTUR_PAGE_META = {
  title: 'Direktur Utama & Dewan Direksi',
  metaTitle: 'Direktur Utama & Dewan Direksi',
  metaDescription: 'Direktur Utama dan Dewan Direksi Environesia.',
};

const photo = (publicPath: string) => LEGACY_MEDIA[publicPath as keyof typeof LEGACY_MEDIA].path;

const EMPTY_PROFILE: LeadershipProfile = { education: [], experience: [], stats: [], contribution: [], teaching: [] };

export const DIREKTUR_UTAMA_FALLBACK: LeadershipPerson = {
  slug: 'direktur-utama',
  name: 'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.',
  position: 'Director Environesia',
  role: 'direktur_utama',
  photoPath: photo('/leadership/direktur-utama.png'),
  photoSize: { width: 1314, height: 2154 },
  bio: 'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng., dikenal sebagai Bangsap, merupakan praktisi bisnis lingkungan yang telah menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara. Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan serta Dosen Praktisi di Magister Pengelolaan Lingkungan UGM dan Sustainable Business BINUS University.',
  profile: {
    descriptor: 'Praktisi Bisnis Lingkungan',
    education: [
      {
        level: 'S1 Teknik Lingkungan',
        institution: 'Universitas Islam Indonesia (UII)',
        degree: 'S.T.',
        scholarship: 'Beasiswa Abdul Kahar Muzakkir',
        logoPath: photo('/pendidikan/Logo-UII-Asli.webp'),
      },
      {
        level: 'S2 Magister Pengelolaan Lingkungan',
        institution: 'Universitas Gadjah Mada (UGM)',
        degree: 'M.Sc.',
        scholarship: 'LPDP',
        logoPath: photo('/pendidikan/logo-ugm-transparent.png'),
      },
      {
        level: 'S2 Magister Teknik Lingkungan',
        institution: 'Universitas Islam Indonesia (UII)',
        degree: 'M.T.',
        logoPath: photo('/pendidikan/Logo-UII-Asli.webp'),
      },
      {
        level: 'Program Insinyur Teknik',
        institution: 'Universitas Gadjah Mada (UGM)',
        degree: 'Ir.',
        logoPath: photo('/pendidikan/logo-ugm-transparent.png'),
      },
      {
        level: 'S3 Program Doktor Manajemen & Bisnis',
        institution: 'IPB University',
        note: 'Menempuh pendidikan doktoral sebagai bagian dari penguatan kapasitas akademik, kepemimpinan, dan pengembangan bisnis berkelanjutan.',
        logoPath: photo('/pendidikan/Logo_IPB.png'),
      },
    ],
    experience: [
      'Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng. dikenal sebagai praktisi bisnis lingkungan dengan pengalaman menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara.',
      'Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan dengan pengalaman dalam pengembangan dan pengelolaan usaha di bidang konsultansi dan laboratorium lingkungan, sertifikasi kompetensi, serta pendidikan dan pelatihan.',
      'Pengalaman profesional tersebut mencakup pekerjaan bersama masyarakat, perusahaan, pemerintah, hingga mitra internasional dalam berbagai konteks pengelolaan lingkungan dan pengembangan bisnis.',
    ],
    stats: [
      { value: '1.000+', label: 'Proyek' },
      { value: '38', label: 'Provinsi' },
      { value: '10', label: 'Negara' },
      { value: '5', label: 'Entitas Bisnis Lingkungan' },
    ],
    contributionLabel: 'Kontribusi Profesional',
    contribution: [
      'Bagi Bangsap, keberlanjutan lingkungan tidak cukup berhenti sebagai gagasan, tetapi perlu diterjemahkan menjadi solusi yang dapat digunakan, memberi manfaat, dan memiliki model bisnis yang mampu berjalan secara berkelanjutan.',
    ],
    teaching: [
      {
        institution: 'Universitas Gadjah Mada (UGM)',
        program: 'Magister Pengelolaan Lingkungan',
        description:
          'Aktivitas sebagai dosen praktisi menjadi ruang untuk menghubungkan teori akademik dengan pengalaman praktik lingkungan dan kasus nyata di lapangan.',
        logoPath: photo('/pendidikan/logo-ugm-transparent.png'),
      },
      {
        institution: 'BINUS University',
        program: 'Sustainable Business',
        description: 'Mengajarkan bisnis berkelanjutan dan penerapannya dalam praktik bisnis.',
        logoPath: photo('/pendidikan/Logo_Binus_University.png'),
      },
    ],
  },
};

const DEWAN_SIZE = { width: 801, height: 1426 };

export const DEWAN_DIREKSI_FALLBACK: LeadershipPerson[] = [
  {
    slug: 'dewan-nurul-lahtifah',
    name: 'Nurul Lahtifah, S.T.',
    position: 'Director Corporate Services and Innovation',
    role: 'direksi',
    photoPath: photo('/Mba Nurul.jpg'),
    photoSize: DEWAN_SIZE,
    bio: null,
    profile: EMPTY_PROFILE,
  },
  {
    slug: 'dewan-yusuf-wiryawan',
    name: 'Yusuf Wiryawan, S.T.M.Ling.M.T.',
    position: 'Director of Operational',
    role: 'direksi',
    photoPath: photo('/Bang ucup.jpg'),
    photoSize: DEWAN_SIZE,
    bio: null,
    profile: EMPTY_PROFILE,
  },
  {
    slug: 'dewan-ariyan-eka-putra',
    name: 'Ir. Ariyan Eka Putra, S.T.M.T.',
    position: 'Director Business Development',
    role: 'direksi',
    photoPath: photo('/BANG ARIYAN.jpg'),
    photoSize: DEWAN_SIZE,
    bio: null,
    profile: EMPTY_PROFILE,
  },
];

export const ENTITAS_GRUP_FALLBACK: LeadershipPerson = {
  slug: 'entitas-fauzan-madani',
  name: 'Fauzan Madani',
  position: 'Direktur',
  role: 'entitas_grup',
  photoPath: photo('/Bang ojan.jpeg'),
  photoSize: DEWAN_SIZE,
  bio: null,
  profile: EMPTY_PROFILE,
  entitySlug: 'bikin-indonesia-berdaya',
};

export const LEADERSHIP_HEADINGS: LeadershipHeadings = {
  direkturUtama: 'Direktur Utama',
  dewan: 'Dewan Direksi',
  entitas: {
    title: 'Leadership Entitas Grup',
    intro: 'Kepemimpinan pada entitas yang menjadi bagian dari Environesia.',
  },
};

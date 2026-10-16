// Real, verified legal/credential data for Environesia,
// given directly — hardcoded (not CMS-driven) because there is no
// `legalitas`/credentials table yet. Structured as entity → cards →
// documents: one large editorial card per issuing body/institution (not
// one tiny card per document number), so a document never crosses entity
// boundaries and a whole institution's credentials read together. Nothing
// here is invented — every number, name, and date is reproduced exactly
// as given. `issuer` is set on a document only when the issuing body is
// named separately from its title; when the issuer is already the card's
// own logo/institution, it isn't repeated per document. No `documentUrl`
// exists for any of these yet — the preview CTA only renders once a real
// file path is added, never as a fake button.

export const LEGALITAS_CATEGORIES = [
  'Akta & AHU',
  'Perizinan',
  'ISO & Sistem Manajemen',
  'Sertifikasi',
  'Akreditasi',
  'Keanggotaan',
  'Lainnya',
] as const;

export type LegalitasCategory = (typeof LEGALITAS_CATEGORIES)[number];

export type LegalitasField = { label: string; value: string };

export type LegalitasCardDocument = {
  title: string;
  /** The registering/certifying body, only when it differs from the card's own institution/logo. */
  issuer?: string;
  fields: LegalitasField[];
  description?: string;
  /** Local asset path once a real scan/certificate file exists — never external/hotlinked. */
  documentUrl?: string;
  documentType?: 'pdf' | 'image';
  /** A real, given verification/registry link on an official third-party site (e.g. a certifying body's public directory) — never guessed. Opens in a new tab as a plain link, not the document-preview modal. */
  externalUrl?: string;
  /** Overrides the default "Lihat Dokumen"/generic CTA text, e.g. "Cek Sertifikat ISO BSI". */
  ctaLabel?: string;
};

export type LegalitasCard = {
  id: string;
  category: LegalitasCategory;
  /** Local asset path from `public/legalitas/` — never a placeholder or external URL. */
  logo?: string;
  logoAlt: string;
  /** Card header title — the institution/document-group name. */
  title: string;
  /** Small English subtitle under the title, e.g. "Legal Corporate Documents". */
  subtitle?: string;
  /** Company-info style fields shown once, right after the title, before any documents (e.g. Nama Perusahaan, Website, NPWP). */
  intro?: LegalitasField[];
  documents: LegalitasCardDocument[];
};

export type LegalitasEntity = {
  id: string;
  name: string;
  /** Short display label used on entity filter chips, e.g. "Environesia" for "Environesia Global Saraya". */
  shortName: string;
  /** The entity's own registered legal name, when it differs from its trading name. */
  legalName?: string;
  cards: LegalitasCard[];
};

const LOGO = (file: string) => `/legalitas/${file}`;

export const LEGALITAS_ENTITIES: LegalitasEntity[] = [
  {
    id: 'environesia-global-saraya',
    name: 'Environesia Global Saraya',
    shortName: 'Environesia',
    cards: [
      {
        id: 'egs-akta',
        category: 'Akta & AHU',
        logo: LOGO('garuda.svg'),
        logoAlt: 'Garuda Pancasila',
        title: 'Akta & Dokumen Perusahaan',
        subtitle: 'Legal Corporate Documents',
        documents: [
          {
            title: 'Akte Pendirian Perusahaan',
            fields: [
              { label: 'Nomor', value: '1' },
              { label: 'Tanggal', value: '3 Mei 2016' },
              { label: 'Notaris', value: 'Asnahwati H. Herwidhi, S.H' },
            ],
          },
          {
            title: 'Akta Perubahan Perusahaan',
            fields: [
              { label: 'Nomor', value: '29' },
              { label: 'Tanggal', value: '26 Januari 2017' },
              { label: 'Notaris', value: 'Asnahwati H. Herwidhi, S.H.' },
            ],
          },
        ],
      },
      {
        id: 'egs-csms-pln',
        category: 'Sertifikasi',
        logo: LOGO('pln.svg'),
        logoAlt: 'PLN',
        title: 'Contractor Safety Management System',
        subtitle: 'PLN',
        documents: [
          {
            title: 'Contractor Safety Management System (CSMS)',
            // No "Notaris" field — not relevant to this document type.
            fields: [
              { label: 'Kategori', value: 'RISIKO EKSTRIM' },
              { label: 'Nomor', value: '001092/DIST/CSMS/VIII/2022' },
            ],
          },
        ],
      },
      {
        id: 'egs-ahu-ki',
        category: 'Akta & AHU',
        logo: LOGO('pengayoman.svg'),
        logoAlt: 'Pengayoman — Kementerian Hukum dan HAM',
        title: 'AHU & Kekayaan Intelektual',
        subtitle: 'Kementerian Hukum dan HAM RI',
        documents: [
          {
            title: 'Kep. Menkumham Akta Perubahan Perusahaan',
            fields: [{ label: 'Nomor', value: 'AHU-002382.AH.01.02.Tahun 2017' }],
          },
          {
            title: 'Keputusan Menkumham Akta Pendirian Perusahaan',
            fields: [{ label: 'Nomor', value: 'AHU-002382.AH.01.01.Tahun 2016' }],
          },
          {
            title: 'Direktorat Jenderal Kekayaan Intelektual',
            fields: [{ label: 'Nomor', value: 'IDM000846557' }],
          },
        ],
      },
      {
        id: 'egs-csms-pjb',
        category: 'Sertifikasi',
        logo: LOGO('pjb.svg'),
        logoAlt: 'Pembangkit Jawa Bali',
        title: 'Pembangkit Jawa Bali CSMS',
        subtitle: 'PJB',
        documents: [
          {
            title: 'Pembangkit Jawa Bali Contractor Safety Management System (CSMS)',
            fields: [
              { label: 'Kategori', value: 'HIGH RISK' },
              { label: 'Nomor', value: 'B0002-C20200015-UBRS-CSMSPJB' },
            ],
          },
        ],
      },
      {
        id: 'egs-pajak',
        category: 'Lainnya',
        logo: LOGO('pajak.svg'),
        logoAlt: 'Direktorat Jenderal Pajak',
        title: 'Pajak',
        subtitle: 'Direktorat Jenderal Pajak',
        documents: [
          {
            title: 'Nomor Pokok Wajib Pajak (NPWP)',
            fields: [{ label: 'Nomor', value: '76.103.263.0-543.000' }],
          },
          {
            title: 'Surat Pengukuhan Pengusaha Kena Pajak',
            fields: [{ label: 'Nomor', value: 'S-45PKP/WPJ.23/KP.0103/2022' }],
          },
        ],
      },
      {
        id: 'egs-iso',
        category: 'ISO & Sistem Manajemen',
        logo: LOGO('bsi.svg'),
        logoAlt: 'British Standards Institution (BSI)',
        title: 'Sistem Manajemen Terintegrasi',
        subtitle: 'British Standards Institution (BSI)',
        documents: [
          {
            title: 'ISO 9001:2015',
            description: 'Sistem Manajemen Mutu',
            fields: [{ label: 'Nomor', value: 'FS 692190' }],
          },
          {
            title: 'ISO 14001:2015',
            description: 'Sistem Manajemen Lingkungan',
            fields: [{ label: 'Nomor', value: 'EMS 714286' }],
          },
          {
            title: 'ISO 45001:2018',
            description: 'Sistem Manajemen K3',
            fields: [{ label: 'Nomor', value: 'OHS 714284' }],
          },
        ],
      },
      {
        id: 'egs-amdal',
        category: 'Akreditasi',
        logo: LOGO('amdal.svg'),
        logoAlt: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)',
        title: 'AMDAL',
        subtitle: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)',
        documents: [
          {
            title: 'Lembaga Penyedia Jasa Penyusun AMDAL (LPJP)',
            fields: [
              { label: 'Nomor Registrasi', value: '0174/LPJ/AMDAL-1/LRK/KLHK' },
              { label: 'Nomor Pengesahan', value: 'S-79 /BSI/PUSFASTER/SET.1/4/2022' },
            ],
          },
        ],
      },
      {
        id: 'egs-iujp',
        category: 'Perizinan',
        logo: LOGO('energy_sumber_daya.svg'),
        logoAlt: 'Kementerian Energi dan Sumber Daya Mineral (ESDM)',
        title: 'Izin Usaha Jasa Pertambangan',
        subtitle: 'IUJP',
        documents: [
          {
            title: 'Izin Usaha Jasa Pertambangan (IUJP)',
            issuer: 'Badan Koordinasi Penanaman Modal',
            fields: [{ label: 'Nomor', value: '154/1/IUJP/PMDN/2018' }],
          },
        ],
      },
      {
        id: 'egs-skup',
        category: 'Perizinan',
        logo: LOGO('energy_sumber_daya.svg'),
        logoAlt: 'Kementerian Energi dan Sumber Daya Mineral (ESDM)',
        title: 'Surat Penunjang Kemampuan Penunjang Migas',
        subtitle: 'SKUP',
        documents: [
          {
            title: 'Surat Penunjang Kemampuan Penunjang Migas (SKUP)',
            fields: [{ label: 'Nomor', value: '2246/19.07/DBM/2018' }],
          },
        ],
      },
      {
        id: 'egs-bnsp',
        category: 'Sertifikasi',
        logo: LOGO('bnsp.svg'),
        logoAlt: 'Badan Nasional Sertifikasi Profesi (BNSP)',
        title: 'Tempat Uji Kompetensi',
        subtitle: 'BNSP',
        documents: [
          {
            title: 'Pelatihan Tempat Uji Kompetensi',
            fields: [{ label: 'Nomor', value: '520/LSP/LSK-K3/VIII/2018' }],
          },
        ],
      },
      {
        id: 'egs-kemnaker',
        category: 'Sertifikasi',
        logo: LOGO('kemnaker.svg'),
        logoAlt: 'Kementerian Ketenagakerjaan RI',
        title: 'Kompetensi & K3',
        subtitle: 'Kementerian Ketenagakerjaan RI',
        documents: [
          {
            title: 'Pelatihan Bidang Sistem Manajemen K3 dan Keahlian K3',
            fields: [{ label: 'Nomor', value: '299/BINWASK3-PNL3/XI/2018' }],
          },
          {
            title: 'Pelatihan Bidang Kesehatan Kerja',
            fields: [{ label: 'Nomor', value: 'KEP/423/BINWASK3-PNK3/KK/IV/2019' }],
          },
          {
            title: 'Pelatihan Bidang Lingkungan Kerja dan Bahan Berbahaya',
            fields: [{ label: 'Nomor', value: '478/BINWASK3-PNL3/IV/2019' }],
          },
        ],
      },
      {
        id: 'egs-lpjk',
        category: 'Sertifikasi',
        logo: LOGO('lpjk.svg'),
        logoAlt: 'Lembaga Pengembangan Jasa Konstruksi (LPJK)',
        title: 'LPJK',
        subtitle: 'Lembaga Pengembangan Jasa Konstruksi',
        documents: [
          { title: 'Jasa Konsultansi Lainnya', fields: [{ label: 'Nomor', value: '4-3404-04-008-1-12-077252' }] },
          { title: 'Jasa Perencanaan Tata Ruang', fields: [{ label: 'Nomor', value: '1-3404-03-008-1-12-077252' }] },
          { title: 'Jasa Perencana Rekayasa', fields: [{ label: 'Nomor', value: '1-3404-02-008-1-12-077252' }] },
          { title: 'Jasa Konsultan Spesialis', fields: [{ label: 'Nomor', value: '3-3404-05-008-1-12-077252' }] },
        ],
      },
      {
        id: 'egs-inkindo',
        category: 'Keanggotaan',
        logo: LOGO('inkindo.svg'),
        logoAlt: 'Ikatan Nasional Konsultan Indonesia (INKINDO)',
        title: 'INKINDO',
        subtitle: 'Ikatan Nasional Konsultan Indonesia',
        documents: [
          { title: 'Nomor Keanggotaan', fields: [{ label: 'Nomor', value: '16516/P/0236.DIY' }] },
          { title: 'Jasa Konsultansi Manajemen', fields: [{ label: 'Nomor', value: '1.MS-34.04-22-1722' }] },
          { title: 'Jasa Konsultansi Industri Pariwisata (MICE)', fields: [{ label: 'Nomor', value: '4.02-34.04-22-1722' }] },
          { title: 'Jasa Khusus', fields: [{ label: 'Nomor', value: '1.SC-34.04-22-1722' }] },
          { title: 'Jasa Studi Penelitian dan Bantuan Teknik', fields: [{ label: 'Nomor', value: '1.SI-34.04-22-1722' }] },
          { title: 'Jasa Survey', fields: [{ label: 'Nomor', value: '1.SS-34.04-22-1722' }] },
        ],
      },
      {
        id: 'egs-oss',
        category: 'Perizinan',
        logo: LOGO('bkpm.svg'),
        logoAlt: 'Badan Koordinasi Penanaman Modal (BKPM)',
        title: 'OSS & Perizinan Berusaha',
        subtitle: 'Badan Koordinasi Penanaman Modal',
        documents: [
          {
            title: 'Lembaga Online Single Submission (OSS)',
            description: 'Pelayanan Perizinan Berusaha Terintegrasi Secara Elektronik',
            fields: [{ label: 'Nomor Induk Berusaha', value: '0220205221878' }],
          },
          { title: 'Izin Lingkungan', fields: [{ label: 'Nomor', value: '660.3/146/2020' }] },
          { title: 'Surat Izin Usaha Perdagangan', fields: [{ label: 'Nomor', value: '503/003490/PK/VIII/2017' }] },
          { title: 'Izin Usaha Jasa Konstruksi', fields: [{ label: 'Nomor', value: '1-1204-1-00726-077252' }] },
        ],
      },
      {
        id: 'egs-kadin',
        category: 'Keanggotaan',
        logo: LOGO('kadin.svg'),
        logoAlt: 'Kamar Dagang dan Industri Indonesia (KADIN)',
        title: 'KADIN',
        subtitle: 'Kamar Dagang dan Industri Indonesia',
        documents: [
          { title: 'Nomor Keanggotaan', fields: [{ label: 'Nomor', value: '20403-16000020' }] },
          { title: 'Jasa Studi, Penelitian dan Bantuan Teknik', fields: [{ label: 'Nomor', value: 'I.SI.20403-17-1722' }] },
          { title: 'Jasa Konsultansi Manajemen', fields: [{ label: 'Nomor', value: 'I.MS.20403-17-1722' }] },
          { title: 'Jasa Survey', fields: [{ label: 'Nomor', value: 'I.SS-34.04-19-1722' }] },
        ],
      },
    ],
  },
  {
    id: 'greenlab-indonesia',
    name: 'Greenlab Indonesia',
    shortName: 'Greenlab',
    legalName: 'PT Greenlab Indo Global',
    cards: [
      {
        id: 'glb-legalitas-perusahaan',
        category: 'Akta & AHU',
        logo: LOGO('garuda.svg'),
        logoAlt: 'Garuda Pancasila',
        title: 'Legalitas Perusahaan',
        intro: [
          { label: 'Nama Perusahaan', value: 'PT Greenlab Indo Global' },
          { label: 'Telp/Fax/HP', value: '(0274) 454 000 ext.2 / 0822 8888 9602' },
          { label: 'Website', value: 'www.greenlab.co.id' },
          { label: 'Email', value: 'info@greenlab.co.id' },
          { label: 'NPWP', value: '0846 1004 10542000' },
        ],
        documents: [
          {
            title: 'Akta Pendirian Perusahaan',
            fields: [
              { label: 'Notaris', value: 'Asnahwati H Herwidhi, S.H' },
              { label: 'Nomor', value: '42' },
              { label: 'Tanggal', value: '26 Maret 2018' },
            ],
          },
          {
            title: 'Akta Perubahan Perusahaan',
            fields: [
              { label: 'Notaris', value: 'Sri Peny Nugrohowati, S.H.' },
              { label: 'Nomor', value: '22' },
              { label: 'Tanggal', value: '20 Oktober 2022' },
            ],
          },
        ],
      },
      {
        id: 'glb-akreditasi-kan',
        category: 'Akreditasi',
        logo: LOGO('kan.svg'),
        logoAlt: 'Komite Akreditasi Nasional (KAN)',
        title: 'Akreditasi Laboratorium (KAN)',
        documents: [
          {
            title: 'Laboratorium Terakreditasi',
            issuer: 'Komite Akreditasi Nasional (KAN)',
            description:
              'Laboratorium Terakreditasi (LP-1342-IDN) ISO/IEC 17025:2017 "Persyaratan Umum Kompetensi Laboratorium Pengujian dan Laboratorium Kalibrasi" dari Komite Akreditasi Nasional (KAN).',
            fields: [{ label: 'Nomor', value: 'LP-1342-IDN' }],
            // /public/legalitas/akreditasi-kan.pdf doesn't exist yet, so no
            // `documentUrl` is set — the "Cek Sertifikat Akreditasi KAN" CTA
            // stays hidden until that file is actually added, per the rule
            // against a CTA with no real file behind it.
            ctaLabel: 'Cek Sertifikat Akreditasi KAN',
          },
        ],
      },
      {
        id: 'glb-kemnaker-pjk3',
        category: 'Sertifikasi',
        logo: LOGO('kemnaker.svg'),
        logoAlt: 'Kementerian Ketenagakerjaan RI',
        title: 'Penunjukan Resmi oleh KEMNAKER sebagai PJK3 LKBB',
        documents: [
          {
            title: 'SKP PJK3 Bidang Riksa Uji Lingkungan Kerja dan Bahan Berbahaya',
            issuer: 'Kementerian Ketenagakerjaan Republik Indonesia',
            fields: [{ label: 'Nomor', value: '5/1069/AS.01.02/IX/2023' }],
          },
        ],
      },
      {
        id: 'glb-klhk',
        category: 'Sertifikasi',
        // klhk.svg wasn't provided — amdal.svg is the real KLHK emblem
        // (confirmed visually), reused here for the same real institution.
        logo: LOGO('amdal.svg'),
        logoAlt: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)',
        title: 'Laboratorium Teregistrasi KLHK',
        documents: [
          {
            title: 'Laboratorium Lingkungan Teregistrasi',
            description:
              'Laboratorium Lingkungan Teregistrasi dari Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia berdasarkan Peraturan Menteri Lingkungan Hidup Nomor 6 Tahun 2009.',
            fields: [{ label: 'Nomor Registrasi', value: '00149/LPJ/LABLING-1/LRK/KLHK' }],
          },
        ],
      },
      {
        id: 'glb-bsi-iso',
        category: 'ISO & Sistem Manajemen',
        logo: LOGO('bsi.svg'),
        logoAlt: 'British Standards Institution (BSI)',
        title: 'Tersertifikasi Internasional BSI',
        documents: [
          {
            title: 'ISO 14001:2015',
            description: 'Environmental Management',
            issuer: 'British Standards Institution',
            fields: [{ label: 'Nomor', value: 'EMS 703934' }],
          },
          {
            title: 'ISO 9001:2015',
            description: 'Quality Management',
            issuer: 'British Standards Institution',
            fields: [{ label: 'Nomor', value: 'FS 703935' }],
          },
          {
            title: 'ISO 45001:2018',
            description: 'Occupational Health and Safety Management',
            issuer: 'British Standards Institution',
            fields: [{ label: 'Nomor', value: 'OHS 703933' }],
            externalUrl:
              'https://www.bsigroup.com/en-GB/products-and-services/assessment-and-certification/validation-and-verification/client-directory-profile/PT_GRE-0047708467-000',
            ctaLabel: 'Cek Sertifikat ISO BSI',
          },
        ],
      },
    ],
  },
];

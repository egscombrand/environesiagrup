export type StaticDeckProject = {
  /** e.g. "Pemantauan Lingkungan" — literal "-" when not yet known. */
  projectType: string;
  /** The project's headline name/client, e.g. "PT Bukit Asam Tbk". */
  client: string;
  /** The work itself, e.g. "Jasa Pemantauan Lingkungan UPTE dan PLTU 3X10 MW...". */
  projectTitle: string;
  /** Literal "-" when not yet known — never a guessed/fabricated date. */
  date: string;
  /** Literal "-" when not yet known. */
  company: string;
  /** City/regency — literal "-" when not yet known. */
  location: string;
  /** Literal "-" when not yet known. */
  province: string;
  imageUrl?: string;
  /** Internal-only flag — never rendered to visitors (no "dummy"/"placeholder"
   * badge anywhere in the UI) — so this entity's real projects can be found
   * and swapped in later without hunting through the array by hand. */
  isPlaceholder?: boolean;
};

export type EntityProjectGroup = {
  /** Matches an `entities.slug` in the CMS — real name/logo for the tab and
   * card badge always come from there, never hardcoded here. */
  entitySlug: string;
  projects: StaticDeckProject[];
};

/**
 * "Lini Bisnis dan Proyek Berjalan" — per-entity project lists. Environesia's
 * five are real, supplied project records (client, work description, date,
 * company, location, province, photo — used as-is; unknown fields are the
 * literal "-", never a guessed value). The other four entities don't have a
 * real project archive yet, so they carry clearly-flagged placeholder
 * entries (`isPlaceholder`) — swap each array's contents for real data as it
 * becomes available; nothing else in the UI needs to change.
 */
export const BUSINESS_PROJECTS_DATA: EntityProjectGroup[] = [
  {
    entitySlug: 'environesia-consultant',
    projects: [
      {
        projectType: 'Pemantauan Lingkungan',
        client: 'PT Bukit Asam Tbk',
        projectTitle: 'Jasa Pemantauan Lingkungan UPTE dan PLTU 3X10 MW Banko Barat',
        date: '-',
        company: 'PT Bukit Asam Tbk',
        location: 'Kabupaten Muara Enim',
        province: 'Sumatera Selatan',
        imageUrl:
          'https://environesia.co.id/assets/assets/foto/layanan/layanan_profile/list_of_project/industry/bukit_asam.png',
      },
      {
        projectType: 'Dokumen Lingkungan',
        client: 'PT Bina Guna Kimia (FMC Corporation)',
        projectTitle: 'Perubahan persetujuan lingkungan dan penambahan kapasitas produksi',
        date: '-',
        company: 'PT Bina Guna Kimia (FMC Corporation)',
        location: '-',
        province: '-',
        imageUrl:
          'https://environesia.co.id/assets/assets/foto/layanan/layanan_profile/list_of_project/industry/bina_guna_kimia.png',
      },
      {
        projectType: 'Detail Engineering Design',
        client: 'PT Supreme Energy Rantau Dedap (SERD)',
        projectTitle: 'Penyediaan Jasa Detail Engineering Design Untuk STP',
        date: '-',
        company: 'PT Supreme Energy Rantau Dedap (SERD)',
        location: '-',
        province: '-',
        imageUrl:
          'https://environesia.co.id/assets/assets/foto/layanan/layanan_profile/list_of_project/industry/supreme_energy.png',
      },
      {
        projectType: 'Dokumen Lingkungan',
        client: 'PT Kuala Lumpur Kepongberhard',
        projectTitle: 'Penyusunan Dokumen Lingkungan PT KLK Dumai',
        date: '-',
        company: 'PT Kuala Lumpur Kepongberhard',
        location: 'Dumai',
        province: '-',
        imageUrl:
          'https://environesia.co.id/assets/assets/foto/layanan/layanan_profile/list_of_project/industry/kuala_lumpur.png',
      },
      {
        projectType: 'Persetujuan Lingkungan',
        client: 'PT Inti Everspring Indonesia',
        projectTitle: 'Pengurusan Persetujuan Lingkungan PT Inti Everspring Indonesia',
        date: '-',
        company: 'PT Inti Everspring Indonesia',
        location: '-',
        province: '-',
        imageUrl:
          'https://environesia.co.id/assets/assets/foto/layanan/layanan_profile/list_of_project/industry/inti_everspring.png',
      },
      // Available but not shown in the initial 5 — uncomment/move into the
      // array above whenever the list should surface more than 5 per entity.
      // {
      //   projectType: 'Detail Engineering Design',
      //   client: 'PT Supreme Energy Muara Laboh (SEML)',
      //   projectTitle: 'Detail Engineering Design Sewage Treat Plant PT. SEML',
      //   date: '-', company: 'PT Supreme Energy Muara Laboh (SEML)', location: '-', province: '-',
      // },
      // {
      //   projectType: 'Konsultansi Lingkungan',
      //   client: 'PT Jakarta Industrial Estate Pulogadung (JIEP)',
      //   projectTitle:
      //     'Jasa Konsultasi Penyusunan Laporan Implementasi Dokumen Lingkungan RKL-RPL Kawasan Industri Pulogadung',
      //   date: '-', company: 'PT Jakarta Industrial Estate Pulogadung (JIEP)', location: 'Pulogadung', province: '-',
      // },
      // {
      //   projectType: 'Dokumen Lingkungan',
      //   client: 'PT Elnusa Petrofin',
      //   projectTitle: 'Jasa Pembuatan dan Penyusunan Dokumen UKL-UPL dan Izin Lingkungan Project Depo Tembilahan',
      //   date: '-', company: 'PT Elnusa Petrofin', location: 'Tembilahan', province: '-',
      // },
      // {
      //   projectType: 'Persetujuan Lingkungan',
      //   client: 'PT Bridgestone Kalimantan Plantation',
      //   projectTitle: 'Jasa Pekerjaan Persetujuan Lingkungan dan Surat Laik Operasi',
      //   date: '-', company: 'PT Bridgestone Kalimantan Plantation', location: '-', province: '-',
      // },
      // {
      //   projectType: 'Pemantauan Lingkungan',
      //   client: 'PT Pertamina EP (PEP) Sangatta Field',
      //   projectTitle:
      //     'Pemantauan Lingkungan dan Penyusunan Laporan RKL-RPL dan/atau UKL-UPL Pertamina EP Sangatta Field',
      //   date: '-', company: 'PT Pertamina EP (PEP) Sangatta Field', location: 'Sangatta', province: 'Kalimantan Timur',
      // },
      // {
      //   projectType: 'Dokumen Lingkungan',
      //   client: 'PT Sinar Alam Permai',
      //   projectTitle:
      //     'Penyusunan Dokumen Evaluasi Lingkungan Hidup (DELH), Analisis Dampak Lalu Lintas (ANDALALIN) Dan Surat Kelayakan Operasional',
      //   date: '-', company: 'PT Sinar Alam Permai', location: '-', province: '-',
      // },
    ],
  },
  {
    entitySlug: 'greenlab',
    projects: [
      {
        projectType: '-',
        client: '[Nama Klien GreenLab]',
        projectTitle: 'Pengujian dan Pemantauan Kualitas Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien GreenLab]',
        projectTitle: 'Pemantauan Kualitas Air dan Air Limbah',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien GreenLab]',
        projectTitle: 'Pengujian Kualitas Udara Ambien dan Emisi',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien GreenLab]',
        projectTitle: 'Pengujian dan Analisis Parameter Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien GreenLab]',
        projectTitle: 'Pemantauan Lingkungan dan Penyusunan Laporan Hasil Pengujian',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
    ],
  },
  {
    entitySlug: 'lsp-praktisi-lingkungan',
    projects: [
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Sertifikasi Kompetensi Praktisi Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Pelaksanaan Sertifikasi Kompetensi Tenaga Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Pengembangan Kompetensi Profesional Bidang Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Sertifikasi Kompetensi Pengelolaan Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Asesmen Kompetensi Praktisi Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
    ],
  },
  {
    entitySlug: 'greenskill',
    projects: [
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Green Business & Sustainability Training',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Pelatihan AMDAL dan UKL-UPL',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Pelatihan Penyusunan DELH dan DPLH',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Environmental Management Training',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Klien]',
        projectTitle: 'Pengembangan Kompetensi SDM Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
    ],
  },
  {
    entitySlug: 'bikin-indonesia-berdaya',
    projects: [
      {
        projectType: '-',
        client: '[Nama Mitra]',
        projectTitle: 'Pengembangan Solusi dan Produk Pendukung Lingkungan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Mitra]',
        projectTitle: 'Pengembangan Produk untuk Kebutuhan Industri',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Mitra]',
        projectTitle: 'Pemberdayaan dan Pengembangan Kapasitas Masyarakat',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Mitra]',
        projectTitle: 'Pengembangan Solusi Berbasis Kebutuhan Lokal',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
      {
        projectType: '-',
        client: '[Nama Mitra]',
        projectTitle: 'Inovasi Produk dan Solusi Berkelanjutan',
        date: '-',
        company: '-',
        location: '-',
        province: '-',
        isPlaceholder: true,
      },
    ],
  },
];

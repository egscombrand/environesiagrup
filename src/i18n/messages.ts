// Every user-visible interface string, for all three locales. The `: Messages`
// annotation on each locale is what makes a forgotten translation a build
// error instead of a page that silently renders Indonesian.
//
// Not translated by design: entity names, the brand tagline, the office
// address, and the group's own name — see the design spec.

export type Messages = {
  nav: {
    utama: string;
    footer: string;
    mobile: string;
    menu: string;
    tutup: string;
    pilihBahasa: string;
    beranda: string;
  };
  common: {
    pendingContent: string;
    layanan: string;
    layananPending: string;
    selengkapnya: string;
  };
  beranda: {
    angkaKunciEyebrow: string;
    kapabilitasHeading: string;
    kapabilitasSubtext: string;
    kapabilitasBacaSelengkapnya: string;
    groupEcosystemEyebrow: string;
    groupEcosystemHeadline: string;
    groupEcosystemTagline: string;
    groupEcosystemPrimaryCta: string;
    groupEcosystemSecondaryCta: string;
    businessProjectsHeading: string;
    businessProjectsSubtext: string;
    businessProjectsEmpty: string;
    businessProjectsFieldDate: string;
    businessProjectsFieldCompany: string;
    businessProjectsFieldLocation: string;
    businessProjectsFieldProvince: string;
    businessProjectsEntityPrevious: string;
    businessProjectsEntityNext: string;
    businessProjectsPrevious: string;
    businessProjectsNext: string;
    jejakNegara: string;
    negaraLabel: string;
    trustedPartnersEyebrow: string;
    trustedPartnersHeading: string;
    trustedPartnersIntro: string;
    trustedPartnersStatProyek: string;
    trustedPartnersStatProvinsi: string;
    trustedPartnersStatNegara: string;
    clientsEyebrow: string;
    clientsKosong: string;
    pesanPimpinanHeading: string;
    pesanPimpinanJabatan: string;
    greenBusiness: string;
    pesanPimpinan: string;
    pesanCeoPending: string;
    manifestoPending: string;
    ctaJudul: string;
    ctaDeskripsi: string;
    ctaTombol: string;
  };
  entitas: {
    eyebrow: string;
    judul: string;
    intro: string;
    legalitas: string;
    legalitasPending: string;
    kembali: string;
  };
  bisnis: {
    eyebrow: string;
    judul: string;
    intro: string;
    dijalankanOleh: string;
    entitasTerkaitPending: string;
    kembali: string;
  };
  proyek: {
    breadcrumbParent: string;
    judul: string;
    heroSubheading: string;
    daftar: string;
    kosong: string;
    dikerjakanOleh: string;
    galeri: string;
    filterSemua: string;
    cariPlaceholder: string;
    cariSektorPlaceholder: string;
    tidakAdaHasil: string;
    portofolioLabel: string;
    /** "{start}", "{end}", "{total}" are replaced in place — see ProjectDirectoryList. */
    menampilkanTemplate: string;
    sebelumnya: string;
    berikutnya: string;
    daftarSubheading: string;
    belumMenemukanJudul: string;
    belumMenemukanDeskripsi: string;
    kontakLabel: string;
    kontakCakupan: Record<string, string>;
  };
  berita: {
    eyebrow: string;
    judul: string;
    intro: string;
    kosong: string;
    tidakDitemukan: string;
    tidakDitemukanDeskripsi: string;
  };
  pimpinan: {
    eyebrow: string;
    judul: string;
    intro: string;
    direksi: string;
    komisaris: string;
    direksiPending: string;
    komisarisPending: string;
  };
  tentangKami: {
    eyebrow: string;
    judul: string;
    heroHeading: string;
    heroSubheading: string;
    entitasDalamGrup: string;
    strukturOrganisasi: string;
    strukturPending: string;
    standarEyebrow: string;
    standarJudul: string;
    standarIntro: string;
  };
  kontak: {
    eyebrow: string;
    judul: string;
    intro: string;
    kantorPusat: string;
    formulir: string;
    formulirPending: string;
  };
  karier: { judul: string; deskripsi: string };
  unduhan: { judul: string; deskripsi: string };
  privasi: { judul: string; deskripsi: string; catatan: string };
  aksesibilitas: {
    tombolLabel: string;
    judul: string;
    deskripsi: string;
    tutup: string;
    resetSemua: string;
    resetTerkonfirmasi: string;
    aktif: string;
    nonaktif: string;
    min: string;
    maks: string;
    level: string;
    perbesar: string;
    perkecil: string;
    pengaturanTampilan: string;
    kategori: {
      penglihatan: { nama: string; deskripsi: string };
      keamananVisual: { nama: string; deskripsi: string };
      navigasiMotorik: { nama: string; deskripsi: string };
      membacaKognitif: { nama: string; deskripsi: string };
      pendengaran: { nama: string; deskripsi: string };
      kemudahanMemahami: { nama: string; deskripsi: string };
      preferensiBantuan: { nama: string; deskripsi: string };
    };
    fitur: {
      modeTunanetra: { judul: string; untuk: string; deskripsi: string };
      ukuranTeks: { judul: string; untuk: string; deskripsi: string };
      zoomHalaman: { judul: string; untuk: string; deskripsi: string };
      kontrasTinggi: { judul: string; untuk: string; deskripsi: string };
      kontrasTerbalik: { judul: string; untuk: string; deskripsi: string };
      modeGelap: { judul: string; untuk: string; deskripsi: string };
      fontMudahDibaca: { judul: string; untuk: string; deskripsi: string };
      tebalkanTeks: { judul: string; untuk: string; deskripsi: string };
      jarakTeks: { judul: string; untuk: string; deskripsi: string };
      penyorotanTautan: { judul: string; untuk: string; deskripsi: string };
      filterWarna: {
        judul: string;
        untuk: string;
        deskripsi: string;
        intensitas: string;
        reset: string;
        opsi: { none: string; protanopia: string; deuteranopia: string; tritanopia: string; grayscale: string };
        opsiDeskripsi: { none: string; protanopia: string; deuteranopia: string; tritanopia: string; grayscale: string };
      };
      profilKejang: { judul: string; untuk: string; deskripsi: string; diterapkan: string };
      hentikanAnimasi: { judul: string; untuk: string; deskripsi: string };
      kurangiGerakan: { judul: string; untuk: string; deskripsi: string };
      nonaktifkanVideo: { judul: string; untuk: string; deskripsi: string };
      kurangiEfekVisual: { judul: string; untuk: string; deskripsi: string };
      kursorBesar: { judul: string; untuk: string; deskripsi: string };
      sorotanKursor: { judul: string; untuk: string; deskripsi: string };
      ukuranSorotanKursor: { judul: string; untuk: string; deskripsi: string };
      navigasiKeyboard: { judul: string; untuk: string; deskripsi: string };
      fokusJelas: { judul: string; untuk: string; deskripsi: string };
      areaKlik: { judul: string; untuk: string; deskripsi: string };
      sederhanakanInteraksi: { judul: string; untuk: string; deskripsi: string };
      modeFokusMembaca: { judul: string; untuk: string; deskripsi: string };
      garisBantu: { judul: string; untuk: string; deskripsi: string };
      penyorotanArea: { judul: string; untuk: string; deskripsi: string };
      jarakBaris: { judul: string; untuk: string; deskripsi: string };
      lebarTeks: { judul: string; untuk: string; deskripsi: string };
      pembacaTeks: {
        judul: string;
        untuk: string;
        deskripsi: string;
        mulai: string;
        jeda: string;
        lanjutkan: string;
        berhenti: string;
        tidakDidukung: string;
      };
      takarir: { judul: string; untuk: string; deskripsi: string };
      transkrip: { judul: string; untuk: string; deskripsi: string };
      indikatorSuara: { judul: string; untuk: string; deskripsi: string };
      alternatifAudio: { judul: string; untuk: string; deskripsi: string };
      bahasaSederhana: { judul: string; untuk: string; deskripsi: string };
      pengurangDistraksi: { judul: string; untuk: string; deskripsi: string };
      strukturKonten: { judul: string; untuk: string; deskripsi: string };
      petunjukFormulir: { judul: string; untuk: string; deskripsi: string };
      pesanKesalahan: { judul: string; untuk: string; deskripsi: string };
      bantuanNavigasi: { judul: string; untuk: string; deskripsi: string };
    };
    info: { judul: string; isi: string };
    panduan: { judul: string; isi: string };
    profil: {
      judul: string;
      intro: string;
      aktifkanProfil: string;
      nonaktifkanProfil: string;
      profilAktif: string;
      daftar: {
        lowVision: { nama: string; deskripsi: string };
        focusDistraction: { nama: string; deskripsi: string };
        reading: { nama: string; deskripsi: string };
        motor: { nama: string; deskripsi: string };
        visualSensitivity: { nama: string; deskripsi: string };
        colorPerception: { nama: string; deskripsi: string };
      };
    };
  };
};

const id: Messages = {
  nav: {
    utama: 'Navigasi utama',
    footer: 'Navigasi footer',
    mobile: 'Navigasi mobile',
    menu: 'Menu',
    tutup: 'Tutup',
    pilihBahasa: 'Pilih bahasa',
    beranda: 'Kembali ke halaman utama',
  },
  common: {
    pendingContent: 'Konten halaman ini sedang disiapkan.',
    layanan: 'Layanan',
    layananPending: 'Rincian layanan akan segera hadir.',
    selengkapnya: 'Selengkapnya',
  },
  beranda: {
    angkaKunciEyebrow: 'Sekilas Angka',
    kapabilitasHeading: 'Satu Grup, Beragam Kapabilitas',
    kapabilitasSubtext:
      'lima bidang kerja utama, didukung tenaga ahli, laboratorium terakreditasi, dan lembaga sertifikasi di dalam satu grup.',
    kapabilitasBacaSelengkapnya: 'Baca Selengkapnya',
    groupEcosystemEyebrow: 'Environesia',
    groupEcosystemHeadline: 'Beragam Keahlian. Satu Ekosistem.',
    groupEcosystemTagline:
      'Ekosistem layanan lingkungan yang menghubungkan keahlian, teknologi, dan sumber daya manusia.',
    groupEcosystemPrimaryCta: 'Kenali Environesia',
    groupEcosystemSecondaryCta: 'Direksi & Manajemen',
    businessProjectsHeading: 'Lini Bisnis dan Proyek Berjalan',
    businessProjectsSubtext: 'Portofolio pekerjaan dari berbagai entitas dalam Environesia.',
    businessProjectsEmpty: 'Daftar proyek sedang disiapkan.',
    businessProjectsFieldDate: 'Tanggal',
    businessProjectsFieldCompany: 'Perusahaan',
    businessProjectsFieldLocation: 'Lokasi',
    businessProjectsFieldProvince: 'Provinsi',
    businessProjectsEntityPrevious: 'Entitas sebelumnya',
    businessProjectsEntityNext: 'Entitas berikutnya',
    businessProjectsPrevious: 'Proyek sebelumnya',
    businessProjectsNext: 'Proyek berikutnya',
    jejakNegara: 'Jejak Operasional',
    negaraLabel: 'Negara',
    trustedPartnersEyebrow: 'TRUSTED PARTNERS',
    trustedPartnersHeading: 'Dipercaya oleh Berbagai Mitra',
    trustedPartnersIntro:
      'Kepercayaan dari berbagai perusahaan, institusi, dan mitra menjadi bagian dari perjalanan Environesia dalam menghadirkan solusi lingkungan yang profesional dan berkelanjutan.',
    trustedPartnersStatProyek: 'Proyek',
    trustedPartnersStatProvinsi: 'Provinsi',
    trustedPartnersStatNegara: 'Negara',
    clientsEyebrow: 'Klien & Mitra',
    clientsKosong: 'Daftar klien dan mitra sedang disiapkan.',
    pesanPimpinanHeading: 'Sepuluh Tahun Membangun Kepercayaan',
    pesanPimpinanJabatan: 'Direktur Utama PT Environesia Global Saraya',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Pesan Pimpinan',
    pesanCeoPending: 'Kutipan pesan CEO menyusul.',
    manifestoPending: 'Manifesto Green Business akan segera hadir di sini.',
    ctaJudul: 'Mari berdiskusi tentang kebutuhan Anda',
    ctaDeskripsi: 'Hubungi tim kami untuk konsultasi, pengujian, pelatihan, atau sertifikasi.',
    ctaTombol: 'Hubungi Kami',
  },
  entitas: {
    eyebrow: 'Struktur Grup',
    judul: 'Entitas Kami',
    intro:
      'Lima entitas yang bergerak di konsultasi lingkungan, pengujian dan sampling, pelatihan kompetensi, sertifikasi profesi, serta konveksi custom apparel.',
    legalitas: 'Legalitas & Akreditasi',
    legalitasPending: 'Data legalitas akan segera hadir.',
    kembali: 'Semua entitas',
  },
  bisnis: {
    eyebrow: 'Layanan',
    judul: 'Pilar Bisnis',
    intro:
      'Empat pilar yang membentuk satu rantai layanan berurutan, dari perencanaan hingga pengakuan kompetensi.',
    dijalankanOleh: 'Dijalankan Oleh',
    entitasTerkaitPending: 'Entitas terkait akan segera hadir.',
    kembali: 'Semua pilar',
  },
  proyek: {
    breadcrumbParent: 'Proyek & Insight',
    judul: 'Portofolio Proyek',
    heroSubheading: 'Lebih dari 1.000 Proyek, Beragam Sektor dan Wilayah',
    daftar: 'Daftar Proyek',
    kosong: 'Daftar proyek sedang disiapkan.',
    dikerjakanOleh: 'Dikerjakan Oleh',
    galeri: 'Galeri',
    filterSemua: 'Semua Sektor',
    cariPlaceholder: 'Cari nama proyek, klien, atau lokasi…',
    cariSektorPlaceholder: 'Cari sektor…',
    tidakAdaHasil: 'Tidak ada proyek yang sesuai dengan pencarian.',
    portofolioLabel: 'Portofolio Proyek',
    menampilkanTemplate: 'Menampilkan {start}–{end} dari {total} proyek',
    sebelumnya: 'Sebelumnya',
    berikutnya: 'Berikutnya',
    daftarSubheading: 'Jelajahi pengalaman Environesia berdasarkan sektor, wilayah, dan periode pelaksanaan.',
    belumMenemukanJudul: 'Belum Menemukan Proyek yang Anda Cari?',
    belumMenemukanDeskripsi: 'Daftar ini terus diperbarui berdasarkan data rekam jejak yang tersedia pada Environesia. Apabila suatu proyek belum tercantum atau terdapat informasi yang perlu diperbarui, silakan menghubungi perusahaan terkait untuk membantu verifikasi dan pembaruan data.',
    kontakLabel: 'Kontak',
    kontakCakupan: {
      'environesia-consultant': 'Rekam jejak konsultansi lingkungan',
      'greenlab': 'Rekam jejak pengujian laboratorium',
      'greenskill': 'Rekam jejak pelatihan dan pengembangan',
      'lsp-praktisi-lingkungan': 'Rekam jejak sertifikasi kompetensi',
      'bikin-indonesia-berdaya': 'Rekam jejak program pemberdayaan',
    },
  },
  berita: {
    eyebrow: 'Publikasi',
    judul: 'Berita & Insight',
    intro: 'Kabar terbaru dan wawasan dari tim grup.',
    kosong: 'Belum ada berita terbaru.',
    tidakDitemukan: 'Berita tidak ditemukan',
    tidakDitemukanDeskripsi: 'Halaman berita yang Anda cari tidak tersedia.',
  },
  pimpinan: {
    eyebrow: 'Kepemimpinan',
    judul: 'Pimpinan',
    intro: 'Jajaran kepemimpinan yang mengarahkan grup dan entitas di bawahnya.',
    direksi: 'Direksi',
    komisaris: 'Komisaris',
    direksiPending: 'Profil jajaran direksi sedang disiapkan.',
    komisarisPending: 'Keberadaan dewan komisaris belum dikonfirmasi.',
  },
  tentangKami: {
    eyebrow: 'Profil',
    judul: 'Tentang Kami',
    heroHeading: 'Tentang Environesia',
    heroSubheading: 'Satu Grup, Beragam Keahlian, Terhubung dalam Satu Ekosistem.',
    entitasDalamGrup: 'Entitas dalam grup',
    strukturOrganisasi: 'Struktur Organisasi',
    strukturPending: 'Susunan organisasi tingkat personel sedang disiapkan.',
    standarEyebrow: 'Standar Kami',
    standarJudul: 'Standar yang Kami Pegang dan Jalankan',
    standarIntro:
      'Setiap pekerjaan kami dijalankan dengan standar profesional, kepatuhan terhadap regulasi, kompetensi teknis, dan prinsip kerja yang konsisten, bukan formalitas, melainkan cara kami bekerja setiap hari.',
  },
  kontak: {
    eyebrow: 'Hubungi Kami',
    judul: 'Kontak',
    intro:
      'Untuk kebutuhan konsultasi, pengujian, pelatihan, atau sertifikasi lingkungan, tim kami dapat dihubungi melalui kantor pusat.',
    kantorPusat: 'Kantor Pusat',
    formulir: 'Formulir',
    formulirPending: 'Formulir kontak akan tersedia setelah kebijakan privasi terbit.',
  },
  karier: { judul: 'Karier', deskripsi: 'Peluang berkarier bersama grup.' },
  unduhan: {
    judul: 'Unduhan',
    deskripsi: 'Dokumen resmi grup untuk keperluan tender dan prakualifikasi.',
  },
  privasi: {
    judul: 'Kebijakan Privasi',
    deskripsi: 'Bagaimana kami menangani data yang Anda berikan.',
    catatan: 'Naskah kebijakan privasi sedang disusun bersama tim legal.',
  },
  aksesibilitas: {
    tombolLabel: 'Buka pengaturan aksesibilitas',
    judul: 'Pusat Aksesibilitas',
    deskripsi: 'Sesuaikan pengalaman website sesuai kebutuhan Anda.',
    tutup: 'Tutup',
    resetSemua: 'Reset Semua Pengaturan',
    resetTerkonfirmasi: 'Semua pengaturan telah direset ke kondisi awal.',
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
    min: 'Kecil',
    maks: 'Besar',
    level: 'Tingkat',
    perbesar: 'Perbesar',
    perkecil: 'Perkecil',
    pengaturanTampilan: 'Pengaturan Tampilan',
    kategori: {
      penglihatan: { nama: 'Penglihatan', deskripsi: 'Ukuran teks, kontras, warna, dan tipografi.' },
      keamananVisual: { nama: 'Keamanan Visual', deskripsi: 'Kurangi animasi dan gerakan yang berpotensi mengganggu.' },
      navigasiMotorik: { nama: 'Navigasi dan Motorik', deskripsi: 'Kursor, fokus, dan kemudahan berinteraksi.' },
      membacaKognitif: { nama: 'Membaca dan Kognitif', deskripsi: 'Bantuan fokus membaca dan pembaca teks.' },
      pendengaran: { nama: 'Pendengaran', deskripsi: 'Takarir, transkrip, dan alternatif konten audio.' },
      kemudahanMemahami: { nama: 'Kemudahan Memahami', deskripsi: 'Struktur konten dan kejelasan bahasa.' },
      preferensiBantuan: { nama: 'Preferensi dan Bantuan', deskripsi: 'Reset, penyimpanan, dan panduan penggunaan.' },
    },
    fitur: {
      modeTunanetra: {
        judul: 'Panduan Pembaca Layar',
        untuk: 'Untuk pengguna tunanetra atau pengguna yang mengandalkan pembaca layar.',
        deskripsi:
          'Pelajari cara menavigasi menu, membaca judul, dan menggunakan kontrol website ini dengan pembaca layar Anda sendiri. Fitur ini tidak mengaktifkan pembaca layar sistem operasi Anda — situs ini dibangun dengan HTML semantik dan struktur heading yang sudah dapat dibaca pembaca layar yang sudah terpasang di perangkat Anda.',
      },
      ukuranTeks: {
        judul: 'Ukuran Teks',
        untuk: 'Untuk pengguna yang kesulitan membaca tulisan kecil.',
        deskripsi: 'Atur besar tulisan agar lebih nyaman dibaca, dari 80% hingga 150%.',
      },
      zoomHalaman: {
        judul: 'Zoom Halaman',
        untuk: 'Untuk pengguna yang ingin memperbesar seluruh tampilan halaman, bukan hanya teks.',
        deskripsi: 'Perbesar seluruh tampilan halaman. Pembesaran bawaan browser (Ctrl/Cmd + +) tetap berfungsi normal.',
      },
      kontrasTinggi: {
        judul: 'Kontras Tinggi',
        untuk: 'Untuk pengguna yang kesulitan membedakan teks dan latar belakang.',
        deskripsi: 'Tingkatkan kontras warna teks dan latar agar informasi lebih mudah terlihat.',
      },
      kontrasTerbalik: {
        judul: 'Kontras Terbalik',
        untuk: 'Untuk pengguna yang lebih nyaman membaca dengan latar gelap.',
        deskripsi: 'Balik skema warna halaman; gambar dan logo tidak ikut terbalik.',
      },
      modeGelap: {
        judul: 'Mode Gelap',
        untuk: 'Untuk pengguna yang sensitif terhadap layar terang.',
        deskripsi: 'Tampilkan latar gelap dengan teks terang di seluruh halaman.',
      },
      fontMudahDibaca: {
        judul: 'Font Mudah Dibaca',
        untuk: 'Untuk pengguna dengan disleksia atau kesulitan membaca huruf yang rapat.',
        deskripsi: 'Ganti ke tipografi yang dirancang khusus agar huruf lebih mudah dibedakan.',
      },
      tebalkanTeks: {
        judul: 'Tebalkan Teks',
        untuk: 'Untuk pengguna yang kesulitan membaca teks tipis.',
        deskripsi: 'Tambah ketebalan teks utama agar lebih mudah dibaca.',
      },
      jarakTeks: {
        judul: 'Jarak Teks',
        untuk: 'Untuk pengguna yang kesulitan membaca huruf dan kata yang rapat.',
        deskripsi: 'Tambah jarak antarhuruf dan antarkata secara bertahap.',
      },
      penyorotanTautan: {
        judul: 'Penyorotan Tautan',
        untuk: 'Untuk pengguna yang kesulitan membedakan tautan dari teks biasa.',
        deskripsi: 'Tandai semua tautan dengan garis bawah dan warna tegas.',
      },
      filterWarna: {
        judul: 'Filter Warna',
        untuk: 'Untuk pengguna dengan jenis gangguan persepsi warna tertentu.',
        deskripsi:
          'Filter ini membantu persepsi warna tertentu — hasilnya dapat berbeda pada setiap orang, dan tidak mendiagnosis atau memperbaiki buta warna.',
        intensitas: 'Intensitas Filter',
        reset: 'Reset Filter',
        opsi: {
          none: 'Tanpa Filter',
          protanopia: 'Merah–Hijau',
          deuteranopia: 'Hijau–Merah',
          tritanopia: 'Biru–Kuning',
          grayscale: 'Skala Abu-abu',
        },
        opsiDeskripsi: {
          none: 'Tampilan warna normal, tanpa penyesuaian.',
          protanopia: 'Untuk persepsi warna yang kurang peka terhadap merah.',
          deuteranopia: 'Untuk persepsi warna yang kurang peka terhadap hijau.',
          tritanopia: 'Untuk persepsi warna yang kurang peka terhadap biru-kuning.',
          grayscale: 'Menghilangkan warna sepenuhnya, hanya menyisakan terang-gelap.',
        },
      },
      profilKejang: {
        judul: 'Profil Aman untuk Kejang',
        untuk: 'Untuk pengguna yang sensitif terhadap gerakan dan kedipan layar.',
        deskripsi:
          'Aktifkan sekaligus: hentikan animasi, kurangi gerakan, dan nonaktifkan video otomatis. Tidak menjamin keamanan penuh bagi semua penderita epilepsi — konten berkedip yang berbahaya tetap harus diperbaiki pada sumbernya.',
        diterapkan: 'Diterapkan sekarang',
      },
      hentikanAnimasi: {
        judul: 'Hentikan Animasi',
        untuk: 'Untuk pengguna yang terganggu oleh animasi.',
        deskripsi: 'Hentikan animasi dan transisi dekoratif berbasis CSS di seluruh halaman.',
      },
      kurangiGerakan: {
        judul: 'Kurangi Gerakan',
        untuk: 'Untuk pengguna yang pusing atau terganggu oleh gerakan di layar.',
        deskripsi: 'Kurangi efek parallax dan transisi berlebihan.',
      },
      nonaktifkanVideo: {
        judul: 'Nonaktifkan Video Otomatis',
        untuk: 'Untuk pengguna yang tidak ingin video terputar otomatis.',
        deskripsi: 'Hentikan pemutaran otomatis video dekoratif di halaman.',
      },
      kurangiEfekVisual: {
        judul: 'Kurangi Efek Visual',
        untuk: 'Untuk pengguna yang terganggu oleh efek visual berlebihan.',
        deskripsi: 'Kurangi efek blur, bayangan, dan transisi dekoratif.',
      },
      kursorBesar: {
        judul: 'Ukuran Kursor',
        untuk: 'Untuk pengguna yang kesulitan menemukan penunjuk mouse.',
        deskripsi: 'Perbesar kursor agar lebih mudah ditemukan di layar, dari 100% hingga 200%. Dukungan ukuran kursor khusus bergantung pada perangkat dan browser Anda.',
      },
      sorotanKursor: {
        judul: 'Sorotan Kursor',
        untuk: 'Untuk pengguna yang kesulitan menemukan posisi penunjuk mouse.',
        deskripsi: 'Tampilkan halo tipis di sekitar posisi kursor tanpa menutupi tulisan di bawahnya.',
      },
      ukuranSorotanKursor: {
        judul: 'Ukuran Sorotan Kursor',
        untuk: 'Untuk pengguna yang membutuhkan halo kursor lebih besar atau lebih kecil.',
        deskripsi: 'Atur ukuran halo sorotan kursor secara bertahap.',
      },
      navigasiKeyboard: {
        judul: 'Navigasi Keyboard',
        untuk: 'Untuk pengguna yang menavigasi situs tanpa mouse.',
        deskripsi: 'Seluruh menu, tautan, tombol, dan formulir di situs ini dapat dioperasikan dengan keyboard (Tab, Enter, Escape).',
      },
      fokusJelas: {
        judul: 'Fokus yang Jelas',
        untuk: 'Untuk pengguna keyboard yang kesulitan melihat elemen yang sedang aktif.',
        deskripsi: 'Perkuat tampilan garis fokus keyboard agar lebih mudah terlihat.',
      },
      areaKlik: {
        judul: 'Area Klik Lebih Besar',
        untuk: 'Untuk pengguna dengan keterbatasan motorik.',
        deskripsi: 'Perbesar area yang dapat diklik pada tombol dan tautan.',
      },
      sederhanakanInteraksi: {
        judul: 'Penyederhanaan Interaksi',
        untuk: 'Untuk pengguna yang tidak menggunakan mouse.',
        deskripsi: 'Menu bertingkat di situs ini sudah dapat dibuka tanpa hover, cukup dengan fokus keyboard.',
      },
      modeFokusMembaca: {
        judul: 'Mode Fokus Membaca',
        untuk: 'Untuk pengguna yang mudah terdistraksi saat membaca.',
        deskripsi: 'Redupkan elemen header dan footer agar lebih fokus pada konten.',
      },
      garisBantu: {
        judul: 'Garis Bantu Membaca',
        untuk: 'Untuk pengguna yang mudah kehilangan baris saat membaca.',
        deskripsi: 'Tampilkan garis horizontal yang mengikuti posisi kursor.',
      },
      penyorotanArea: {
        judul: 'Penyorotan Area Baca',
        untuk: 'Untuk pengguna yang kesulitan fokus pada satu area teks.',
        deskripsi: 'Sorot area di sekitar kursor untuk membantu mengikuti bacaan.',
      },
      jarakBaris: {
        judul: 'Jarak Baris',
        untuk: 'Untuk pengguna yang kesulitan membaca teks yang rapat.',
        deskripsi: 'Tambah jarak antarbaris teks secara bertahap.',
      },
      lebarTeks: {
        judul: 'Lebar Teks',
        untuk: 'Untuk pengguna yang kesulitan mengikuti baris teks yang panjang.',
        deskripsi: 'Batasi lebar area baca agar baris teks lebih mudah diikuti.',
      },
      pembacaTeks: {
        judul: 'Pembaca Teks',
        untuk: 'Untuk pengguna yang lebih nyaman mendengarkan daripada membaca.',
        deskripsi: 'Dengarkan isi halaman ini dibacakan.',
        mulai: 'Mulai',
        jeda: 'Jeda',
        lanjutkan: 'Lanjutkan',
        berhenti: 'Berhenti',
        tidakDidukung: 'Pembaca teks tidak didukung pada browser ini.',
      },
      takarir: {
        judul: 'Dukungan Takarir',
        untuk: 'Untuk pengguna tuli atau sulit mendengar.',
        deskripsi: 'Situs ini belum memiliki video dengan percakapan yang memerlukan takarir.',
      },
      transkrip: {
        judul: 'Transkrip Audio/Video',
        untuk: 'Untuk pengguna tuli atau sulit mendengar.',
        deskripsi: 'Belum ada konten audio/video yang memerlukan transkrip saat ini.',
      },
      indikatorSuara: {
        judul: 'Indikator Visual untuk Notifikasi Suara',
        untuk: 'Untuk pengguna tuli atau sulit mendengar.',
        deskripsi: 'Seluruh notifikasi di situs ini (misalnya pesan berhasil disimpan) sudah berupa teks visual, tidak mengandalkan suara.',
      },
      alternatifAudio: {
        judul: 'Alternatif Informasi Audio',
        untuk: 'Untuk pengguna tuli atau sulit mendengar.',
        deskripsi: 'Belum ada konten audio informatif yang memerlukan alternatif teks saat ini.',
      },
      bahasaSederhana: {
        judul: 'Bahasa Sederhana',
        untuk: 'Untuk pengguna dengan keterbatasan kognitif atau yang berbahasa kedua.',
        deskripsi: 'Konten situs ditulis dengan bahasa yang jelas. Istilah teknis dan hukum sengaja dipertahankan agar maknanya tidak berubah.',
      },
      pengurangDistraksi: {
        judul: 'Pengurangan Distraksi',
        untuk: 'Untuk pengguna yang mudah terdistraksi elemen dekoratif.',
        deskripsi: 'Kurangi elemen dekoratif yang tidak diperlukan.',
      },
      strukturKonten: {
        judul: 'Struktur Konten yang Jelas',
        untuk: 'Untuk pengguna pembaca layar.',
        deskripsi: 'Urutan judul (heading) dan navigasi di situs ini disusun agar mudah diikuti pembaca layar.',
      },
      petunjukFormulir: {
        judul: 'Petunjuk Formulir',
        untuk: 'Untuk pengguna yang kesulitan mengisi formulir.',
        deskripsi: 'Setiap kolom formulir di situs ini memiliki label yang terhubung dan keterangan yang jelas.',
      },
      pesanKesalahan: {
        judul: 'Pesan Kesalahan yang Mudah Dipahami',
        untuk: 'Untuk pengguna yang kesulitan memahami pesan error.',
        deskripsi: 'Formulir menjelaskan kesalahan secara spesifik dan tidak menghapus isian yang sudah diketik.',
      },
      bantuanNavigasi: {
        judul: 'Bantuan Navigasi',
        untuk: 'Untuk pengguna keyboard dan pembaca layar.',
        deskripsi: 'Tautan "Lewati ke konten utama" tersedia di awal setiap halaman.',
      },
    },
    info: {
      judul: 'Tentang Toolbar Ini',
      isi:
        'Pengaturan ini mengubah tampilan dan perilaku situs langsung di perangkat Anda, tersimpan secara lokal, dan tidak dibagikan ke pihak lain. Toolbar ini membantu, tetapi tidak menggantikan perangkat bantu seperti pembaca layar yang sudah terpasang di perangkat Anda.',
    },
    panduan: {
      judul: 'Panduan Penggunaan',
      isi:
        'Gunakan Tab untuk berpindah antar elemen, Enter/Spasi untuk memilih, dan Escape untuk menutup panel ini. Pengaturan Anda tersimpan otomatis dan akan dimuat kembali saat Anda membuka situs ini lagi. Gunakan tombol "Reset Semua Pengaturan" untuk kembali ke kondisi awal.',
    },
    profil: {
      judul: 'Profil Aksesibilitas',
      intro: 'Pilih kebutuhan yang paling sesuai — setiap profil langsung mengaktifkan beberapa pengaturan relevan sekaligus.',
      aktifkanProfil: 'Aktifkan Profil',
      nonaktifkanProfil: 'Nonaktifkan Profil',
      profilAktif: 'Profil Aktif',
      daftar: {
        lowVision: {
          nama: 'Penglihatan Rendah',
          deskripsi: 'Untuk pengguna yang kesulitan melihat tulisan kecil atau membedakan elemen visual.',
        },
        focusDistraction: {
          nama: 'Fokus dan Minim Distraksi',
          deskripsi: 'Untuk pengguna yang membutuhkan tampilan lebih sederhana dengan lebih sedikit gangguan visual.',
        },
        reading: {
          nama: 'Membaca dan Pemrosesan Informasi',
          deskripsi: 'Untuk pengguna yang terbantu oleh teks yang lebih mudah dibaca dan tata letak yang teratur.',
        },
        motor: {
          nama: 'Navigasi Motorik',
          deskripsi: 'Untuk pengguna yang kesulitan menggunakan mouse secara presisi atau mengklik target kecil.',
        },
        visualSensitivity: {
          nama: 'Sensitivitas Visual',
          deskripsi: 'Untuk pengguna yang tidak nyaman dengan gerakan atau efek visual tertentu.',
        },
        colorPerception: {
          nama: 'Persepsi Warna',
          deskripsi: 'Untuk pengguna yang kesulitan membedakan kombinasi warna tertentu.',
        },
      },
    },
  },
};

const en: Messages = {
  nav: {
    utama: 'Main navigation',
    footer: 'Footer navigation',
    mobile: 'Mobile navigation',
    menu: 'Menu',
    tutup: 'Close',
    pilihBahasa: 'Choose language',
    beranda: 'Back to homepage',
  },
  common: {
    pendingContent: 'This page is being prepared.',
    layanan: 'Services',
    layananPending: 'Service details are coming soon.',
    selengkapnya: 'Explore further',
  },
  beranda: {
    angkaKunciEyebrow: 'At a Glance',
    kapabilitasHeading: 'One Group, Many Capabilities',
    kapabilitasSubtext:
      'Five core service lines, backed by specialists, accredited laboratories, and a certification body — all within one group.',
    kapabilitasBacaSelengkapnya: 'Read More',
    groupEcosystemEyebrow: 'Environesia',
    groupEcosystemHeadline: 'Diverse Expertise. One Ecosystem.',
    groupEcosystemTagline:
      'An environmental service ecosystem connecting expertise, technology, and human resources.',
    groupEcosystemPrimaryCta: 'Meet Environesia',
    groupEcosystemSecondaryCta: 'Directors & Management',
    businessProjectsHeading: 'Business Lines & Ongoing Projects',
    businessProjectsSubtext: 'A portfolio of work from the various entities across Environesia.',
    businessProjectsEmpty: 'The project list is being prepared.',
    businessProjectsFieldDate: 'Date',
    businessProjectsFieldCompany: 'Company',
    businessProjectsFieldLocation: 'Location',
    businessProjectsFieldProvince: 'Province',
    businessProjectsEntityPrevious: 'Previous entity',
    businessProjectsEntityNext: 'Next entity',
    businessProjectsPrevious: 'Previous project',
    businessProjectsNext: 'Next project',
    jejakNegara: 'Operational Reach',
    negaraLabel: 'Countries',
    trustedPartnersEyebrow: 'TRUSTED PARTNERS',
    trustedPartnersHeading: 'Trusted by a Wide Range of Partners',
    trustedPartnersIntro:
      'Trust from companies, institutions, and partners across sectors has shaped Environesia’s journey in delivering professional, sustainable environmental solutions.',
    trustedPartnersStatProyek: 'Projects',
    trustedPartnersStatProvinsi: 'Provinces',
    trustedPartnersStatNegara: 'Countries',
    clientsEyebrow: 'Clients & Partners',
    clientsKosong: 'The client and partner list is being prepared.',
    pesanPimpinanHeading: 'Ten Years of Building Trust',
    pesanPimpinanJabatan: 'President Director of PT Environesia Global Saraya',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Leadership Message',
    pesanCeoPending: "The CEO's message is coming soon.",
    manifestoPending: 'The Green Business manifesto will appear here soon.',
    ctaJudul: "Let's discuss what you need",
    ctaDeskripsi:
      'Contact our team for consulting, testing, training, or certification.',
    ctaTombol: 'Contact Us',
  },
  entitas: {
    eyebrow: 'Group Structure',
    judul: 'Our Entities',
    intro:
      'Five entities working across environmental consulting, testing and sampling, competency training, professional certification, and custom apparel manufacturing.',
    legalitas: 'Legal & Accreditation',
    legalitasPending: 'Legal details are coming soon.',
    kembali: 'All entities',
  },
  bisnis: {
    eyebrow: 'Services',
    judul: 'Business Pillars',
    intro:
      'Four pillars forming a single sequential service chain, from planning through to recognised competency.',
    dijalankanOleh: 'Delivered By',
    entitasTerkaitPending: 'Related entities are coming soon.',
    kembali: 'All pillars',
  },
  proyek: {
    breadcrumbParent: 'Projects & Insight',
    judul: 'Project Portfolio',
    heroSubheading: 'More Than 1,000 Projects, Across Sectors and Regions',
    daftar: 'Project List',
    kosong: 'The project list is being prepared.',
    dikerjakanOleh: 'Delivered By',
    galeri: 'Gallery',
    filterSemua: 'All Sectors',
    cariPlaceholder: 'Search by project name, client, or location…',
    cariSektorPlaceholder: 'Search sector…',
    tidakAdaHasil: 'No projects match this search.',
    portofolioLabel: 'Project Portfolio',
    menampilkanTemplate: 'Showing {start}–{end} of {total} projects',
    sebelumnya: 'Previous',
    berikutnya: 'Next',
    daftarSubheading: 'Explore Environesia’s experience by sector, region, and delivery period.',
    belumMenemukanJudul: 'Can\'t Find the Project You\'re Looking For?',
    belumMenemukanDeskripsi: 'This directory is updated from the track-record data currently available for Environesia. If a project is not yet listed or information needs updating, please contact the relevant company to help verify and update the data.',
    kontakLabel: 'Contact',
    kontakCakupan: {
      'environesia-consultant': 'Environmental consulting track record',
      'greenlab': 'Laboratory testing track record',
      'greenskill': 'Training and development track record',
      'lsp-praktisi-lingkungan': 'Competency certification track record',
      'bikin-indonesia-berdaya': 'Community empowerment program track record',
    },
  },
  berita: {
    eyebrow: 'Publications',
    judul: 'News & Insight',
    intro: 'Latest news and insight from the group.',
    kosong: 'No news yet.',
    tidakDitemukan: 'Article not found',
    tidakDitemukanDeskripsi: 'The article you are looking for is not available.',
  },
  pimpinan: {
    eyebrow: 'Leadership',
    judul: 'Leadership',
    intro: 'The leadership steering the group and the entities beneath it.',
    direksi: 'Board of Directors',
    komisaris: 'Board of Commissioners',
    direksiPending: 'Director profiles are being prepared.',
    komisarisPending: 'Whether a board of commissioners exists is not yet confirmed.',
  },
  tentangKami: {
    eyebrow: 'Profile',
    judul: 'About Us',
    heroHeading: 'About Environesia',
    heroSubheading: 'One Group, Diverse Expertise, Connected in One Ecosystem.',
    entitasDalamGrup: 'Entities in the group',
    strukturOrganisasi: 'Organisational Structure',
    strukturPending: 'The personnel-level organisational chart is being prepared.',
    standarEyebrow: 'Our Standards',
    standarJudul: 'The Standards We Hold and Practice',
    standarIntro:
      'Every project we deliver runs on professional standards, regulatory compliance, technical competence, and a consistent way of working, not a formality, but how we work every day.',
  },
  kontak: {
    eyebrow: 'Get in Touch',
    judul: 'Contact',
    intro:
      'For environmental consulting, testing, training, or certification, our team can be reached at the head office.',
    kantorPusat: 'Head Office',
    formulir: 'Form',
    formulirPending: 'The contact form will be available once the privacy policy is published.',
  },
  karier: { judul: 'Careers', deskripsi: 'Career opportunities with the group.' },
  unduhan: {
    judul: 'Downloads',
    deskripsi: 'Official group documents for tender and prequalification purposes.',
  },
  privasi: {
    judul: 'Privacy Policy',
    deskripsi: 'How we handle the data you provide.',
    catatan: 'The privacy policy is being drafted with our legal team.',
  },
  aksesibilitas: {
    tombolLabel: 'Open accessibility settings',
    judul: 'Accessibility Center',
    deskripsi: 'Adjust the website experience to fit your needs.',
    tutup: 'Close',
    resetSemua: 'Reset All Settings',
    resetTerkonfirmasi: 'All settings have been reset to default.',
    aktif: 'On',
    nonaktif: 'Off',
    min: 'Small',
    maks: 'Large',
    level: 'Level',
    perbesar: 'Increase',
    perkecil: 'Decrease',
    pengaturanTampilan: 'Display Settings',
    kategori: {
      penglihatan: { nama: 'Vision', deskripsi: 'Text size, contrast, color, and typography.' },
      keamananVisual: { nama: 'Visual Safety', deskripsi: 'Reduce animation and potentially disturbing motion.' },
      navigasiMotorik: { nama: 'Navigation & Motor', deskripsi: 'Cursor, focus, and ease of interaction.' },
      membacaKognitif: { nama: 'Reading & Cognitive', deskripsi: 'Reading-focus aids and the text reader.' },
      pendengaran: { nama: 'Hearing', deskripsi: 'Captions, transcripts, and audio content alternatives.' },
      kemudahanMemahami: { nama: 'Ease of Understanding', deskripsi: 'Content structure and clarity of language.' },
      preferensiBantuan: { nama: 'Preferences & Help', deskripsi: 'Reset, saved settings, and the usage guide.' },
    },
    fitur: {
      modeTunanetra: {
        judul: 'Screen Reader Guide',
        untuk: 'For blind users or users who rely on a screen reader.',
        deskripsi:
          'Learn how to navigate menus, read headings, and use this website’s controls with your own screen reader. This doesn’t turn on your operating system’s screen reader — this site is built with semantic HTML and a heading structure that’s already readable by the screen reader already installed on your device.',
      },
      ukuranTeks: {
        judul: 'Text Size',
        untuk: 'For users who find small text hard to read.',
        deskripsi: 'Adjust text size for more comfortable reading, from 80% to 150%.',
      },
      zoomHalaman: {
        judul: 'Page Zoom',
        untuk: 'For users who want to enlarge the entire page view, not just the text.',
        deskripsi: 'Enlarge the entire page view. Your browser’s own zoom (Ctrl/Cmd + +) still works normally.',
      },
      kontrasTinggi: {
        judul: 'High Contrast',
        untuk: 'For users who find it hard to tell text apart from the background.',
        deskripsi: 'Increase the contrast between text and background so information is easier to see.',
      },
      kontrasTerbalik: {
        judul: 'Invert Contrast',
        untuk: 'For users who find a dark background more comfortable.',
        deskripsi: 'Invert the page color scheme; images and logos are not inverted.',
      },
      modeGelap: {
        judul: 'Dark Mode',
        untuk: 'For users sensitive to bright screens.',
        deskripsi: 'Dark background with light text across the page.',
      },
      fontMudahDibaca: {
        judul: 'Readable Font',
        untuk: 'For users with dyslexia or who find tightly-set letters hard to read.',
        deskripsi: 'Switch to a typeface designed for easier letter recognition.',
      },
      tebalkanTeks: {
        judul: 'Bold Text',
        untuk: 'For users who find thin text hard to read.',
        deskripsi: 'Thicken real body text so it\'s easier to read.',
      },
      jarakTeks: {
        judul: 'Text Spacing',
        untuk: 'For users who find tightly-set letters and words hard to read.',
        deskripsi: 'Add letter and word spacing in steps.',
      },
      penyorotanTautan: {
        judul: 'Link Highlighting',
        untuk: 'For users who find it hard to tell links apart from regular text.',
        deskripsi: 'Underline and emphasize every link so it stands out.',
      },
      filterWarna: {
        judul: 'Color Filter',
        untuk: 'For users with a specific type of color-perception difference.',
        deskripsi:
          'This filter assists certain kinds of color perception — results vary from person to person, and it does not diagnose or correct color blindness.',
        intensitas: 'Filter Intensity',
        reset: 'Reset Filter',
        opsi: {
          none: 'No Filter',
          protanopia: 'Red–Green',
          deuteranopia: 'Green–Red',
          tritanopia: 'Blue–Yellow',
          grayscale: 'Grayscale',
        },
        opsiDeskripsi: {
          none: 'Normal color display, no adjustment.',
          protanopia: 'For color perception less sensitive to red.',
          deuteranopia: 'For color perception less sensitive to green.',
          tritanopia: 'For color perception less sensitive to blue-yellow.',
          grayscale: 'Removes color entirely, leaving only light and dark.',
        },
      },
      profilKejang: {
        judul: 'Seizure-Safe Profile',
        untuk: 'For users sensitive to motion and screen flashing.',
        deskripsi:
          'Turns on all at once: stop animations, reduce motion, and disable autoplay video. Does not guarantee full safety for everyone with epilepsy — genuinely hazardous flashing content still needs to be fixed at its source.',
        diterapkan: 'Currently applied',
      },
      hentikanAnimasi: {
        judul: 'Stop Animations',
        untuk: 'For users bothered by animation.',
        deskripsi: 'Stop CSS-based decorative animations and transitions across the page.',
      },
      kurangiGerakan: {
        judul: 'Reduce Motion',
        untuk: 'For users who get dizzy or distracted by on-screen motion.',
        deskripsi: 'Reduce parallax and excessive transition effects.',
      },
      nonaktifkanVideo: {
        judul: 'Disable Autoplay Video',
        untuk: 'For users who don’t want video to start playing on its own.',
        deskripsi: 'Stop decorative videos on the page from autoplaying.',
      },
      kurangiEfekVisual: {
        judul: 'Reduce Visual Effects',
        untuk: 'For users bothered by heavy visual effects.',
        deskripsi: 'Reduce blur, shadow, and decorative transitions.',
      },
      kursorBesar: {
        judul: 'Cursor Size',
        untuk: 'For users who find it hard to locate the mouse pointer.',
        deskripsi: 'Enlarge the cursor so it’s easier to spot, from 100% to 200%. Support for a custom cursor size depends on your device and browser.',
      },
      sorotanKursor: {
        judul: 'Cursor Highlight',
        untuk: 'For users who find it hard to locate the mouse pointer\'s position.',
        deskripsi: 'Show a thin halo around your cursor position without covering the text underneath.',
      },
      ukuranSorotanKursor: {
        judul: 'Cursor Highlight Size',
        untuk: 'For users who need a larger or smaller cursor halo.',
        deskripsi: 'Adjust the cursor highlight halo size in steps.',
      },
      navigasiKeyboard: {
        judul: 'Keyboard Navigation',
        untuk: 'For users who navigate the site without a mouse.',
        deskripsi: 'Every menu, link, button, and form on this site can be operated with a keyboard (Tab, Enter, Escape).',
      },
      fokusJelas: {
        judul: 'Clear Focus',
        untuk: 'For keyboard users who find it hard to see which element is active.',
        deskripsi: 'Strengthen the keyboard focus outline so it’s easier to see.',
      },
      areaKlik: {
        judul: 'Larger Click Areas',
        untuk: 'For users with motor limitations.',
        deskripsi: 'Enlarge the clickable area on buttons and links.',
      },
      sederhanakanInteraksi: {
        judul: 'Simplified Interaction',
        untuk: 'For users who don’t use a mouse.',
        deskripsi: 'Dropdown menus on this site already open without hovering — keyboard focus alone is enough.',
      },
      modeFokusMembaca: {
        judul: 'Reading Focus Mode',
        untuk: 'For users who are easily distracted while reading.',
        deskripsi: 'Dim the header and footer to focus on the content.',
      },
      garisBantu: {
        judul: 'Reading Guide Line',
        untuk: 'For users who easily lose their place while reading.',
        deskripsi: 'Show a horizontal line that follows your cursor.',
      },
      penyorotanArea: {
        judul: 'Reading Area Highlight',
        untuk: 'For users who find it hard to focus on one area of text.',
        deskripsi: 'Highlight the area around your cursor to help you follow the text.',
      },
      jarakBaris: {
        judul: 'Line Height',
        untuk: 'For users who find tightly-set text hard to read.',
        deskripsi: 'Add spacing between lines of text in steps.',
      },
      lebarTeks: {
        judul: 'Text Width',
        untuk: 'For users who find long lines of text hard to follow.',
        deskripsi: 'Constrain the reading width so lines are easier to follow.',
      },
      pembacaTeks: {
        judul: 'Text Reader',
        untuk: 'For users who find listening more comfortable than reading.',
        deskripsi: 'Listen to this page’s content read aloud.',
        mulai: 'Start',
        jeda: 'Pause',
        lanjutkan: 'Resume',
        berhenti: 'Stop',
        tidakDidukung: 'Text reading is not supported in this browser.',
      },
      takarir: {
        judul: 'Caption Support',
        untuk: 'For deaf or hard-of-hearing users.',
        deskripsi: 'This site doesn’t yet have any video with spoken content that needs captions.',
      },
      transkrip: {
        judul: 'Audio/Video Transcript',
        untuk: 'For deaf or hard-of-hearing users.',
        deskripsi: 'There’s no audio/video content that needs a transcript at this time.',
      },
      indikatorSuara: {
        judul: 'Visual Indicator for Sound Notifications',
        untuk: 'For deaf or hard-of-hearing users.',
        deskripsi: 'Every notification on this site (e.g. a save-success message) is already shown as visual text, never sound alone.',
      },
      alternatifAudio: {
        judul: 'Audio Content Alternative',
        untuk: 'For deaf or hard-of-hearing users.',
        deskripsi: 'There’s no informative audio content that needs a text alternative at this time.',
      },
      bahasaSederhana: {
        judul: 'Plain Language',
        untuk: 'For users with cognitive limitations or who speak the site’s language as a second language.',
        deskripsi: 'Site content is written clearly. Technical and legal terms are kept as-is so their meaning isn’t changed.',
      },
      pengurangDistraksi: {
        judul: 'Reduce Distraction',
        untuk: 'For users easily distracted by decorative elements.',
        deskripsi: 'Reduce unnecessary decorative elements.',
      },
      strukturKonten: {
        judul: 'Clear Content Structure',
        untuk: 'For screen reader users.',
        deskripsi: 'Heading order and navigation on this site are arranged to be easy for screen readers to follow.',
      },
      petunjukFormulir: {
        judul: 'Form Guidance',
        untuk: 'For users who find forms hard to fill in.',
        deskripsi: 'Every form field on this site has a connected label and clear instructions.',
      },
      pesanKesalahan: {
        judul: 'Clear Error Messages',
        untuk: 'For users who find error messages hard to understand.',
        deskripsi: 'Forms explain errors specifically and never clear what you’ve already typed.',
      },
      bantuanNavigasi: {
        judul: 'Navigation Aid',
        untuk: 'For keyboard and screen-reader users.',
        deskripsi: 'A "Skip to main content" link is available at the top of every page.',
      },
    },
    info: {
      judul: 'About This Toolbar',
      isi:
        'These settings change the site’s appearance and behavior on your own device, are stored locally, and are never shared. This toolbar helps, but doesn’t replace assistive technology such as the screen reader already installed on your device.',
    },
    panduan: {
      judul: 'Usage Guide',
      isi:
        'Use Tab to move between elements, Enter/Space to select, and Escape to close this panel. Your settings are saved automatically and restored next time you visit. Use "Reset All Settings" to return to the defaults.',
    },
    profil: {
      judul: 'Accessibility Profiles',
      intro: 'Pick whichever fits your needs — each profile turns on several relevant settings at once.',
      aktifkanProfil: 'Apply Profile',
      nonaktifkanProfil: 'Turn Off Profile',
      profilAktif: 'Active Profile',
      daftar: {
        lowVision: {
          nama: 'Low Vision',
          deskripsi: 'For users who find small text hard to see or have trouble telling visual elements apart.',
        },
        focusDistraction: {
          nama: 'Focus & Low Distraction',
          deskripsi: 'For users who need a simpler view with fewer visual distractions.',
        },
        reading: {
          nama: 'Reading & Information Processing',
          deskripsi: 'For users helped by easier-to-read text and a more orderly layout.',
        },
        motor: {
          nama: 'Motor Navigation',
          deskripsi: 'For users who find precise mouse use, or clicking small targets, difficult.',
        },
        visualSensitivity: {
          nama: 'Visual Sensitivity',
          deskripsi: 'For users uncomfortable with certain motion or visual effects.',
        },
        colorPerception: {
          nama: 'Color Perception',
          deskripsi: 'For users who find certain color combinations hard to tell apart.',
        },
      },
    },
  },
};

const zh: Messages = {
  nav: {
    utama: '主导航',
    footer: '页脚导航',
    mobile: '移动导航',
    menu: '菜单',
    tutup: '关闭',
    pilihBahasa: '选择语言',
    beranda: '返回首页',
  },
  common: {
    pendingContent: '本页内容正在筹备中。',
    layanan: '服务',
    layananPending: '服务详情即将发布。',
    selengkapnya: '了解更多',
  },
  beranda: {
    angkaKunciEyebrow: '数据概览',
    kapabilitasHeading: '同一集团,多元能力',
    kapabilitasSubtext: '五大核心业务领域,由专业人才、认证实验室与认证机构共同支撑,同属一个集团。',
    kapabilitasBacaSelengkapnya: '阅读更多',
    groupEcosystemEyebrow: 'Environesia',
    groupEcosystemHeadline: '多元专长,一个生态系统。',
    groupEcosystemTagline: '连接专业知识、技术与人力资源的环境服务生态系统。',
    groupEcosystemPrimaryCta: '认识 Environesia',
    groupEcosystemSecondaryCta: '董事与管理层',
    businessProjectsHeading: '业务领域与进行中的项目',
    businessProjectsSubtext: '来自 Environesia 各企业的工作作品集。',
    businessProjectsEmpty: '项目列表正在整理中。',
    businessProjectsFieldDate: '日期',
    businessProjectsFieldCompany: '公司',
    businessProjectsFieldLocation: '地点',
    businessProjectsFieldProvince: '省份',
    businessProjectsEntityPrevious: '上一个实体',
    businessProjectsEntityNext: '下一个实体',
    businessProjectsPrevious: '上一个项目',
    businessProjectsNext: '下一个项目',
    jejakNegara: '业务足迹',
    negaraLabel: '国家',
    trustedPartnersEyebrow: 'TRUSTED PARTNERS',
    trustedPartnersHeading: '获得众多合作伙伴的信任',
    trustedPartnersIntro: '来自各类企业、机构与合作伙伴的信任,是 Environesia 在提供专业、可持续环境解决方案道路上的重要部分。',
    trustedPartnersStatProyek: '项目',
    trustedPartnersStatProvinsi: '省份',
    trustedPartnersStatNegara: '国家',
    clientsEyebrow: '客户与合作伙伴',
    clientsKosong: '客户与合作伙伴名单正在筹备中。',
    pesanPimpinanHeading: '十年历程,铸就信任',
    pesanPimpinanJabatan: 'PT Environesia Global Saraya 董事总经理',
    greenBusiness: '绿色商业',
    pesanPimpinan: '领导致辞',
    pesanCeoPending: '首席执行官致辞即将发布。',
    manifestoPending: '绿色商业宣言即将在此发布。',
    ctaJudul: '欢迎与我们探讨您的需求',
    ctaDeskripsi: '如需咨询、检测、培训或认证服务，请联系我们的团队。',
    ctaTombol: '联系我们',
  },
  entitas: {
    eyebrow: '集团架构',
    judul: '旗下企业',
    intro:
      '五家企业分别从事环境咨询、检测与采样、能力培训、职业认证，以及定制服装制造。',
    legalitas: '资质与认证',
    legalitasPending: '资质信息即将发布。',
    kembali: '全部企业',
  },
  bisnis: {
    eyebrow: '服务',
    judul: '业务支柱',
    intro: '四大支柱构成一条完整的服务链，从规划直至能力认证。',
    dijalankanOleh: '承接企业',
    entitasTerkaitPending: '相关企业信息即将发布。',
    kembali: '全部支柱',
  },
  proyek: {
    breadcrumbParent: '项目与洞察',
    judul: '项目组合',
    heroSubheading: '超过1000个项目，覆盖多个行业与地区',
    daftar: '项目列表',
    kosong: '项目列表正在筹备中。',
    dikerjakanOleh: '承接企业',
    galeri: '图库',
    filterSemua: '全部行业',
    cariPlaceholder: '搜索项目名称、客户或地点…',
    cariSektorPlaceholder: '搜索行业…',
    tidakAdaHasil: '没有符合搜索条件的项目。',
    portofolioLabel: '项目组合',
    menampilkanTemplate: '显示第 {start}–{end} 项，共 {total} 个项目',
    sebelumnya: '上一页',
    berikutnya: '下一页',
    daftarSubheading: '按行业、地区和执行阶段，探索 Environesia 的经验。',
    belumMenemukanJudul: '没有找到您要的项目？',
    belumMenemukanDeskripsi: '本目录根据 Environesia 目前可用的业绩记录持续更新。若某项目尚未列出或信息需要更新，请联系相关公司协助核实和更新数据。',
    kontakLabel: '联系方式',
    kontakCakupan: {
      'environesia-consultant': '环境咨询业绩记录',
      'greenlab': '实验室检测业绩记录',
      'greenskill': '培训与发展业绩记录',
      'lsp-praktisi-lingkungan': '能力认证业绩记录',
      'bikin-indonesia-berdaya': '赋能项目业绩记录',
    },
  },
  berita: {
    eyebrow: '出版物',
    judul: '新闻与洞察',
    intro: '来自集团团队的最新动态与洞察。',
    kosong: '暂无最新消息。',
    tidakDitemukan: '未找到该文章',
    tidakDitemukanDeskripsi: '您查找的文章不存在。',
  },
  pimpinan: {
    eyebrow: '领导团队',
    judul: '领导团队',
    intro: '带领集团及旗下企业发展的领导团队。',
    direksi: '董事会',
    komisaris: '监事会',
    direksiPending: '董事简介正在筹备中。',
    komisarisPending: '监事会是否设立尚未确认。',
  },
  tentangKami: {
    eyebrow: '简介',
    judul: '关于我们',
    heroHeading: '关于 Environesia',
    heroSubheading: '一个集团，多元专长，融汇于一个生态系统。',
    entitasDalamGrup: '集团旗下企业',
    strukturOrganisasi: '组织架构',
    strukturPending: '人员层级的组织架构正在筹备中。',
    standarEyebrow: '我们的标准',
    standarJudul: '我们秉持并落实的标准',
    standarIntro: '我们执行的每一项工作都遵循专业标准、法规合规、技术能力与一致的工作原则，这不是形式，而是我们每天的工作方式。',
  },
  kontak: {
    eyebrow: '联系我们',
    judul: '联系方式',
    intro: '如需环境咨询、检测、培训或认证服务，欢迎通过总部与我们的团队联系。',
    kantorPusat: '总部',
    formulir: '表单',
    formulirPending: '隐私政策发布后，联系表单即可使用。',
  },
  karier: { judul: '招聘', deskripsi: '加入集团的职业发展机会。' },
  unduhan: {
    judul: '下载',
    deskripsi: '用于招投标与资格预审的集团官方文件。',
  },
  privasi: {
    judul: '隐私政策',
    deskripsi: '我们如何处理您提供的数据。',
    catatan: '隐私政策文本正在与法务团队共同起草。',
  },
  aksesibilitas: {
    tombolLabel: '打开无障碍设置',
    judul: '无障碍中心',
    deskripsi: '根据您的需求调整网站的使用体验。',
    tutup: '关闭',
    resetSemua: '重置所有设置',
    resetTerkonfirmasi: '所有设置已重置为初始状态。',
    aktif: '已开启',
    nonaktif: '已关闭',
    min: '小',
    maks: '大',
    level: '级别',
    perbesar: '放大',
    perkecil: '缩小',
    pengaturanTampilan: '显示设置',
    kategori: {
      penglihatan: { nama: '视觉', deskripsi: '文字大小、对比度、色彩与字体。' },
      keamananVisual: { nama: '视觉安全', deskripsi: '减少可能引起不适的动画与动态效果。' },
      navigasiMotorik: { nama: '导航与行动能力', deskripsi: '光标、焦点与交互便利性。' },
      membacaKognitif: { nama: '阅读与认知', deskripsi: '阅读专注辅助与朗读功能。' },
      pendengaran: { nama: '听觉', deskripsi: '字幕、文字稿与音频内容替代方案。' },
      kemudahanMemahami: { nama: '易于理解', deskripsi: '内容结构与语言清晰度。' },
      preferensiBantuan: { nama: '偏好与帮助', deskripsi: '重置、已保存设置与使用指南。' },
    },
    fitur: {
      modeTunanetra: {
        judul: '屏幕阅读器指南',
        untuk: '适用于视障用户或依赖屏幕阅读器的用户。',
        deskripsi: '了解如何用您自己的屏幕阅读器浏览菜单、朗读标题并使用本网站的控件。此功能不会开启您操作系统的屏幕阅读器——本网站采用语义化 HTML 与标题结构，您设备上已安装的屏幕阅读器可直接读取。',
      },
      ukuranTeks: { judul: '文字大小', untuk: '适用于难以阅读小字的用户。', deskripsi: '调整文字大小以获得更舒适的阅读体验，范围为 80% 至 150%。' },
      zoomHalaman: {
        judul: '页面缩放',
        untuk: '适用于想放大整个页面、而不只是文字的用户。',
        deskripsi: '放大整个页面显示。浏览器自带的缩放功能（Ctrl/Cmd + +）仍可正常使用。',
      },
      kontrasTinggi: { judul: '高对比度', untuk: '适用于难以区分文字与背景的用户。', deskripsi: '提高文字与背景之间的对比度，使信息更易辨识。' },
      kontrasTerbalik: { judul: '反转对比度', untuk: '适用于更适应深色背景阅读的用户。', deskripsi: '反转页面配色方案；图片与标志不会被反转。' },
      modeGelap: { judul: '深色模式', untuk: '适用于对明亮屏幕敏感的用户。', deskripsi: '整页采用深色背景、浅色文字。' },
      fontMudahDibaca: { judul: '易读字体', untuk: '适用于阅读障碍或难以辨认紧密字体的用户。', deskripsi: '切换为专为易读性设计的字体。' },
      tebalkanTeks: { judul: '加粗文字', untuk: '适用于难以阅读细体文字的用户。', deskripsi: '加粗正文文字，使其更易阅读。' },
      jarakTeks: { judul: '文字间距', untuk: '适用于难以阅读紧密字母与单词的用户。', deskripsi: '逐级增加字母与单词之间的间距。' },
      penyorotanTautan: { judul: '链接高亮', untuk: '适用于难以区分链接与普通文字的用户。', deskripsi: '为所有链接添加下划线与醒目颜色。' },
      filterWarna: {
        judul: '色彩滤镜',
        untuk: '适用于特定色觉感知差异的用户。',
        deskripsi: '此滤镜可辅助特定的色彩感知——效果因人而异，不能诊断或矫正色盲。',
        intensitas: '滤镜强度',
        reset: '重置滤镜',
        opsi: { none: '无滤镜', protanopia: '红—绿', deuteranopia: '绿—红', tritanopia: '蓝—黄', grayscale: '灰度' },
        opsiDeskripsi: {
          none: '正常色彩显示，不做调整。',
          protanopia: '适用于对红色感知较弱的色觉。',
          deuteranopia: '适用于对绿色感知较弱的色觉。',
          tritanopia: '适用于对蓝—黄感知较弱的色觉。',
          grayscale: '完全去除色彩，仅保留明暗对比。',
        },
      },
      profilKejang: {
        judul: '防癫痫发作模式',
        untuk: '适用于对动态效果与屏幕闪烁敏感的用户。',
        deskripsi: '一键同时开启：停止动画、减少动态效果、禁用视频自动播放。但不能保证对所有癫痫患者完全安全——真正危险的闪烁内容仍须从源头修正。',
        diterapkan: '当前已应用',
      },
      hentikanAnimasi: { judul: '停止动画', untuk: '适用于受动画干扰的用户。', deskripsi: '停止页面中基于 CSS 的装饰性动画与过渡效果。' },
      kurangiGerakan: { judul: '减少动态效果', untuk: '适用于因屏幕动态效果而眩晕或分心的用户。', deskripsi: '减少视差滚动与过度的过渡效果。' },
      nonaktifkanVideo: { judul: '禁用视频自动播放', untuk: '适用于不希望视频自动播放的用户。', deskripsi: '停止页面中装饰性视频的自动播放。' },
      kurangiEfekVisual: { judul: '减少视觉效果', untuk: '适用于受过度视觉效果干扰的用户。', deskripsi: '减少模糊、阴影等过度的装饰性过渡效果。' },
      kursorBesar: {
        judul: '光标大小',
        untuk: '适用于难以找到鼠标指针的用户。',
        deskripsi: '放大光标，使其更易于定位，范围为 100% 至 200%。自定义光标大小的支持取决于您的设备与浏览器。',
      },
      sorotanKursor: { judul: '光标高亮', untuk: '适用于难以找到鼠标指针位置的用户。', deskripsi: '在光标位置周围显示细光环，不会遮挡下方文字。' },
      ukuranSorotanKursor: { judul: '光标高亮大小', untuk: '适用于需要更大或更小光标光环的用户。', deskripsi: '逐级调整光标高亮光环的大小。' },
      navigasiKeyboard: {
        judul: '键盘导航',
        untuk: '适用于不使用鼠标浏览网站的用户。',
        deskripsi: '本网站的所有菜单、链接、按钮与表单均可通过键盘操作（Tab、Enter、Escape）。',
      },
      fokusJelas: { judul: '清晰的焦点', untuk: '适用于难以看清当前激活元素的键盘用户。', deskripsi: '加强键盘焦点轮廓，使其更易于看见。' },
      areaKlik: { judul: '更大的点击区域', untuk: '适用于行动能力受限的用户。', deskripsi: '放大按钮与链接的可点击区域。' },
      sederhanakanInteraksi: {
        judul: '简化交互',
        untuk: '适用于不使用鼠标的用户。',
        deskripsi: '本网站的下拉菜单已支持无需悬停即可打开，仅通过键盘焦点即可操作。',
      },
      modeFokusMembaca: { judul: '阅读专注模式', untuk: '适用于阅读时容易分心的用户。', deskripsi: '淡化页眉与页脚，使内容更突出。' },
      garisBantu: { judul: '阅读参考线', untuk: '适用于阅读时容易看丢行的用户。', deskripsi: '显示一条跟随光标位置的水平参考线。' },
      penyorotanArea: { judul: '阅读区域高亮', untuk: '适用于难以专注于单一文本区域的用户。', deskripsi: '高亮光标周围的区域，帮助跟随阅读。' },
      jarakBaris: { judul: '行高', untuk: '适用于难以阅读紧密文字的用户。', deskripsi: '逐级增加文字行间距。' },
      lebarTeks: { judul: '文字宽度', untuk: '适用于难以跟随长行文字的用户。', deskripsi: '限制阅读区域宽度，使文字行更易于跟随阅读。' },
      pembacaTeks: {
        judul: '朗读功能',
        untuk: '适用于比起阅读更习惯聆听的用户。',
        deskripsi: '收听本页面内容的朗读。',
        mulai: '开始',
        jeda: '暂停',
        lanjutkan: '继续',
        berhenti: '停止',
        tidakDidukung: '此浏览器不支持朗读功能。',
      },
      takarir: { judul: '字幕支持', untuk: '适用于失聪或听力困难的用户。', deskripsi: '本网站目前没有包含对话内容、需要字幕的视频。' },
      transkrip: { judul: '音视频文字稿', untuk: '适用于失聪或听力困难的用户。', deskripsi: '目前没有需要提供文字稿的音视频内容。' },
      indikatorSuara: {
        judul: '声音通知的视觉提示',
        untuk: '适用于失聪或听力困难的用户。',
        deskripsi: '本网站的所有通知（例如保存成功提示）均已以可视文字形式呈现，不仅依赖声音。',
      },
      alternatifAudio: { judul: '音频内容替代方案', untuk: '适用于失聪或听力困难的用户。', deskripsi: '目前没有需要提供文字替代内容的信息性音频内容。' },
      bahasaSederhana: {
        judul: '简明语言',
        untuk: '适用于认知能力有限或以本站语言为第二语言的用户。',
        deskripsi: '网站内容以清晰的语言撰写。专业及法律术语有意保留原样，以免改变其含义。',
      },
      pengurangDistraksi: { judul: '减少干扰', untuk: '适用于容易被装饰性元素分心的用户。', deskripsi: '减少不必要的装饰性元素。' },
      strukturKonten: { judul: '清晰的内容结构', untuk: '适用于屏幕阅读器用户。', deskripsi: '本网站的标题顺序与导航结构经过设计，便于屏幕阅读器理解。' },
      petunjukFormulir: { judul: '表单指引', untuk: '适用于难以填写表单的用户。', deskripsi: '本网站每个表单字段均配有关联标签与清晰说明。' },
      pesanKesalahan: { judul: '易懂的错误提示', untuk: '适用于难以理解错误提示的用户。', deskripsi: '表单会具体说明错误原因，且不会清除您已输入的内容。' },
      bantuanNavigasi: {
        judul: '导航辅助',
        untuk: '适用于键盘与屏幕阅读器用户。',
        deskripsi: '每个页面顶部均提供"跳至主要内容"链接。',
      },
    },
    info: {
      judul: '关于此工具栏',
      isi: '这些设置仅在您自己的设备上更改网站的外观与行为，保存在本地，不会与他人共享。此工具栏提供辅助，但不能替代您设备上已安装的屏幕阅读器等辅助技术。',
    },
    panduan: {
      judul: '使用指南',
      isi: '使用 Tab 键在元素间切换，使用 Enter/空格键选择，使用 Escape 键关闭此面板。您的设置会自动保存，并在下次访问时恢复。使用"重置所有设置"可恢复为初始状态。',
    },
    profil: {
      judul: '无障碍配置档',
      intro: '选择最适合您需求的配置档——每个配置档会同时开启若干相关设置。',
      aktifkanProfil: '应用配置档',
      nonaktifkanProfil: '关闭配置档',
      profilAktif: '已启用配置档',
      daftar: {
        lowVision: { nama: '低视力', deskripsi: '适用于难以看清小字或区分视觉元素的用户。' },
        focusDistraction: { nama: '专注与减少干扰', deskripsi: '适用于需要更简洁、干扰更少的界面的用户。' },
        reading: { nama: '阅读与信息处理', deskripsi: '适用于需要更易读文字与更有条理版式的用户。' },
        motor: { nama: '行动能力导航', deskripsi: '适用于难以精确使用鼠标或点击小目标的用户。' },
        visualSensitivity: { nama: '视觉敏感度', deskripsi: '适用于对特定动态或视觉效果感到不适的用户。' },
        colorPerception: { nama: '色彩感知', deskripsi: '适用于难以区分特定色彩组合的用户。' },
      },
    },
  },
};

export const LOCALE_MESSAGES = { id, en, zh } as const;

export function messagesFor(locale: string): Messages {
  return (LOCALE_MESSAGES as Record<string, Messages>)[locale] ?? id;
}

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
    groupEcosystemEyebrow: 'Environesia Group',
    groupEcosystemHeadline: 'Beragam Keahlian. Satu Ekosistem.',
    groupEcosystemTagline:
      'Ekosistem layanan lingkungan yang menghubungkan keahlian, teknologi, dan sumber daya manusia.',
    groupEcosystemPrimaryCta: 'Kenali Environesia',
    groupEcosystemSecondaryCta: 'Direksi & Manajemen',
    businessProjectsHeading: 'Lini Bisnis dan Proyek Berjalan',
    businessProjectsSubtext: 'Portofolio pekerjaan dari berbagai entitas dalam Environesia Group.',
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
      'Kepercayaan dari berbagai perusahaan, institusi, dan mitra menjadi bagian dari perjalanan Environesia Group dalam menghadirkan solusi lingkungan yang profesional dan berkelanjutan.',
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
    daftarSubheading: 'Jelajahi pengalaman Environesia Company Group berdasarkan sektor, wilayah, dan periode pelaksanaan.',
    belumMenemukanJudul: 'Belum Menemukan Proyek yang Anda Cari?',
    belumMenemukanDeskripsi: 'Daftar ini terus diperbarui berdasarkan data rekam jejak yang tersedia pada Environesia Company Group. Apabila suatu proyek belum tercantum atau terdapat informasi yang perlu diperbarui, silakan menghubungi perusahaan terkait untuk membantu verifikasi dan pembaruan data.',
    kontakLabel: 'Kontak',
    kontakCakupan: {
      'environesia': 'Rekam jejak konsultansi lingkungan',
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
    heroHeading: 'Tentang Environesia Group',
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
    groupEcosystemEyebrow: 'Environesia Group',
    groupEcosystemHeadline: 'Diverse Expertise. One Ecosystem.',
    groupEcosystemTagline:
      'An environmental service ecosystem connecting expertise, technology, and human resources.',
    groupEcosystemPrimaryCta: 'Meet Environesia',
    groupEcosystemSecondaryCta: 'Directors & Management',
    businessProjectsHeading: 'Business Lines & Ongoing Projects',
    businessProjectsSubtext: 'A portfolio of work from the various entities across Environesia Group.',
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
      'Trust from companies, institutions, and partners across sectors has shaped Environesia Group’s journey in delivering professional, sustainable environmental solutions.',
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
    daftarSubheading: 'Explore Environesia Company Group’s experience by sector, region, and delivery period.',
    belumMenemukanJudul: 'Can\'t Find the Project You\'re Looking For?',
    belumMenemukanDeskripsi: 'This directory is updated from the track-record data currently available for Environesia Company Group. If a project is not yet listed or information needs updating, please contact the relevant company to help verify and update the data.',
    kontakLabel: 'Contact',
    kontakCakupan: {
      'environesia': 'Environmental consulting track record',
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
    heroHeading: 'About Environesia Group',
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
    groupEcosystemEyebrow: 'Environesia Group',
    groupEcosystemHeadline: '多元专长,一个生态系统。',
    groupEcosystemTagline: '连接专业知识、技术与人力资源的环境服务生态系统。',
    groupEcosystemPrimaryCta: '认识 Environesia',
    groupEcosystemSecondaryCta: '董事与管理层',
    businessProjectsHeading: '业务领域与进行中的项目',
    businessProjectsSubtext: '来自 Environesia Group 各企业的工作作品集。',
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
    trustedPartnersIntro: '来自各类企业、机构与合作伙伴的信任,是 Environesia Group 在提供专业、可持续环境解决方案道路上的重要部分。',
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
    daftarSubheading: '按行业、地区和执行阶段，探索 Environesia Company Group 的经验。',
    belumMenemukanJudul: '没有找到您要的项目？',
    belumMenemukanDeskripsi: '本目录根据 Environesia Company Group 目前可用的业绩记录持续更新。若某项目尚未列出或信息需要更新，请联系相关公司协助核实和更新数据。',
    kontakLabel: '联系方式',
    kontakCakupan: {
      'environesia': '环境咨询业绩记录',
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
    heroHeading: '关于 Environesia Group',
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
};

export const LOCALE_MESSAGES = { id, en, zh } as const;

export function messagesFor(locale: string): Messages {
  return (LOCALE_MESSAGES as Record<string, Messages>)[locale] ?? id;
}

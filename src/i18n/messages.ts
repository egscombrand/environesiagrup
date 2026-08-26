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
  };
  common: {
    pendingContent: string;
    layanan: string;
    layananPending: string;
    selengkapnya: string;
  };
  beranda: {
    entitasKami: string;
    pilarBisnis: string;
    jejakNegara: string;
    greenBusiness: string;
    pesanPimpinan: string;
    pesanCeoPending: string;
    manifestoPending: string;
    beritaJudul: string;
    beritaKosong: string;
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
    eyebrow: string;
    judul: string;
    intro: string;
    daftar: string;
    kosong: string;
    dikerjakanOleh: string;
    galeri: string;
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
    entitasDalamGrup: string;
    strukturOrganisasi: string;
    strukturPending: string;
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
  },
  common: {
    pendingContent: 'Konten halaman ini sedang disiapkan.',
    layanan: 'Layanan',
    layananPending: 'Rincian layanan akan segera hadir.',
    selengkapnya: 'Selengkapnya',
  },
  beranda: {
    entitasKami: 'Entitas Kami',
    pilarBisnis: 'Pilar Bisnis',
    jejakNegara: 'Jejak di 10 Negara',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Pesan Pimpinan',
    pesanCeoPending: 'Kutipan pesan CEO menyusul.',
    manifestoPending: 'Manifesto Green Business akan segera hadir di sini.',
    beritaJudul: 'Berita & Insight',
    beritaKosong: 'Belum ada berita terbaru.',
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
    eyebrow: 'Portofolio',
    judul: 'Proyek',
    intro: 'Rekam jejak pekerjaan grup bersama klien korporat dan instansi.',
    daftar: 'Daftar Proyek',
    kosong: 'Daftar proyek sedang disiapkan.',
    dikerjakanOleh: 'Dikerjakan Oleh',
    galeri: 'Galeri',
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
    entitasDalamGrup: 'Entitas dalam grup',
    strukturOrganisasi: 'Struktur Organisasi',
    strukturPending: 'Susunan organisasi tingkat personel sedang disiapkan.',
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
  },
  common: {
    pendingContent: 'This page is being prepared.',
    layanan: 'Services',
    layananPending: 'Service details are coming soon.',
    selengkapnya: 'Explore further',
  },
  beranda: {
    entitasKami: 'Our Entities',
    pilarBisnis: 'Business Pillars',
    jejakNegara: 'Presence in 10 Countries',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Leadership Message',
    pesanCeoPending: "The CEO's message is coming soon.",
    manifestoPending: 'The Green Business manifesto will appear here soon.',
    beritaJudul: 'News & Insight',
    beritaKosong: 'No news yet.',
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
    eyebrow: 'Portfolio',
    judul: 'Projects',
    intro: 'A record of the group’s work with corporate and government clients.',
    daftar: 'Project List',
    kosong: 'The project list is being prepared.',
    dikerjakanOleh: 'Delivered By',
    galeri: 'Gallery',
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
    entitasDalamGrup: 'Entities in the group',
    strukturOrganisasi: 'Organisational Structure',
    strukturPending: 'The personnel-level organisational chart is being prepared.',
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
  },
  common: {
    pendingContent: '本页内容正在筹备中。',
    layanan: '服务',
    layananPending: '服务详情即将发布。',
    selengkapnya: '了解更多',
  },
  beranda: {
    entitasKami: '旗下企业',
    pilarBisnis: '业务支柱',
    jejakNegara: '业务遍及十国',
    greenBusiness: '绿色商业',
    pesanPimpinan: '领导致辞',
    pesanCeoPending: '首席执行官致辞即将发布。',
    manifestoPending: '绿色商业宣言即将在此发布。',
    beritaJudul: '新闻与洞察',
    beritaKosong: '暂无最新消息。',
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
    eyebrow: '业绩',
    judul: '项目',
    intro: '集团与企业客户及政府机构合作的项目记录。',
    daftar: '项目列表',
    kosong: '项目列表正在筹备中。',
    dikerjakanOleh: '承接企业',
    galeri: '图库',
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
    entitasDalamGrup: '集团旗下企业',
    strukturOrganisasi: '组织架构',
    strukturPending: '人员层级的组织架构正在筹备中。',
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

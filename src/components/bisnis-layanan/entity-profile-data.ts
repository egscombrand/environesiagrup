export type EntityProfileData = {
  category: string;
  description: string;
  focus: string[];
  whoItHelps: string[];
  roleInGroup: string;
  ctaLabel: string;
  ctaUrl: string;
};

// Visual-first Entity Explorer content — deliberately brief (a category, one
// description sentence, a handful of scannable focus/audience labels, one
// role-in-group line, a CTA to the real external site) rather than a full
// company profile: history, legality, full service lists, and project
// details all belong on each brand's own website, not duplicated here.
// Keyed by the same real slugs the `entities` CMS table already uses.
export const ENTITY_PROFILES: Record<string, EntityProfileData> = {
  'environesia-consultant': {
    category: 'Environmental Consulting & Sustainability',
    description:
      'Environesia merupakan perusahaan inti dalam ekosistem yang berfokus pada konsultansi dan pendampingan lingkungan untuk membantu organisasi memahami, mengelola, dan memenuhi kebutuhan lingkungan dalam pengembangan proyek dan kegiatan usaha.',
    focus: ['Environmental Consulting', 'Environmental Assessment', 'Compliance', 'Monitoring', 'Sustainability'],
    whoItHelps: ['Korporasi', 'Industri', 'Instansi Pemerintah', 'Pengembang & Proyek'],
    roleInGroup:
      'Environesia menjadi bagian yang berfokus pada konsultansi dan pendampingan lingkungan, menghubungkan kebutuhan proyek dengan kajian teknis, regulasi, dan praktik pengelolaan lingkungan.',
    ctaLabel: 'Kunjungi Environesia',
    ctaUrl: 'https://environesia.co.id/',
  },
  greenlab: {
    category: 'Environmental Laboratory & Testing',
    description:
      'GreenLab berfokus pada pengujian dan analisis laboratorium untuk menghasilkan data yang dapat digunakan dalam kebutuhan teknis, regulasi, dan pengambilan keputusan.',
    focus: ['Laboratory', 'Environmental Testing', 'Analysis', 'Sampling', 'Environmental Data'],
    whoItHelps: ['Industri', 'Korporasi', 'Instansi', 'Proyek Pembangunan'],
    roleInGroup:
      'GreenLab berperan sebagai laboratorium pengujian dan analisis dalam ekosistem, menyediakan data teknis lingkungan dan K3 yang mendukung kepatuhan serta pengambilan keputusan proyek-proyek di dalam maupun di luar grup.',
    ctaLabel: 'Kunjungi GreenLab',
    ctaUrl: 'https://greenlab.co.id/',
  },
  greenskill: {
    category: 'Competency & Professional Development',
    description:
      'GreenSkill berfokus pada pengembangan kompetensi melalui pembelajaran, pelatihan, dan pengembangan profesional yang relevan dengan kebutuhan lingkungan dan industri.',
    focus: ['Training', 'Learning', 'Professional Development', 'Environmental Competency'],
    whoItHelps: ['Profesional', 'Perusahaan', 'Instansi', 'Tenaga Kerja Lingkungan'],
    roleInGroup:
      'GreenSkill berperan mengembangkan kompetensi dan kapasitas sumber daya manusia di bidang lingkungan, melalui pelatihan dan program pengembangan profesional yang mendukung kebutuhan tenaga kerja kompeten di dalam ekosistem.',
    ctaLabel: 'Kunjungi GreenSkill',
    ctaUrl: 'https://greenskill.id/',
  },
  'lsp-praktisi-lingkungan': {
    category: 'Professional Certification',
    description:
      'LSP Praktisi Lingkungan Indonesia berfokus pada proses sertifikasi kompetensi profesional di bidang lingkungan melalui skema dan asesmen kompetensi yang relevan.',
    focus: ['Competency Assessment', 'Professional Certification', 'Environmental Competency'],
    whoItHelps: ['Profesional Lingkungan', 'Tenaga Kerja', 'Praktisi', 'Kandidat Sertifikasi'],
    roleInGroup:
      'LSP Praktisi Lingkungan Indonesia berperan memberikan pengakuan resmi atas kompetensi profesional lingkungan melalui proses asesmen dan sertifikasi, melengkapi pelatihan GreenSkill dengan standar kompetensi yang diakui secara nasional.',
    ctaLabel: 'Kunjungi LSP Praktisi Lingkungan',
    ctaUrl: 'https://lsp-praktisilingkungan.id/',
  },
  'bikin-indonesia-berdaya': {
    category: 'Apparel & Professional Uniform',
    description:
      'Bikin Indonesia Berdaya mendukung kebutuhan apparel, seragam, dan pakaian kerja untuk organisasi, perusahaan, dan aktivitas profesional.',
    focus: ['Apparel', 'Uniform', 'Workwear', 'Production'],
    whoItHelps: ['Perusahaan', 'Organisasi', 'Institusi', 'Komunitas/Proyek'],
    roleInGroup:
      'Bikin Indonesia Berdaya berperan sebagai bagian pendukung kebutuhan organisasi dalam ekosistem, menyediakan apparel dan seragam kerja yang melengkapi operasional entitas lain maupun kebutuhan eksternal.',
    ctaLabel: 'Kunjungi Bikin',
    ctaUrl: 'https://bikin.co/',
  },
};

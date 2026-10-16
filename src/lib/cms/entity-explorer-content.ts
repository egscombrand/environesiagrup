import { LEGACY_MEDIA } from './legacy-media';

/**
 * The Entity Explorer card (src/components/bisnis-layanan/ecosystem-exhibition.tsx)
 * as it shows each of the five known entities today. Pure, so the seed
 * (migration 0044) is generated from it.
 *
 * This consolidates two hardcoded sources the component actually reads:
 *   - BRAND_CONTENT (local to the component): category, the long description
 *     ("Tentang Perusahaan"), contribution ("Peran dan Kontribusi"), the short
 *     focus tags, and the service tags
 *   - ENTITY_PROFILES (entity-profile-data.ts): roleInGroup ("Peran dalam
 *     Ekosistem") — its other fields (description, focus, whoItHelps) were
 *     never actually rendered by this component and are not migrated
 *
 * `services` here is a distinct, shorter keyword list for this card — not the
 * `services` column already on entities, which is a different, longer list
 * shown on /bisnis/[pilar] and /bisnis-layanan/{slug}.
 */
export type EntityExplorerProfile = {
  category: string;
  description: string;
  contribution: string;
  focus: string[];
  services: string[];
  roleInGroup: string;
  /** Storage path of the showcase illustration. */
  imagePath: string;
};

export const ENTITY_EXPLORER_FALLBACK: Record<string, EntityExplorerProfile> = {
  'environesia-consultant': {
    category: 'Environmental Consulting & Sustainability',
    description:
      'Environesia berfokus pada konsultansi dan pendampingan lingkungan untuk membantu organisasi memahami, mengelola, dan memenuhi kebutuhan lingkungan dalam pengembangan proyek dan kegiatan usaha.',
    contribution:
      'Membantu organisasi memahami kebutuhan lingkungan, memenuhi kewajiban yang berlaku, dan mengelola aspek lingkungan dalam pengembangan kegiatan usaha.',
    focus: ['Consulting', 'Assessment', 'Compliance', 'Monitoring'],
    services: ['Environmental Consulting', 'Environmental Assessment', 'Compliance', 'Monitoring'],
    roleInGroup:
      'Environesia menjadi bagian yang berfokus pada konsultansi dan pendampingan lingkungan, menghubungkan kebutuhan proyek dengan kajian teknis, regulasi, dan praktik pengelolaan lingkungan.',
    imagePath: LEGACY_MEDIA['/environesiagrup/enviro.png'].path,
  },
  greenlab: {
    category: 'Environmental Laboratory & Testing',
    description:
      'GreenLab berfokus pada pengujian dan analisis laboratorium untuk menghasilkan data yang mendukung kebutuhan teknis, regulasi, dan pengambilan keputusan.',
    contribution:
      'Menyediakan data hasil pengujian dan analisis yang dapat mendukung kebutuhan teknis, regulasi, serta pengambilan keputusan.',
    focus: ['Laboratory', 'Testing', 'Analysis'],
    services: ['Laboratory', 'Testing', 'Analysis', 'Environmental Testing'],
    roleInGroup:
      'GreenLab berperan sebagai laboratorium pengujian dan analisis dalam ekosistem, menyediakan data teknis lingkungan dan K3 yang mendukung kepatuhan serta pengambilan keputusan proyek-proyek di dalam maupun di luar grup.',
    imagePath: LEGACY_MEDIA['/environesiagrup/Greenlab.png'].path,
  },
  greenskill: {
    category: 'Training & Professional Development',
    description:
      'GreenSkill berfokus pada pengembangan kompetensi melalui pembelajaran, pelatihan, dan pengembangan profesional yang relevan dengan kebutuhan lingkungan dan industri.',
    contribution:
      'Membantu individu dan organisasi mengembangkan kompetensi yang relevan dengan kebutuhan lingkungan dan dunia kerja.',
    focus: ['Training', 'Learning', 'Development'],
    services: ['Training', 'Learning', 'Development', 'Professional Development'],
    roleInGroup:
      'GreenSkill berperan mengembangkan kompetensi dan kapasitas sumber daya manusia di bidang lingkungan, melalui pelatihan dan program pengembangan profesional yang mendukung kebutuhan tenaga kerja kompeten di dalam ekosistem.',
    imagePath: LEGACY_MEDIA['/environesiagrup/greenskill.png'].path,
  },
  'lsp-praktisi-lingkungan': {
    category: 'Competency Certification',
    description:
      'LSP Praktisi Lingkungan Indonesia berfokus pada sertifikasi kompetensi profesional di bidang lingkungan melalui proses asesmen dan skema sertifikasi yang relevan.',
    contribution:
      'Mendukung pengakuan kompetensi profesional melalui proses asesmen dan sertifikasi yang relevan di bidang lingkungan.',
    focus: ['Competency', 'Assessment', 'Certification'],
    services: ['Competency', 'Assessment', 'Certification', 'Professional Certification'],
    roleInGroup:
      'LSP Praktisi Lingkungan Indonesia berperan memberikan pengakuan resmi atas kompetensi profesional lingkungan melalui proses asesmen dan sertifikasi, melengkapi pelatihan GreenSkill dengan standar kompetensi yang diakui secara nasional.',
    imagePath: LEGACY_MEDIA['/environesiagrup/lsp.png'].path,
  },
  'bikin-indonesia-berdaya': {
    category: 'Apparel & Professional Uniform',
    description:
      'Bikin Indonesia Berdaya mendukung kebutuhan apparel, seragam, dan pakaian kerja untuk organisasi, perusahaan, dan aktivitas profesional.',
    contribution:
      'Mendukung kebutuhan apparel dan pakaian kerja yang sesuai untuk kebutuhan organisasi, perusahaan, dan aktivitas profesional.',
    focus: ['Apparel', 'Uniform', 'Workwear'],
    services: ['Apparel', 'Uniform', 'Workwear', 'Custom Apparel'],
    roleInGroup:
      'Bikin Indonesia Berdaya berperan sebagai bagian pendukung kebutuhan organisasi dalam ekosistem, menyediakan apparel dan seragam kerja yang melengkapi operasional entitas lain maupun kebutuhan eksternal.',
    imagePath: LEGACY_MEDIA['/environesiagrup/kinco.png'].path,
  },
  bangsap: {
    category: 'Media, Edukasi Lingkungan & Podcast',
    description:
      'Bangsap adalah platform media dan edukasi lingkungan yang mengemas isu lingkungan dengan cara ringan, kritis, dan relevan. Melalui konten, diskusi, dan podcast, Bangsap menghubungkan fakta dan data agar isu lingkungan lebih mudah dipahami serta membuka perspektif baru bagi masyarakat.',
    contribution:
      'Menghubungkan fakta dan data lingkungan dengan masyarakat melalui konten, diskusi, dan podcast yang ringan, kritis, dan relevan.',
    focus: ['Media', 'Edukasi Lingkungan', 'Podcast'],
    services: ['Konten Media', 'Edukasi Lingkungan', 'Podcast & Diskusi'],
    roleInGroup:
      'Bangsap berperan sebagai kanal media dan edukasi dalam ekosistem, mengemas isu lingkungan melalui konten, diskusi, dan podcast agar lebih mudah dipahami masyarakat dan membuka perspektif baru di luar cara pandang teknis.',
    imagePath: LEGACY_MEDIA['/environesiagrup/bangsap.jpeg'].path,
  },
};

/** The website domain (no protocol, no trailing slash) to fill in where an entity has none yet. GreenLab already has a real one and is never overwritten. */
export const ENTITY_WEBSITE_FALLBACK: Record<string, string> = {
  'environesia-consultant': 'environesia.co.id',
  greenskill: 'greenskill.id',
  'lsp-praktisi-lingkungan': 'lsp-praktisilingkungan.id',
  'bikin-indonesia-berdaya': 'bikin.co',
};

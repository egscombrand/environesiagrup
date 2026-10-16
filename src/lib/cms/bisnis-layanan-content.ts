import { LEGACY_MEDIA } from './legacy-media';

/**
 * Bisnis & Ekosistem (/bisnis-layanan) copy as the hub page shows it today.
 * Pure, so the seed migration is generated from it. Two page_content rows:
 *
 *   bisnis-layanan-hero        the page's own hero heading/paragraph, and
 *                              (via its `images` block) the "Environesia
 *                              Group" photo the Kenali Perusahaan exhibition
 *                              shows on its left — one fixed photo for the
 *                              Group itself (from public/environesiagrup/),
 *                              independent of which brand is active on the
 *                              right.
 *   bisnis-layanan-ekosistem   "Ekosistem Hijau…", four paragraphs (rich text)
 *
 * The ecosystem diagram and the per-entity profile cards are not here: the
 * diagram already reads the entities table, and the profile cards are now
 * columns on that same table (see src/lib/admin/resources/entities.ts).
 *
 * A third row, `bisnis-layanan-tumbuh` ("Ekosistem yang Terus Bertumbuh"),
 * backed a section removed for repeating the same ground as the ecosystem
 * map and brand showcase around it — its editor, fallback copy, and image
 * were removed with it. The database row itself is untouched (just no
 * longer read by anything).
 */

export type BisnisLayananContent = {
  hero: { title: string; description: string; metaTitle: string; metaDescription: string };
  ekosistem: { title: string; richText: string };
  groupPhoto: { imageSrc: string | null; imageAlt: string };
};

/**
 * The correct "Environesia" photo lives in `public/environesiagrup/`
 * — specifically `enviro.png`, the real team portrait already used
 * elsewhere as Environesia's own Entity Explorer image (see
 * entity-explorer-content.ts). It was already migrated to Storage (see
 * legacy-media.ts); this constant is that same migrated path, reused here
 * so the exhibition's left photo reads as real stored data from the first
 * render, before any admin touches the new image field below. (An earlier
 * pass pointed this at the page's own hero banner instead — wrong folder,
 * corrected here; neither file was deleted, only this reference moved.)
 */
export const GROUP_PHOTO_PATH = LEGACY_MEDIA['/environesiagrup/enviro.png'].path;

export const BISNIS_LAYANAN_FALLBACK: BisnisLayananContent = {
  hero: {
    title: 'Bisnis & Ekosistem Environesia',
    description:
      'Environesia tumbuh dari satu perusahaan konsultansi lingkungan menjadi sebuah ekosistem dengan beragam entitas dan keahlian. Setiap perusahaan memiliki fokus dan perannya sendiri, namun tetap terhubung dalam satu perjalanan yang sama. Dari lingkungan, pengujian, dan pengembangan kompetensi hingga apparel dan kebutuhan pendukung lainnya, setiap bagian hadir untuk menjawab kebutuhan yang berbeda. Kenali perusahaan dalam Environesia dan temukan keahlian yang sesuai dengan kebutuhan Anda.',
    metaTitle: 'Bisnis Ekonomi',
    metaDescription: 'Halaman Bisnis Ekonomi Environesia.',
  },
  ekosistem: {
    title: 'Ekosistem Hijau Terintegrasi Berstandar Global',
    richText: [
      'Environesia memulai perjalanan di Yogyakarta pada 2016 sebagai perusahaan yang bergerak di bidang konsultansi lingkungan. Dari pekerjaan-pekerjaan awal tersebut, kami belajar bahwa kebutuhan industri tidak pernah berdiri sendiri. Sebuah pekerjaan dapat membutuhkan konsultansi, data pengujian, tenaga profesional yang kompeten, hingga berbagai kebutuhan pendukung di lapangan.',
      'Pemahaman tersebut menjadi dasar bagaimana Environesia berkembang. Kami membangun dan mengembangkan perusahaan serta kapabilitas baru bukan semata-mata untuk memperluas lini usaha, tetapi untuk menjawab kebutuhan yang kami temukan sepanjang perjalanan. Dari konsultansi lingkungan dan pengujian laboratorium, hingga sertifikasi kompetensi, apparel, dan kebutuhan pendukung lainnya, setiap bagian tumbuh dengan peran dan keahliannya masing-masing.',
      'Hari ini, **Environesia menjadi sebuah ekosistem yang menghubungkan berbagai keahlian dan bidang usaha dalam satu grup.** Perjalanan selama satu dekade membawa kami dari satu layanan menjadi organisasi dengan cakupan yang lebih luas, pengalaman lintas sektor, serta jaringan yang terus berkembang.',
      '**Kami percaya pertumbuhan bukan hanya tentang menjadi lebih besar, tetapi tentang menjadi lebih lengkap dalam memberikan nilai.**',
    ].join('\n\n'),
  },
  groupPhoto: { imageSrc: null, imageAlt: 'Tim Environesia' },
};

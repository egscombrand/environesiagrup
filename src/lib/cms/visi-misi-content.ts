/**
 * The Visi, Misi & Komitmen copy as the tab shows it today. Pure, so the seed
 * (migration 0035) is generated from it and the code fallback cannot drift.
 *
 * Two rows hold it:
 *   visi-misi  the page heading, and two chapters, Visi then Misi. A chapter's
 *              item title is its label on the page.
 *   komitmen   the Komitmen heading, its intro, and four commitments.
 *
 * `**…**` marks the accent part of a text (shown in the identity colour).
 */

export const VISI_MISI_CHAPTER_COUNT = 2;
export const KOMITMEN_ITEM_COUNT = 4;

export type VisiMisiChapter = { label: string; text: string };
export type Commitment = { title: string; description: string };

export type VisiMisiContent = {
  title: string;
  chapters: VisiMisiChapter[];
  komitmen: { title: string; intro: string; items: Commitment[] };
  metaTitle: string;
  metaDescription: string;
};

export const VISI_MISI_FALLBACK: VisiMisiContent = {
  title: 'Visi, Misi & Komitmen',
  metaTitle: 'Visi, Misi & Tata Nilai',
  metaDescription: 'Visi, misi, dan tata nilai Environesia.',
  chapters: [
    { label: 'Visi', text: 'Menjadi Perusahaan Ekosistem Lingkungan Terintegrasi Berkelas Dunia **di Indonesia**' },
    {
      label: 'Misi',
      text: 'Misi kami memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi, ketepatan waktu pelayanan, jaringan kerjasama yang luas, hubungan emosional yang baik antara tim dan pelanggan.',
    },
  ],
  komitmen: {
    title: 'Komitmen',
    intro: 'Memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi.',
    items: [
      {
        title: 'Integritas dalam setiap keputusan',
        description: 'Menjaga kejujuran, keterbukaan, dan objektivitas dalam menjalankan pekerjaan.',
      },
      {
        title: 'Peduli terhadap lingkungan',
        description:
          'Menerapkan prinsip pengelolaan lingkungan bukan hanya dalam layanan yang kami berikan, tetapi juga dalam cara kami menjalankan operasional.',
      },
      {
        title: 'Keselamatan sebagai bagian dari pekerjaan',
        description:
          'Memastikan aspek keselamatan dan kesehatan kerja menjadi bagian dari setiap aktivitas, terutama pekerjaan di lapangan.',
      },
      {
        title: 'Bertanggung jawab terhadap hasil',
        description:
          'Setiap pekerjaan kami tempatkan sebagai tanggung jawab yang harus dapat dipertanggungjawabkan kepada klien dan pemangku kepentingan.',
      },
    ],
  },
};

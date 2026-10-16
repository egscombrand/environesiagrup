/**
 * The Sejarah copy as the Perjalanan Kami section shows it today. Pure, so the
 * seed for the database (migration 0034) is generated from it, and the code
 * fallback can never drift from it.
 *
 * Paragraphs inside one text block are separated by a blank line. `**…**`
 * marks bold text. The three blocks have a fixed layout in the component, so the
 * block count is fixed at three.
 */

export const SEJARAH_BLOCK_COUNT = 3;

export type SejarahBlock = {
  /** The paragraphs of the block, separated by a blank line. */
  text: string;
};

export type SejarahContent = {
  eyebrow: string;
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  /** The heading above the narrative, "Sekilas Environesia". */
  sekilasLabel: string;
  blocks: SejarahBlock[];
  timeline: { eyebrow: string; title: string; intro: string };
};

export const SEJARAH_FALLBACK: SejarahContent = {
  eyebrow: 'Perjalanan Kami',
  title: 'Satu Dekade Environesia',
  lead: 'Sepuluh tahun perjalanan, pengalaman, dan pertumbuhan Environesia.',
  sekilasLabel: 'Sekilas Environesia',
  metaTitle: 'Perjalanan Kami',
  metaDescription: 'Perjalanan Environesia dari tahun ke tahun.',
  blocks: [
    {
      text: [
        'Environesia memulai perjalanannya pada 2016 sebagai penyedia jasa konsultansi lingkungan. Pada saat itu, ruang lingkup kami masih sederhana, berfokus pada penyusunan dokumen AMDAL dan UKL-UPL untuk kebutuhan klien, dengan proyek-proyek awal yang datang dari sektor perkebunan dan ketenagalistrikan. Dari pekerjaan tersebut, kami mulai mengenal lebih dekat berbagai persoalan yang dihadapi industri dalam mengelola lingkungan, sekaligus memahami bahwa sebuah rekomendasi yang baik selalu membutuhkan lebih dari sekadar kemampuan menyusun dokumen. Di balik setiap pekerjaan terdapat data, pengujian, proses lapangan, tenaga profesional, dan berbagai kebutuhan lain yang saling bergantung.',
        'Semakin banyak pekerjaan yang kami tangani, semakin terlihat pula mata rantai yang belum sepenuhnya kami miliki. Salah satunya adalah kebutuhan akan data pengujian. Pada masa itu, pekerjaan konsultansi masih banyak bergantung pada laboratorium pihak ketiga, sementara proses pengujian menjadi salah satu bagian yang paling rentan terhadap antrean dan keterlambatan. Kebutuhan untuk memiliki kendali yang lebih baik atas proses tersebut kemudian mendorong berdirinya PT Greenlab Indo Global pada Maret 2018, yang mulai beroperasi penuh pada Oktober 2019. Kehadiran Greenlab membawa kapabilitas pengujian ke dalam grup dan membuat hubungan antara konsultansi, pengukuran, dan data dapat dikelola dalam ekosistem yang semakin terintegrasi.',
      ].join('\n\n'),
    },
    {
      text: [
        'Namun kebutuhan di lapangan ternyata tidak berhenti pada data. Pada periode yang sama, kami melihat kebutuhan lain yang muncul dari aktivitas proyek sehari-hari: seragam dan perlengkapan kerja bagi orang-orang yang menjalankan pekerjaan di lapangan. Dari kebutuhan tersebut, PT Bikin Indonesia Berdaya berdiri pada 2019 untuk mengembangkan kapabilitas di bidang apparel dan kebutuhan seragam. Bagi kami, langkah ini bukan sekadar menambah lini usaha. Ia menjadi bagian dari cara kami bertumbuh mengenali kebutuhan yang muncul di sekitar pekerjaan, kemudian membangun kemampuan untuk menjawabnya.',
        'Memasuki 2020 hingga 2024, perjalanan tersebut membawa Environesia ke cakupan yang jauh lebih luas. Sebaran proyek berkembang hingga 38 provinsi, dengan pengalaman yang semakin beragam di berbagai sektor. Kepercayaan pun datang dari BUMN besar, kementerian, perusahaan penanaman modal asing, hingga lembaga pembiayaan multilateral seperti World Bank, ADB, dan JICA. Setiap proyek membawa karakter, standar, dan tantangan yang berbeda, memperluas pengalaman sekaligus memperkuat kemampuan kami untuk bekerja dalam konteks yang semakin kompleks. Pada 2023, perjalanan itu bahkan membawa pekerjaan pemantauan lingkungan hingga Timor Leste, sebuah langkah yang memperluas pengalaman Environesia melampaui batas geografis Indonesia.',
      ].join('\n\n'),
    },
    {
      text: [
        'Pertumbuhan tersebut kemudian membawa kami pada pemahaman berikutnya: data yang sah dan sistem yang baik tetap bergantung pada manusia yang memiliki kompetensi untuk menjalankannya. Karena itu, pembangunan ekosistem tidak cukup berhenti pada konsultansi dan pengujian. Pada 19 Desember 2025, PT LSP Praktisi Lingkungan Indonesia memperoleh lisensi BNSP sebagai Lembaga Sertifikasi Profesi Pihak Ketiga. Kehadiran LSP menjadi bagian penting dalam melengkapi mata rantai kompetensi, dari kebutuhan perizinan dan konsultansi, pengumpulan serta pengujian data, hingga pengakuan atas kompetensi para profesional yang menjalankannya.',
        'Sepuluh tahun perjalanan Environesia pada akhirnya bukanlah cerita tentang menambah sebanyak mungkin lini usaha. Ini adalah cerita tentang bagaimana satu kebutuhan membawa kami menemukan kebutuhan berikutnya, dan bagaimana setiap kebutuhan mendorong kami membangun kemampuan baru. Dari satu layanan konsultansi, kemudian berkembang menjadi pengujian, apparel dan perlengkapan kerja, jangkauan proyek yang semakin luas, hingga penguatan kompetensi manusia. **Satu per satu, mata rantai tersebut kami bangun dan hubungkan hingga membentuk ekosistem Environesia seperti yang kami jalankan hari ini. Dan seperti perjalanan sebelumnya, ekosistem ini masih akan terus bertumbuh.**',
      ].join('\n\n'),
    },
  ],
  timeline: {
    eyebrow: 'Perjalanan',
    title: 'Rekam Jejak & Tonggak Environesia',
    intro:
      'Jelajahi perjalanan Environesia dari tahun ke tahun dan lihat bagaimana setiap tahap membentuk ekosistem yang kami jalankan hari ini.',
  },
};

// Paragraph splitting and `**bold**` are a shared convention, used by every
// page that needs more than one paragraph in a plain-text column. Re-exported
// here so existing imports from this file keep working.
export { paragraphsOf, segmentsOf } from './rich-text';

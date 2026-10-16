-- Sejarah (Perjalanan Kami): the rows the Tentang Kami Sejarah section reads
-- (see src/lib/cms/sejarah.ts). The milestones themselves are already in the
-- milestones table and are not touched here.
--
-- Run after 0033_seed_makna_logo.sql. This file does not add photos: the two
-- photo slots (blok-1, blok-2) stay empty until uploaded in wp-admin, and until
-- then the site shows the same placeholders it shows today.
--
-- Rows:
--   sejarah               eyebrow, title, lead, the "Sekilas Environesia" heading,
--                         and the three text blocks as items
--   perjalanan-timeline   the heading and intro above the milestone timeline
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.page_content (
  slug, section_group, eyebrow, title, description, extra_label, items, status, sort_order
) values (
  'sejarah', 'tentang-kami', $q$Perjalanan Kami$q$, $q$Satu Dekade Environesia$q$, $q$Sepuluh tahun perjalanan, pengalaman, dan pertumbuhan Environesia Group.$q$, $q$Sekilas Environesia$q$,
  $q$[{"title":"","description":"Environesia memulai perjalanannya pada 2016 sebagai penyedia jasa konsultansi lingkungan. Pada saat itu, ruang lingkup kami masih sederhana, berfokus pada penyusunan dokumen AMDAL dan UKL-UPL untuk kebutuhan klien, dengan proyek-proyek awal yang datang dari sektor perkebunan dan ketenagalistrikan. Dari pekerjaan tersebut, kami mulai mengenal lebih dekat berbagai persoalan yang dihadapi industri dalam mengelola lingkungan, sekaligus memahami bahwa sebuah rekomendasi yang baik selalu membutuhkan lebih dari sekadar kemampuan menyusun dokumen. Di balik setiap pekerjaan terdapat data, pengujian, proses lapangan, tenaga profesional, dan berbagai kebutuhan lain yang saling bergantung.\n\nSemakin banyak pekerjaan yang kami tangani, semakin terlihat pula mata rantai yang belum sepenuhnya kami miliki. Salah satunya adalah kebutuhan akan data pengujian. Pada masa itu, pekerjaan konsultansi masih banyak bergantung pada laboratorium pihak ketiga, sementara proses pengujian menjadi salah satu bagian yang paling rentan terhadap antrean dan keterlambatan. Kebutuhan untuk memiliki kendali yang lebih baik atas proses tersebut kemudian mendorong berdirinya PT Greenlab Indo Global pada Maret 2018, yang mulai beroperasi penuh pada Oktober 2019. Kehadiran Greenlab membawa kapabilitas pengujian ke dalam grup dan membuat hubungan antara konsultansi, pengukuran, dan data dapat dikelola dalam ekosistem yang semakin terintegrasi."},{"title":"","description":"Namun kebutuhan di lapangan ternyata tidak berhenti pada data. Pada periode yang sama, kami melihat kebutuhan lain yang muncul dari aktivitas proyek sehari-hari: seragam dan perlengkapan kerja bagi orang-orang yang menjalankan pekerjaan di lapangan. Dari kebutuhan tersebut, PT Bikin Indonesia Berdaya berdiri pada 2019 untuk mengembangkan kapabilitas di bidang apparel dan kebutuhan seragam. Bagi kami, langkah ini bukan sekadar menambah lini usaha. Ia menjadi bagian dari cara kami bertumbuh mengenali kebutuhan yang muncul di sekitar pekerjaan, kemudian membangun kemampuan untuk menjawabnya.\n\nMemasuki 2020 hingga 2024, perjalanan tersebut membawa Environesia ke cakupan yang jauh lebih luas. Sebaran proyek berkembang hingga 38 provinsi, dengan pengalaman yang semakin beragam di berbagai sektor. Kepercayaan pun datang dari BUMN besar, kementerian, perusahaan penanaman modal asing, hingga lembaga pembiayaan multilateral seperti World Bank, ADB, dan JICA. Setiap proyek membawa karakter, standar, dan tantangan yang berbeda, memperluas pengalaman sekaligus memperkuat kemampuan kami untuk bekerja dalam konteks yang semakin kompleks. Pada 2023, perjalanan itu bahkan membawa pekerjaan pemantauan lingkungan hingga Timor Leste, sebuah langkah yang memperluas pengalaman Environesia melampaui batas geografis Indonesia."},{"title":"","description":"Pertumbuhan tersebut kemudian membawa kami pada pemahaman berikutnya: data yang sah dan sistem yang baik tetap bergantung pada manusia yang memiliki kompetensi untuk menjalankannya. Karena itu, pembangunan ekosistem tidak cukup berhenti pada konsultansi dan pengujian. Pada 19 Desember 2025, PT LSP Praktisi Lingkungan Indonesia memperoleh lisensi BNSP sebagai Lembaga Sertifikasi Profesi Pihak Ketiga. Kehadiran LSP menjadi bagian penting dalam melengkapi mata rantai kompetensi, dari kebutuhan perizinan dan konsultansi, pengumpulan serta pengujian data, hingga pengakuan atas kompetensi para profesional yang menjalankannya.\n\nSepuluh tahun perjalanan Environesia pada akhirnya bukanlah cerita tentang menambah sebanyak mungkin lini usaha. Ini adalah cerita tentang bagaimana satu kebutuhan membawa kami menemukan kebutuhan berikutnya, dan bagaimana setiap kebutuhan mendorong kami membangun kemampuan baru. Dari satu layanan konsultansi, kemudian berkembang menjadi pengujian, apparel dan perlengkapan kerja, jangkauan proyek yang semakin luas, hingga penguatan kompetensi manusia. **Satu per satu, mata rantai tersebut kami bangun dan hubungkan hingga membentuk ekosistem Environesia Group seperti yang kami jalankan hari ini. Dan seperti perjalanan sebelumnya, ekosistem ini masih akan terus bertumbuh.**"}]$q$::jsonb, 'published', 10
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, status, sort_order
) values (
  'perjalanan-timeline', 'tentang-kami', $q$Perjalanan$q$, $q$Rekam Jejak & Tonggak Environesia Group$q$, $q$Jelajahi perjalanan Environesia dari tahun ke tahun dan lihat bagaimana setiap tahap membentuk ekosistem yang kami jalankan hari ini.$q$,
  '[]'::jsonb, 'published', 11
) on conflict (slug) do nothing;

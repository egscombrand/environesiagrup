-- Tata Kelola & Keberlanjutan, step 2: the current copy goes into page_content.
--
-- Run in this order:
--   1. 0029_page_content_governance_fields.sql
--   2. this file
--   3. 0031_page_content_hero_photo_paths.sql
--
-- The hero row stores the Storage paths of its two photos (see 0031).
--
-- Each row carries exactly the text the site shows today, so the page looks the
-- same after the rows exist. Every row is published.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept. No English or Chinese text is written here.
-- The translations are added in wp-admin, and until then the site shows the
-- Indonesian text.
--
-- Rows:
--   tata-kelola-keberlanjutan  hero, shared by every route (and the parent SEO)
--   tata-kelola-kerangka       the seven pillars, shared by every route
--   tata-kelola ... dampak     the seven areas, one row each



insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$tata-kelola-keberlanjutan$q$, $q$tata-kelola-keberlanjutan$q$, $q$TATA KELOLA & KEBERLANJUTAN$q$, $q$Tata Kelola dan Keberlanjutan$q$, $q$Sebagai bagian dari Environesia Company Group, kami percaya bahwa pertumbuhan bisnis harus berjalan bersama dengan cara kerja yang bertanggung jawab. Kualitas layanan, integritas, keselamatan, kepedulian terhadap lingkungan, serta tanggung jawab kepada para pemangku kepentingan menjadi bagian dari standar yang kami pegang dalam menjalankan kegiatan usaha.$q$, $q$[]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  null, null, $q$Tata Kelola & Keberlanjutan$q$, $q$Menjaga kepercayaan dan memastikan Environesia tumbuh melalui tata kelola perusahaan yang kuat, bertanggung jawab, dan berorientasi pada keberlanjutan.$q$, $q$legacy/banners2.jpg$q$, $q$legacy/banermobile.jpg$q$, 'published', 0
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$tata-kelola-kerangka$q$, $q$tata-kelola-keberlanjutan$q$, $q$KERANGKA TATA KELOLA$q$, $q$Tujuh Pilar untuk Menjalankan Perusahaan Secara Bertanggung Jawab$q$, $q$Kerangka ini menjadi bagian dari cara Environesia menjalankan perusahaan secara profesional, menjaga integritas, mengelola risiko, membangun budaya kerja, serta menciptakan nilai yang bertanggung jawab dan berkelanjutan.$q$, $q$[{"title":"Tata Kelola","description":"Kerangka peran, tanggung jawab, dan pengambilan keputusan untuk menjalankan perusahaan secara profesional."},{"title":"Kode Etik","description":"Prinsip integritas dan perilaku profesional yang menjadi pedoman dalam setiap hubungan dan pekerjaan."},{"title":"Kebijakan & Kepatuhan","description":"Pedoman dan pengendalian untuk memastikan kegiatan perusahaan berjalan sesuai standar dan ketentuan yang berlaku."},{"title":"Manajemen Risiko","description":"Pendekatan untuk mengenali, menilai, mengendalikan, dan memantau risiko dalam kegiatan perusahaan."},{"title":"Nilai & Budaya","description":"Nilai yang membentuk cara kami bekerja, berkolaborasi, melayani, dan terus mengembangkan kemampuan."},{"title":"Keberlanjutan","description":"Komitmen untuk mempertimbangkan aspek lingkungan, manusia, tata kelola, dan nilai jangka panjang."},{"title":"Inisiatif & Dampak","description":"Upaya untuk menerjemahkan kompetensi dan layanan menjadi manfaat serta dampak yang bertanggung jawab."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  null, null, null, null, null, null, 'published', 10
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$tata-kelola$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Tata Kelola Perusahaan$q$, null, $q$[{"label":"Transparency","title":"Keterbukaan yang dapat ditelusuri","description":"Mendorong informasi dan proses yang jelas dalam pelaksanaan pekerjaan, termasuk konsultansi, pengujian, dan kegiatan laboratorium."},{"label":"Accountability","title":"Setiap pekerjaan memiliki tanggung jawab","description":"Peran, kewenangan, dan hasil pekerjaan dapat dipertanggungjawabkan sesuai fungsi dan tanggung jawabnya."},{"label":"Responsibility","title":"Bertanggung jawab terhadap dampak","description":"Setiap keputusan dan pekerjaan mempertimbangkan tanggung jawab profesional, lingkungan, serta kepentingan pemangku kepentingan."},{"label":"Independence","title":"Menjaga objektivitas profesional","description":"Menjaga independensi dan objektivitas dalam memberikan penilaian, rekomendasi, pengujian, maupun hasil pekerjaan."},{"label":"Fairness","title":"Hubungan yang adil dan profesional","description":"Membangun hubungan yang profesional, proporsional, dan saling menghormati dengan klien, mitra, karyawan, dan pemangku kepentingan."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  $q$PRINSIP TATA KELOLA DALAM PRAKTIK$q$, null, $q$Tata Kelola Perusahaan$q$, $q$Tata kelola perusahaan Environesia sebagai dasar dalam menjalankan bisnis secara profesional, bertanggung jawab, dan berkelanjutan.$q$, null, null, 'published', 20
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$kode-etik$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Kode Etik$q$, $q$Kode etik menjadi pedoman perilaku dalam menjalankan pekerjaan, mengambil keputusan, serta membangun hubungan yang profesional dengan klien, mitra, rekan kerja, dan pemangku kepentingan.$q$, $q$[{"title":"Integritas Profesional","description":"Menjaga kejujuran, objektivitas, dan profesionalisme."},{"title":"Independensi & Objektivitas","description":"Menjaga penilaian profesional dari kepentingan yang dapat memengaruhi objektivitas."},{"title":"Kerahasiaan Informasi","description":"Menjaga informasi klien, data pekerjaan, hasil pengujian, dan informasi perusahaan sesuai kewenangan."},{"title":"Konflik Kepentingan","description":"Mengenali dan menangani potensi konflik kepentingan secara bertanggung jawab."},{"title":"Kepatuhan","description":"Menjalankan pekerjaan sesuai ketentuan, standar profesional, dan kebijakan yang berlaku."},{"title":"Hubungan Profesional","description":"Menjaga hubungan yang saling menghormati dengan klien, mitra, karyawan, dan pemangku kepentingan."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  $q$KOMITMEN ETIKA$q$, $q$Integritas perlu dijaga sejak perencanaan pekerjaan hingga penyampaian hasil. Setiap tahap menuntut kejujuran dan tanggung jawab profesional yang sama.$q$, $q$Kode Etik$q$, $q$Kode etik Environesia sebagai pedoman perilaku dalam menjalankan pekerjaan, mengambil keputusan, dan berhubungan dengan klien serta mitra.$q$, null, null, 'published', 30
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$kebijakan$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Kebijakan & Kepatuhan$q$, $q$Kebijakan internal, regulasi, standar profesional, persyaratan klien, dan prosedur operasional saling melengkapi dalam mengatur cara kerja Environesia.$q$, $q$[{"title":"Kepatuhan Regulasi","description":"Menjalankan kegiatan sesuai ketentuan yang relevan dengan ruang lingkup usaha."},{"title":"Standar Profesional","description":"Menggunakan standar dan metodologi yang relevan."},{"title":"Pengendalian Internal","description":"Mendorong proses kerja yang terdokumentasi dan dapat dievaluasi."},{"title":"Dokumentasi & Rekam Kerja","description":"Menjaga dokumentasi yang diperlukan untuk konsistensi dan akuntabilitas."},{"title":"Evaluasi Kepatuhan","description":"Melakukan evaluasi dan penyempurnaan proses apabila diperlukan."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  null, $q$Penerapan kebijakan dan kepatuhan disesuaikan dengan ruang lingkup kegiatan, ketentuan yang berlaku, serta kebutuhan operasional perusahaan.$q$, $q$Kebijakan & Kepatuhan$q$, $q$Hubungan antara kebijakan internal, peraturan perundang-undangan, standar profesi, dan prosedur operasional dalam kerja Environesia.$q$, null, null, 'published', 40
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$manajemen-risiko$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Manajemen Risiko$q$, $q$Manajemen risiko membantu perusahaan mengantisipasi ketidakpastian, menjaga kualitas pekerjaan, dan mendukung pengambilan keputusan.$q$, $q$[]$q$::jsonb, $q$[{"label":"Identifikasi","description":"Mengenali risiko yang dapat memengaruhi pekerjaan dan operasional."},{"label":"Penilaian","description":"Memahami tingkat kemungkinan dan dampak risiko."},{"label":"Pengendalian","description":"Menetapkan tindakan yang proporsional untuk mengurangi risiko."},{"label":"Monitoring","description":"Memantau efektivitas pengendalian dan perubahan kondisi."},{"label":"Perbaikan","description":"Menggunakan hasil evaluasi untuk meningkatkan proses."}]$q$::jsonb, $q$["Operasional","Kualitas","Keselamatan & Kesehatan Kerja","Kepatuhan","Reputasi","Keberlanjutan"]$q$::jsonb,
  $q$KATEGORI RISIKO$q$, null, $q$Manajemen Risiko$q$, $q$Bagaimana Environesia mengidentifikasi, menilai, mengendalikan, memantau, dan memperbaiki risiko untuk menjaga keandalan pekerjaan.$q$, null, null, 'published', 50
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$nilai-budaya$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Nilai & Budaya Perusahaan$q$, $q$Lima nilai inti berikut menjadi acuan dalam setiap pekerjaan, keputusan, dan hubungan Environesia dengan klien serta rekan kerja.$q$, $q$[{"title":"ACCURACY","description":"Ketelitian dalam setiap pekerjaan dan informasi yang kami hasilkan."},{"title":"ON TIME","description":"Menghargai waktu melalui komitmen terhadap target dan penyelesaian pekerjaan."},{"title":"INTEGRITY","description":"Menjaga kejujuran, konsistensi, dan tanggung jawab profesional."},{"title":"CARING","description":"Peduli terhadap klien, rekan kerja, lingkungan, dan dampak dari setiap pekerjaan."},{"title":"CONTINUOUS DEVELOPMENT","description":"Terus belajar, mengevaluasi, dan meningkatkan kompetensi serta cara kerja."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  null, null, $q$Nilai & Budaya Perusahaan$q$, $q$Lima nilai inti Environesia, yaitu Accuracy, On Time, Integrity, Caring, dan Continuous Development, sebagai cara kerja sehari-hari.$q$, null, null, 'published', 60
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$keberlanjutan$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Keberlanjutan$q$, $q$Keberlanjutan menjadi bagian dari cara Environesia menjalankan bisnis dan memberikan layanan kepada klien serta pemangku kepentingan.$q$, $q$[{"title":"Lingkungan","description":"Mendukung pengelolaan lingkungan melalui kompetensi dan layanan yang relevan."},{"title":"Manusia","description":"Memperhatikan keselamatan, kompetensi, pengembangan, dan kesejahteraan sumber daya manusia."},{"title":"Tata Kelola","description":"Menjalankan perusahaan secara bertanggung jawab dan profesional."},{"title":"Nilai Jangka Panjang","description":"Membangun layanan dan hubungan yang memberikan manfaat berkelanjutan."}]$q$::jsonb, $q$[]$q$::jsonb, $q$[]$q$::jsonb,
  null, null, $q$Keberlanjutan$q$, $q$Bagaimana perspektif keberlanjutan menjadi bagian dari cara Environesia menjalankan bisnis dan memberikan layanan kepada klien.$q$, null, null, 'published', 70
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, steps, tags,
  extra_label, extra_text, meta_title, meta_description, image_path, image_mobile_path, status, sort_order
) values (
  $q$dampak$q$, $q$tata-kelola-keberlanjutan$q$, null, $q$Inisiatif & Dampak$q$, $q$Pekerjaan Environesia dirancang untuk menghasilkan dampak yang bertanggung jawab bagi klien, lingkungan, dan pemangku kepentingan.$q$, $q$[{"title":"Dampak terhadap Lingkungan","description":"Bagaimana layanan membantu klien memahami dan mengelola aspek lingkungan."},{"title":"Dampak terhadap Bisnis","description":"Mendukung pengambilan keputusan dan pengelolaan risiko lingkungan."},{"title":"Dampak terhadap Masyarakat","description":"Mendukung praktik yang lebih bertanggung jawab terhadap masyarakat dan pemangku kepentingan."},{"title":"Pengembangan Kompetensi","description":"Mendorong peningkatan kapasitas profesional dan pengetahuan teknis."}]$q$::jsonb, $q$[{"label":"Kompetensi"},{"label":"Layanan"},{"label":"Solusi"},{"label":"Dampak"}]$q$::jsonb, $q$[]$q$::jsonb,
  null, null, $q$Inisiatif & Dampak$q$, $q$Hubungan antara kompetensi, layanan, dan solusi Environesia dengan dampak yang dihasilkan bagi lingkungan, bisnis, dan masyarakat.$q$, null, null, 'published', 80
) on conflict (slug) do nothing;

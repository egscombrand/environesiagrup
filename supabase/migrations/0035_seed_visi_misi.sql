-- Visi, Misi & Komitmen: the rows the Tentang Kami Visi & Misi tab reads
-- (see src/lib/cms/visi-misi.ts).
--
-- Run after 0034_seed_sejarah.sql.
--
-- Rows:
--   visi-misi   the page heading, and two chapters, Visi then Misi (the item title
--               is the chapter label)
--   komitmen    the Komitmen heading, its intro, and four commitments
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.page_content (
  slug, section_group, title, items, status, sort_order
) values (
  'visi-misi', 'tentang-kami', $q$Visi, Misi & Komitmen$q$, $q$[{"title":"Visi","description":"Menjadi Perusahaan Ekosistem Lingkungan Terintegrasi Berkelas Dunia **di Indonesia**"},{"title":"Misi","description":"Misi kami memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi, ketepatan waktu pelayanan, jaringan kerjasama yang luas, hubungan emosional yang baik antara tim dan pelanggan."}]$q$::jsonb, 'published', 20
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, title, description, items, status, sort_order
) values (
  'komitmen', 'tentang-kami', $q$Komitmen$q$, $q$Memberikan pelayanan terbaik yang mengedepankan kepuasan pelanggan melalui profesionalisme kerja yang tinggi.$q$, $q$[{"title":"Integritas dalam setiap keputusan","description":"Menjaga kejujuran, keterbukaan, dan objektivitas dalam menjalankan pekerjaan."},{"title":"Peduli terhadap lingkungan","description":"Menerapkan prinsip pengelolaan lingkungan bukan hanya dalam layanan yang kami berikan, tetapi juga dalam cara kami menjalankan operasional."},{"title":"Keselamatan sebagai bagian dari pekerjaan","description":"Memastikan aspek keselamatan dan kesehatan kerja menjadi bagian dari setiap aktivitas, terutama pekerjaan di lapangan."},{"title":"Bertanggung jawab terhadap hasil","description":"Setiap pekerjaan kami tempatkan sebagai tanggung jawab yang harus dapat dipertanggungjawabkan kepada klien dan pemangku kepentingan."}]$q$::jsonb, 'published', 21
) on conflict (slug) do nothing;

-- Legalitas & Sertifikasi: the tab's own heading, lead paragraph, closing
-- note, and SEO (see src/lib/cms/legalitas-page.ts). Entities, cards, and
-- documents are not touched here — they already come from 0027.
--
-- Run after 0041_legal_card_logos_to_storage.sql.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.page_content (
  slug, section_group, title, description, extra_label, extra_text, meta_title, meta_description, status, sort_order
) values (
  'legalitas', 'tentang-kami', $q$Legalitas & Sertifikasi$q$, $q$Legalitas, perizinan, sertifikasi, dan akreditasi yang mendukung operasional setiap entitas dalam Environesia Company Group.$q$, $q$Legal Entity First$q$, $q$Dokumen pada halaman ini ditampilkan berdasarkan entitas pemiliknya. Legalitas, perizinan, sertifikasi, dan akreditasi dapat berbeda sesuai badan hukum, bidang kegiatan, dan ruang lingkup operasional masing-masing entitas.$q$,
  $q$Legalitas & Sertifikasi$q$, $q$Legalitas, perizinan, sertifikasi, dan akreditasi setiap entitas Environesia Company Group.$q$, 'published', 60
) on conflict (slug) do nothing;

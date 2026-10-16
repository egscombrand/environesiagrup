-- Struktur Organisasi: the row the Tentang Kami Struktur Organisasi tab reads
-- (see src/lib/cms/struktur-organisasi.ts).
--
-- Run after 0035_seed_visi_misi.sql.
--
-- The row holds the heading and the chart. The chart is stored at its Storage
-- path (copied from /public by scripts/import-public-media.ts), with its alt text.
-- The entity list is not part of this page, so it is not written here.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.page_content (
  slug, section_group, title, images, status, sort_order
) values (
  'struktur-organisasi', 'tentang-kami', $q$Environesia Group$q$,
  $q$[{"key":"bagan","path":"legacy/struktur-egs-2026.jpg.jpeg","alt":"Struktur Organisasi dan Tata Kerja PT Environesia Global Saraya"}]$q$::jsonb,
  'published', 30
) on conflict (slug) do nothing;

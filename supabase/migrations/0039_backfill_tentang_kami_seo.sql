-- Backfill: the Sejarah, Visi & Misi, Struktur Organisasi, and Direktur rows
-- were seeded (0034, 0035, 0036, 0038) before their readers read meta_title and
-- meta_description. Their tab pages used the hardcoded TENTANG_KAMI_ROUTES
-- metadata instead. This fills in the same text those pages show today, so SEO
-- becomes editable in wp-admin without changing what a visitor or a search
-- engine currently sees.
--
-- Only an empty meta_title/meta_description is touched (coalesce keeps any
-- value already set, from wp-admin or a future re-run), so this never
-- overwrites an edit. Safe to run more than once.

update public.page_content set
  meta_title = coalesce(meta_title, 'Perjalanan Kami'),
  meta_description = coalesce(meta_description, 'Perjalanan Environesia Group dari tahun ke tahun.')
where slug = 'sejarah';

update public.page_content set
  meta_title = coalesce(meta_title, 'Visi, Misi & Tata Nilai'),
  meta_description = coalesce(meta_description, 'Visi, misi, dan tata nilai Environesia Group.')
where slug = 'visi-misi';

update public.page_content set
  meta_title = coalesce(meta_title, 'Struktur Organisasi'),
  meta_description = coalesce(meta_description, 'Susunan Environesia Group dan entitas di bawahnya.')
where slug = 'struktur-organisasi';

update public.page_content set
  meta_title = coalesce(meta_title, 'Direktur Utama & Dewan Direksi'),
  meta_description = coalesce(meta_description, 'Direktur Utama dan Dewan Direksi Environesia Group.')
where slug = 'direktur';

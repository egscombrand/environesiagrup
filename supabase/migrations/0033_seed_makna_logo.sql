-- Makna Logo: the row the Tentang Kami hub reads (see src/lib/cms/makna-logo.ts).
--
-- Run after 0032_page_content_images.sql.
--
-- The row carries exactly the copy and the two logo photos the site shows today:
-- four parts in order (Simbol, Tipografi, Warna, Kesatuan Identitas), and the
-- photos at their Storage paths. The photos were copied from /public by
-- scripts/import-public-media.ts.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept. If a row already exists (for example a
-- draft saved from the editor), this file leaves it alone, and the site keeps
-- showing its current copy or the code fallback.

insert into public.page_content (
  slug, section_group, eyebrow, title, description, items, images, status, sort_order
) values (
  'makna-logo', 'tentang-kami', $q$Identitas Visual$q$, $q$Makna Logo$q$, null,
  $q$[{"title": "Simbol", "description": "Bentuk pusaran pada simbol Environesia menggambarkan siklus dan pergerakan yang berkelanjutan, cara kerja lingkungan yang terus berputar, saling terhubung, dan tidak pernah berhenti pada satu titik."}, {"title": "Tipografi", "description": "Wordmark huruf kecil (lowercase) dengan bentuk yang membulat dan modern mencerminkan sikap yang terbuka dan mudah diajak bekerja sama, tanpa mengurangi kesan profesional sebagai grup usaha."}, {"title": "Warna", "description": "Gradasi hijau menuju biru menyatukan dua asosiasi utama grup: hijau untuk lingkungan dan keberlanjutan, biru untuk kepercayaan dan profesionalisme dalam setiap pekerjaan yang dijalankan."}, {"title": "Kesatuan Identitas", "description": "Simbol dan wordmark dirancang menyatu sebagai satu kesatuan visual, merepresentasikan bagaimana lima entitas di bawah Environesia Group bekerja sebagai satu ekosistem, bukan lini usaha yang berdiri sendiri-sendiri."}]$q$::jsonb,
  $q$[{"key": "symbol", "path": "legacy/brand/environesia-symbol.png"}, {"key": "wordmark", "path": "legacy/brand/environesia-wordmark.png"}]$q$::jsonb,
  'published', 0
) on conflict (slug) do nothing;

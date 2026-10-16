-- Penghargaan: heading, intro, and SEO for the tab (see src/lib/cms/penghargaan.ts).
-- No awards list is seeded, because none has real data yet; the "coming soon"
-- state stays in the component.
--
-- Run after 0039_backfill_tentang_kami_seo.sql.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.page_content (
  slug, section_group, title, description, meta_title, meta_description, status, sort_order
) values (
  'penghargaan', 'tentang-kami', $q$Penghargaan$q$, $q$Pengakuan dan apresiasi untuk grup.$q$, $q$Penghargaan$q$, $q$Pengakuan dan apresiasi untuk Environesia Group.$q$, 'published', 50
) on conflict (slug) do nothing;

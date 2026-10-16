-- Points the Tata Kelola hero at its two photos, which are already in Storage
-- (bucket "media", paths legacy/banners2.jpg and legacy/banermobile.jpg, copied
-- from /public by scripts/import-public-media.ts).
--
-- Safe to run more than once. It only fills a path that is still empty, so a
-- photo uploaded in wp-admin is never overwritten. Nothing is deleted, and the
-- files in /public stay where they are.
--
-- Run this after the save fix is deployed. Without it the hero shows the default
-- photo, which is the same image.

alter table public.page_content
  add column if not exists image_path text,
  add column if not exists image_mobile_path text;

update public.page_content
   set image_path = 'legacy/banners2.jpg'
 where slug = 'tata-kelola-keberlanjutan'
   and image_path is null;

update public.page_content
   set image_mobile_path = 'legacy/banermobile.jpg'
 where slug = 'tata-kelola-keberlanjutan'
   and image_mobile_path is null;

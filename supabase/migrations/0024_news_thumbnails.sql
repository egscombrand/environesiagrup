-- Article thumbnails are taken automatically from the lead image of the
-- original media article (Link Berita). Nothing is generated or uploaded by
-- hand. thumbnail_url is the stored copy served to the site;
-- thumbnail_source_url is the image URL it came from, so every thumbnail can
-- be traced back to the source article. thumbnail_status is null until a
-- lookup has run, then 'found' or 'not_found'.

alter table public.posts
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_source_url text,
  add column if not exists thumbnail_source text,
  add column if not exists thumbnail_status text;

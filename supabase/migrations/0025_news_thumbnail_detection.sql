-- Thumbnail lookup now also reads the article body, and records how each
-- thumbnail was found and why a lookup failed. thumbnail_extractor_version
-- lets a re-run pick up only articles that were checked by an older extractor,
-- so a batch always finishes instead of re-checking the same articles.

alter table public.posts
  add column if not exists thumbnail_detection_method text,
  add column if not exists thumbnail_error_reason text,
  add column if not exists thumbnail_extractor_version integer;

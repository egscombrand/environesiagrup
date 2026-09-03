-- Cinematic hero media sequence: per-slide configurable display duration.
-- Null means "use the automatic default" -- ~6s for images, the video's own
-- natural playback length for video -- consistent with how every other
-- optional column on this table already behaves (e.g. secondary_cta_label).
alter table public.hero_slides
  add column duration_seconds numeric;

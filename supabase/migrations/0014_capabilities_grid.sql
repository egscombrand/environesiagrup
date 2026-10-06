-- ---------------------------------------------------------------------
-- Section 02 rebuilt as a static "capabilities grid" (per approved
-- reference design): each entity gets a short capability headline and a
-- more technical/specific description distinct from its existing
-- tagline/short_description (those remain in use, unchanged, on
-- /entitas/[slug], /bisnis-layanan/[slug], entity cards, and SEO JSON-LD
-- — this is new, dedicated copy for this one grid, not a repurposing of
-- those fields, so nothing else on the site is affected by editing it).
-- ---------------------------------------------------------------------

alter table public.entities
  add column capability_title text,
  add column capability_description text;

alter table public.site_settings
  add column capabilities_subtext text;

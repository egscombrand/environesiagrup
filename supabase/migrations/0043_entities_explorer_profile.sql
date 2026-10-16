-- Bisnis & Ekosistem's "Entity Explorer" card (src/components/bisnis-layanan/
-- ecosystem-exhibition.tsx) was hardcoded per entity, keyed by the same slug
-- the entities table already uses. This adds the same fields as columns,
-- alongside the existing Capabilities Grid columns (capability_title/
-- capability_description) set up the same way.
--
-- explorer_category      short category line (e.g. "Environmental Consulting")
-- explorer_description   one paragraph for "Tentang Perusahaan"
-- explorer_contribution  one paragraph for "Peran dan Kontribusi"
-- explorer_focus         short "Fokus Utama" keyword tags
-- explorer_services      short "Layanan Utama" keyword tags — a distinct,
--                        shorter list for this card, not the existing
--                        `services` column (a different, longer list shown
--                        on /bisnis/[pilar] and /bisnis-layanan/{slug})
-- explorer_role          "Peran dalam Ekosistem", one paragraph
-- explorer_image_path    the card's showcase illustration (Storage path)
--
-- website already exists and doubles as the card's "visit" link — no cta_url
-- column is added. Run 0044 next to fill these in from the current hardcoded
-- copy, including filling in a missing website for entities that have none yet.
--
-- Safe to run more than once.

alter table public.entities
  add column if not exists explorer_category text,
  add column if not exists explorer_description text,
  add column if not exists explorer_contribution text,
  add column if not exists explorer_focus text[] not null default '{}',
  add column if not exists explorer_services text[] not null default '{}',
  add column if not exists explorer_role text,
  add column if not exists explorer_image_path text;

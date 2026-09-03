-- ---------------------------------------------------------------------
-- Section 03 (Our Journey) — extend the existing milestones table with
-- an optional finer-grained date label, and add CMS-editable intro copy
-- for the section to site_settings, matching the precedent already set
-- for the ecosystem section's own copy fields.
-- ---------------------------------------------------------------------

alter table public.milestones
  add column date_label text;

alter table public.site_settings
  add column milestones_eyebrow text,
  add column milestones_intro text;

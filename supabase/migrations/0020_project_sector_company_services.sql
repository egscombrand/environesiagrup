-- Admin "Proyek & Insight" portfolio management needs two fields the
-- `projects` table doesn't have yet: which real company within the group a
-- project belongs to (metadata only — the public portfolio stays grouped by
-- sector, not by brand), and a short description of the services rendered.
-- `sector` already exists as a free-text column; it stays free-text here
-- too (the 7-option constraint is enforced at the admin form/Zod layer,
-- the same lightweight pattern this project already uses for `status`).
alter table public.projects
  add column company text,
  add column services text;

-- Rebuilds the Jobs editor's field structure. The table has zero rows today
-- (confirmed before writing this), so this is a clean redesign rather than a
-- data migration: unused columns are dropped instead of carried forward,
-- with nothing to lose.
--
-- Dropped: description, requirements, responsibilities — never populated;
-- replaced below by general_recruitment and specific_recruitment, each
-- holding sanitized HTML from the new WYSIWYG editor (see
-- src/components/admin/rich-text-editor.tsx) instead of plain text.
alter table jobs
  drop column if exists description,
  drop column if exists requirements,
  drop column if exists responsibilities;

alter table jobs
  add column division text,
  add column open_date date,
  add column cover_image_path text,
  add column general_recruitment text,
  add column specific_recruitment text,
  add column google_form_url text;

-- employment_type becomes a fixed "Status Job" choice instead of free text.
alter table jobs
  add constraint jobs_employment_type_check check (employment_type in ('internship', 'fulltime'));

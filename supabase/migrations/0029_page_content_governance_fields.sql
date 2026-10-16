-- Tata Kelola & Keberlanjutan, step 1: give page_content the fields the
-- governance pages need. Migration 0026 created the table with one language
-- and no media or SEO fields. This adds them without touching existing rows.
--
-- Language: the plain column (title, description, items, ...) is Indonesian and
-- is the default. The `_en` and `_zh` columns are optional translations. A
-- reader uses the translation when it is filled in and falls back to the
-- Indonesian value when it is not, so a page is never empty in English or
-- Chinese just because a translation is missing.
--
-- Shape of the new blocks:
--   items / items_en / items_zh   [{ "label"?, "title", "description" }]
--   steps / steps_en / steps_zh   [{ "label", "description"? }]     (ordered flow)
--   tags  / tags_en  / tags_zh    ["text", ...]                    (plain list)
--
-- Photos are stored as Storage paths (image_path, image_mobile_path), uploaded
-- from the editor. An empty path means "use the default photo built into the
-- website".

-- Nothing is inserted or changed here, and no data is deleted. Run 0030 to seed.

alter table public.page_content
  add column if not exists eyebrow_en text,
  add column if not exists eyebrow_zh text,
  add column if not exists title_en text,
  add column if not exists title_zh text,
  add column if not exists description_en text,
  add column if not exists description_zh text,
  add column if not exists items_en jsonb not null default '[]'::jsonb,
  add column if not exists items_zh jsonb not null default '[]'::jsonb,
  add column if not exists extra_label text,
  add column if not exists extra_label_en text,
  add column if not exists extra_label_zh text,
  add column if not exists extra_text text,
  add column if not exists extra_text_en text,
  add column if not exists extra_text_zh text,
  add column if not exists steps jsonb not null default '[]'::jsonb,
  add column if not exists steps_en jsonb not null default '[]'::jsonb,
  add column if not exists steps_zh jsonb not null default '[]'::jsonb,
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists tags_en jsonb not null default '[]'::jsonb,
  add column if not exists tags_zh jsonb not null default '[]'::jsonb,
  add column if not exists image_path text,
  add column if not exists image_mobile_path text,
  add column if not exists meta_title text,
  add column if not exists meta_title_en text,
  add column if not exists meta_title_zh text,
  add column if not exists meta_description text,
  add column if not exists meta_description_en text,
  add column if not exists meta_description_zh text;

-- Each array must be a JSON array, so a bad write fails here and not on the site.
-- Guarded so the file can be run again without failing on the existing constraint.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'page_content_arrays_are_arrays') then
    alter table public.page_content
      add constraint page_content_arrays_are_arrays check (
        jsonb_typeof(items) = 'array' and jsonb_typeof(items_en) = 'array' and jsonb_typeof(items_zh) = 'array'
        and jsonb_typeof(steps) = 'array' and jsonb_typeof(steps_en) = 'array' and jsonb_typeof(steps_zh) = 'array'
        and jsonb_typeof(tags) = 'array' and jsonb_typeof(tags_en) = 'array' and jsonb_typeof(tags_zh) = 'array'
      );
  end if;
end
$$;

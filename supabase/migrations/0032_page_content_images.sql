-- Named photos for a page, stored as Storage paths: [{ "key": "symbol", "path": "legacy/…" }].
-- A page's editor declares its keys, so a row can hold several photos (for
-- example Makna Logo's symbol and wordmark). An empty list means "use the
-- default photos built into the website".
--
-- Safe to run more than once. Nothing is deleted or changed in existing rows.

alter table public.page_content
  add column if not exists images jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'page_content_images_is_array') then
    alter table public.page_content
      add constraint page_content_images_is_array check (jsonb_typeof(images) = 'array');
  end if;
end
$$;

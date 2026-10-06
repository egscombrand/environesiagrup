-- Berita Perusahaan can now be imported from Excel/CSV. Owner (the brand
-- that published the item), media (the outlet), and source_url (the original
-- article link) are stored as-is from the spreadsheet. needs_review marks
-- rows that imported with missing or unverifiable fields.

alter table public.posts
  add column if not exists owner text,
  add column if not exists media text,
  add column if not exists source_url text,
  add column if not exists needs_review boolean not null default false;

create index if not exists posts_title_source_url_idx
  on public.posts (lower(title), source_url);

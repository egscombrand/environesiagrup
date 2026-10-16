-- Narrative pages managed from wp-admin: Overview, Makna Logo, Profil
-- Perusahaan, Layanan, and the seven Tata Kelola & Keberlanjutan areas. None
-- of these had a data model before; their copy lived in code.
--
-- One table, not one per page, because they share the same shape: a title,
-- an eyebrow, a short description, and an ordered list of items (each item
-- has a title and a description). Adding a page later means adding a row,
-- not a migration. `slug` is the stable key the admin and the public pages
-- use to find a row, so it is unique and never changes.
--
-- No rows are inserted here. Empty pages stay empty until someone writes the
-- content in wp-admin. Nothing is invented.

create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section_group text not null check (section_group in ('tentang-kami', 'bisnis-layanan', 'tata-kelola-keberlanjutan')),
  eyebrow text,
  title text not null,
  description text,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_page_content_updated_at
  before update on public.page_content
  for each row execute function public.set_updated_at();

alter table public.page_content enable row level security;

-- Visitors see only published pages. Staff see every row, drafts included.
create policy "page_content_select_published" on public.page_content
  for select to anon, authenticated
  using (status = 'published' or public.is_admin_role());

create policy "page_content_insert_staff" on public.page_content
  for insert to authenticated
  with check (public.is_admin_role());

create policy "page_content_update_staff" on public.page_content
  for update to authenticated
  using (public.is_admin_role())
  with check (public.is_admin_role());

create policy "page_content_delete_staff" on public.page_content
  for delete to authenticated
  using (public.is_admin_role());

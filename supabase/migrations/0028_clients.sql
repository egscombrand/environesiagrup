-- Klien & Mitra: the client and partner logos shown on the Proyek & Insight
-- page and the homepage trust wall. Until now the adapter in
-- src/lib/landing/clients-adapter.ts returned an empty list, because no table
-- existed. This migration creates the table; the adapter can then read it.
--
-- No rows are inserted. No client names are invented: wp-admin is where they
-- get added, one by one, with their own logo file.
--
-- Columns follow the pattern of the other content tables: a display name, an
-- optional logo path in the media bucket, a manual order, and an active flag
-- instead of a status, since a client is either shown or hidden.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  logo_path text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;

-- Visitors see active clients only. Staff see all of them, including hidden ones.
create policy "clients_select_active" on public.clients
  for select to anon, authenticated
  using (active = true or public.is_admin_role());

create policy "clients_insert_staff" on public.clients
  for insert to authenticated
  with check (public.is_admin_role());

create policy "clients_update_staff" on public.clients
  for update to authenticated
  using (public.is_admin_role())
  with check (public.is_admin_role());

create policy "clients_delete_staff" on public.clients
  for delete to authenticated
  using (public.is_admin_role());

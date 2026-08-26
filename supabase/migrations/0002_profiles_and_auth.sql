-- profiles: one row per auth.users row, carries the role used by every RLS
-- policy in later migrations. wp-admin logs users in by *username*, which
-- Supabase Auth has no native concept of, so the real auth.users email is a
-- synthetic, non-deliverable address and `username` here is what the UI and
-- RLS actually key off.

create type public.user_role as enum ('super_admin', 'editor', 'author');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text,
  role public.user_role not null default 'author',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- security definer: RLS policies call this to read the caller's role without
-- recursively hitting the RLS on profiles itself.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('super_admin', 'editor'), false);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'super_admin', false);
$$;

-- Auto-provision a profile row whenever a new Supabase Auth user is created
-- (used both by the wp-admin "create user" flow and the initial admin seed).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'author')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_super_admin());

create policy "profiles_insert_super_admin"
  on public.profiles for insert
  to authenticated
  with check (public.is_super_admin());

create policy "profiles_update_own_or_super_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

create policy "profiles_delete_super_admin"
  on public.profiles for delete
  to authenticated
  using (public.is_super_admin());

-- RLS above lets a user UPDATE their own row (so they can edit full_name /
-- password-adjacent fields), but self-service role escalation must be
-- blocked separately: a BEFORE UPDATE trigger sees the pre-update row via
-- OLD, so it can tell "was I already super_admin" independent of the RLS
-- check evaluated in the same statement.
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_super_admin() then
    raise exception 'Only super_admin can change roles';
  end if;
  return new;
end;
$$;

create trigger guard_profiles_role_change
  before update on public.profiles
  for each row execute function public.prevent_self_role_escalation();

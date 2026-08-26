-- Admin accounts move from a synthetic per-username email to a real one, so
-- Supabase Auth's built-in password-recovery email actually reaches someone.
-- profiles.email mirrors auth.users.email so the login action can resolve
-- "username -> email" server-side without querying the auth schema directly.
alter table public.profiles add column email text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'author'),
    new.email
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- Extensions and shared helper functions used by every later migration.

create extension if not exists pgcrypto with schema extensions;

-- Generic updated_at maintenance, attached per-table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

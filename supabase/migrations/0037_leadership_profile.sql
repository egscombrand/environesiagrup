-- Direktur Utama & Dewan Direksi: the leadership table gets the roles the page
-- shows, and a profile for the details the modal shows (education, experience,
-- stats, contribution, teaching). The profile is one JSON object, so the table
-- does not grow a column per list.
--
-- Roles:
--   direktur_utama   the featured Direktur Utama profile
--   direksi          Dewan Direksi (existing)
--   entitas_grup     leadership of a group entity, linked by entity_id
--   komisaris, lainnya   unchanged
--
-- Safe to run more than once. Nothing is deleted, and existing rows are kept.

alter table public.leadership drop constraint if exists leadership_type_check;
alter table public.leadership
  add constraint leadership_type_check
  check (type in ('direktur_utama', 'direksi', 'entitas_grup', 'komisaris', 'lainnya'));

alter table public.leadership
  add column if not exists profile jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leadership_profile_is_object') then
    alter table public.leadership
      add constraint leadership_profile_is_object check (jsonb_typeof(profile) = 'object');
  end if;
end
$$;

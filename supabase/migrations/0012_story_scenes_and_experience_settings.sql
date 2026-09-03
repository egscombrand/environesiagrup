-- Section 02 "interactive storytelling experience": a per-company ordered
-- list of story scenes (one flexible shape — headline/description/image/CTA
-- are all optional except headline is nullable too; the frontend renders
-- differently based on what's actually filled in) plus the opening/closing
-- narrative copy for the section as a whole, added to the existing
-- site_settings singleton rather than a second settings table.

-- ---------------------------------------------------------------------
-- story_scenes: belongs to one entity (company). No soft delete — scenes
-- are lightweight and fully replaceable via the admin story builder.
-- ---------------------------------------------------------------------
create table public.story_scenes (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities (id) on delete cascade,
  sort_order int not null default 0,
  headline text,
  description text,
  image_path text,
  cta_label text,
  cta_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index story_scenes_entity_id_idx on public.story_scenes (entity_id, sort_order);

create trigger set_story_scenes_updated_at
  before update on public.story_scenes
  for each row execute function public.set_updated_at();

alter table public.story_scenes enable row level security;

-- Same "standard content" shape as Group A in 0004_rls_policies.sql (public
-- reads published rows, editor/super_admin have unrestricted CRUD) — written
-- directly rather than folded into that migration's already-applied loop.
create policy "story_scenes_select_published" on public.story_scenes
  for select to anon, authenticated using (status = 'published');
create policy "story_scenes_select_staff" on public.story_scenes
  for select to authenticated using (public.is_admin_role());
create policy "story_scenes_insert_staff" on public.story_scenes
  for insert to authenticated with check (public.is_admin_role());
create policy "story_scenes_update_staff" on public.story_scenes
  for update to authenticated using (public.is_admin_role()) with check (public.is_admin_role());
create policy "story_scenes_delete_staff" on public.story_scenes
  for delete to authenticated using (public.is_admin_role());

-- ---------------------------------------------------------------------
-- site_settings: Section 02's opening/transition/closing copy. Nullable —
-- the frontend falls back to i18n defaults until an admin fills these in,
-- so the page is never broken/empty in the meantime.
-- ---------------------------------------------------------------------
alter table public.site_settings
  add column ecosystem_eyebrow text,
  add column ecosystem_opening_question text,
  add column ecosystem_opening_statement_1 text,
  add column ecosystem_opening_statement_2 text,
  add column ecosystem_opening_cta_label text,
  add column ecosystem_discovery_intro_1 text,
  add column ecosystem_discovery_intro_2 text,
  add column ecosystem_closing_heading text,
  add column ecosystem_closing_subtext text,
  add column ecosystem_closing_cta_label text;

-- PDF Import for Projects: every upload is one "batch" (import_batches),
-- and each project row created from it keeps its own provenance (which
-- document, which page, how it was extracted, how confident the AI was)
-- so an admin can always trace a field back to its source document rather
-- than trusting an opaque auto-filled value.
create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  source_document text not null,
  status text not null default 'uploading'
    check (status in ('uploading', 'processing', 'review', 'completed', 'failed', 'cancelled')),
  projects_found int not null default 0,
  imported_count int not null default 0,
  imported_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_import_batches_updated_at
  before update on public.import_batches
  for each row execute function public.set_updated_at();

alter table public.projects
  add column source_document text,
  add column source_page int,
  add column extraction_method text,
  add column confidence text check (confidence in ('high', 'medium', 'low')),
  add column import_batch_id uuid references public.import_batches (id);

create index projects_import_batch_id_idx on public.projects (import_batch_id);

alter table public.import_batches enable row level security;

-- Internal admin provenance log, not public content — same staff roles who
-- can already reach the Projects admin page (editor/super_admin, plus
-- author for their own batches) can read and write it; no anon/public access.
create policy "import_batches_select_staff" on public.import_batches
  for select to authenticated
  using (public.is_admin_role() or imported_by = auth.uid());

create policy "import_batches_insert_staff" on public.import_batches
  for insert to authenticated
  with check (public.is_admin_role() or (public.current_user_role() = 'author' and imported_by = auth.uid()));

create policy "import_batches_update_staff" on public.import_batches
  for update to authenticated
  using (public.is_admin_role() or imported_by = auth.uid());

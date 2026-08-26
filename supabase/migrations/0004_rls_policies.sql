-- Row Level Security. Nothing here ever grants anon/public write access;
-- anon and authenticated both only ever get SELECT on published rows unless
-- explicitly a staff policy gated by public.current_user_role().

alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.entities enable row level security;
alter table public.business_pillars enable row level security;
alter table public.pillar_entities enable row level security;
alter table public.hero_slides enable row level security;
alter table public.stats enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_entities enable row level security;
alter table public.posts enable row level security;
alter table public.leadership enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.jobs enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.media enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------------
-- Group A: "standard content" tables. Public reads published rows (and,
-- where the table has deleted_at, only non-deleted ones); editor/super_admin
-- have unrestricted CRUD; author has no special access on these (brand /
-- structural content, not something authors draft independently).
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  has_deleted_at boolean;
  standard_tables text[] := array['entities', 'business_pillars', 'hero_slides', 'stats', 'leadership', 'milestones'];
begin
  foreach t in array standard_tables loop
    has_deleted_at := exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'deleted_at'
    );

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (status = %L%s)',
      t || '_select_published', t, 'published',
      case when has_deleted_at then ' and deleted_at is null' else '' end
    );

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin_role())',
      t || '_select_staff', t
    );

    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin_role())',
      t || '_insert_staff', t
    );

    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin_role()) with check (public.is_admin_role())',
      t || '_update_staff', t
    );

    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin_role())',
      t || '_delete_staff', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Group B: "author-scoped" tables. Same public read rule as Group A.
-- editor/super_admin: unrestricted CRUD. author: may insert, and may
-- update/delete only rows they created themselves while still in draft
-- (so an author can't self-publish or edit someone else's or a live post).
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  author_tables text[] := array['posts', 'projects', 'jobs', 'documents'];
begin
  foreach t in array author_tables loop
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (status = %L and deleted_at is null)',
      t || '_select_published', t, 'published'
    );

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin_role() or created_by = auth.uid())',
      t || '_select_staff', t
    );

    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin_role() or (public.current_user_role() = %L and created_by = auth.uid() and status = %L))',
      t || '_insert_staff', t, 'author', 'draft'
    );

    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin_role() or (created_by = auth.uid() and public.current_user_role() = %L)) with check (public.is_admin_role() or (public.current_user_role() = %L and created_by = auth.uid() and status = %L))',
      t || '_update_staff', t, 'author', 'author', 'draft'
    );

    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin_role() or (created_by = auth.uid() and public.current_user_role() = %L and status = %L))',
      t || '_delete_staff', t, 'author', 'draft'
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Group C: relation / gallery tables. No status of their own — visibility
-- follows "is this basically public metadata" (yes), writes are staff-only
-- (editor/super_admin; authors attach images/relations only through the
-- editor review step, not directly).
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  relation_tables text[] := array['pillar_entities', 'project_entities', 'project_images'];
begin
  foreach t in array relation_tables loop
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t || '_select_all', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin_role())', t || '_insert_staff', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin_role()) with check (public.is_admin_role())', t || '_update_staff', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin_role())', t || '_delete_staff', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Group D: site-wide configuration. Publicly readable (footer/contact/nav
-- need it on every page), writable by super_admin only.
-- ---------------------------------------------------------------------
create policy "site_settings_select_all" on public.site_settings for select to anon, authenticated using (true);
create policy "site_settings_update_super_admin" on public.site_settings for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "navigation_select_published" on public.navigation_items for select to anon, authenticated using (status = 'published');
create policy "navigation_select_staff" on public.navigation_items for select to authenticated using (public.is_super_admin());
create policy "navigation_insert_super_admin" on public.navigation_items for insert to authenticated with check (public.is_super_admin());
create policy "navigation_update_super_admin" on public.navigation_items for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "navigation_delete_super_admin" on public.navigation_items for delete to authenticated using (public.is_super_admin());

create policy "pages_select_all" on public.pages for select to anon, authenticated using (true);
create policy "pages_write_super_admin" on public.pages for insert to authenticated with check (public.is_super_admin());
create policy "pages_update_super_admin" on public.pages for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "pages_delete_super_admin" on public.pages for delete to authenticated using (public.is_super_admin());

create policy "page_sections_select_published" on public.page_sections for select to anon, authenticated using (status = 'published');
create policy "page_sections_select_staff" on public.page_sections for select to authenticated using (public.is_super_admin());
create policy "page_sections_insert_super_admin" on public.page_sections for insert to authenticated with check (public.is_super_admin());
create policy "page_sections_update_super_admin" on public.page_sections for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "page_sections_delete_super_admin" on public.page_sections for delete to authenticated using (public.is_super_admin());

-- ---------------------------------------------------------------------
-- media library index: staff-only (any role may browse/upload; only
-- editor/super_admin may delete/replace someone else's upload).
-- ---------------------------------------------------------------------
create policy "media_select_staff" on public.media for select to authenticated using (public.current_user_role() is not null);
create policy "media_insert_staff" on public.media for insert to authenticated with check (public.current_user_role() is not null and uploaded_by = auth.uid());
create policy "media_update_staff" on public.media for update to authenticated using (public.is_admin_role() or uploaded_by = auth.uid()) with check (public.is_admin_role() or uploaded_by = auth.uid());
create policy "media_delete_staff" on public.media for delete to authenticated using (public.is_admin_role() or uploaded_by = auth.uid());

-- ---------------------------------------------------------------------
-- audit_logs: append-only. Any staff member can write an entry for their
-- own action; only super_admin can read the log. No update/delete policy
-- exists for anyone (immutable via the API; service role can still
-- intervene at the Postgres level if ever truly necessary).
-- ---------------------------------------------------------------------
create policy "audit_logs_insert_self" on public.audit_logs for insert to authenticated with check (user_id = auth.uid());
create policy "audit_logs_select_super_admin" on public.audit_logs for select to authenticated using (public.is_super_admin());

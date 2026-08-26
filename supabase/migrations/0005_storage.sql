-- Single public "media" bucket, folder-prefixed by convention
-- (logos/, hero/, entities/, projects/, leadership/, posts/, documents/,
-- general/). Public so next/image and plain <a href> downloads work off the
-- public URL without signed links; writes are staff-only via RLS below.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  26214400, -- 25 MB
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/avif',
    'video/mp4',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

create policy "media_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_bucket_staff_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.current_user_role() is not null);

create policy "media_bucket_owner_or_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (public.is_admin_role() or owner = auth.uid()))
  with check (bucket_id = 'media' and (public.is_admin_role() or owner = auth.uid()));

create policy "media_bucket_owner_or_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (public.is_admin_role() or owner = auth.uid()));

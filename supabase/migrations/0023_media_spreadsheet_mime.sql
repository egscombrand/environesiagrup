-- The media bucket only accepted images, video, and PDF, so Excel/CSV uploads
-- for Berita Perusahaan import were rejected by Storage. Adds the spreadsheet
-- and CSV types without removing any existing ones.

update storage.buckets
set allowed_mime_types = (
  select array_agg(distinct m order by m)
  from unnest(
    coalesce(allowed_mime_types, '{}'::text[]) || array[
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv'
    ]
  ) as m
)
where id = 'media';

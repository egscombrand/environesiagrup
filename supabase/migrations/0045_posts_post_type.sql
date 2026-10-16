-- Splits the single "posts" table into two content types that the admin now
-- edits, lists, and manages as entirely separate editors: Siaran Pers (press
-- clippings — external media coverage, with owner/media/source_url and
-- scraped thumbnails) and Berita Perusahaan (news the company writes and
-- publishes itself). They previously shared one "Siaran Pers" admin screen,
-- with "Berita Perusahaan" redirecting into it and showing nothing of its
-- own — this column is what the two new resource configs (see
-- src/lib/admin/resources/siaran-pers.ts and berita-perusahaan.ts) filter,
-- force, and list by, so a row can never leak between the two.
--
-- Every row that exists today was scraped from an Excel/CSV import of press
-- coverage (it has a source_url, an owner brand, and a media outlet, and no
-- real `content` body), so the default correctly backfills all of them as
-- 'siaran_pers' with no separate UPDATE needed.
alter table posts
  add column post_type text not null default 'siaran_pers';

alter table posts
  add constraint posts_post_type_check check (post_type in ('siaran_pers', 'berita_perusahaan'));

create index if not exists posts_post_type_idx on posts (post_type);

-- Cleans up a mislabeled leftover from the same import: `category` was
-- hardcoded to the literal string 'berita-perusahaan' for every imported
-- press clipping, regardless of its real subject — not a real category, and
-- visibly wrong on the public article page (e.g. "26 Oktober 2024 · berita-
-- perusahaan" under a Kompas story about GreenLab). It's cleared here; the
-- column stays, free for an admin to fill in a real category if they want.
update posts set category = null where category = 'berita-perusahaan';

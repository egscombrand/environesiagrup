-- Landing-page blueprint redesign (environesia-landing-page-master-prompt
-- skill): the target structure is a specific 10 named sections, which
-- doesn't map 1:1 onto the 11 sections seeded by 0003/0009. Rather than
-- deleting anything, superseded sections are retired to draft (reversible —
-- one toggle in /wp-admin/site/pages brings any of them back) and the new
-- ones are inserted as data rows, same as 0009. No schema change:
-- section_key stays plain text.

-- Retire the standalone Statistics band -- the hero (Executive Snapshot)
-- now shows its own inline stats strip, and "Statistics" isn't one of the
-- 10 named sections.
update public.page_sections
set status = 'draft', sort_order = 21
where section_key = 'stats'
  and page_id = (select id from public.pages where slug = 'home');

-- Retire the Country/Reach Map -- real, working content, but not one of the
-- 10 named sections and doesn't obviously fold into another one.
update public.page_sections
set status = 'draft', sort_order = 22
where section_key = 'map'
  and page_id = (select id from public.pages where slug = 'home');

-- Retire the old honest-skeleton Leadership Message -- superseded by the
-- new real, roster-based Leadership section below.
update public.page_sections
set status = 'draft', sort_order = 23
where section_key = 'leadership_message'
  and page_id = (select id from public.pages where slug = 'home');

-- Renumber the surviving published sections to the blueprint's order:
-- hero -> entities -> pillars -> projects_showcase -> milestones ->
-- leadership -> sustainability -> news -> documents -> cta.
update public.page_sections
set sort_order = case section_key
  when 'hero' then 0
  when 'entities' then 1
  when 'pillars' then 2
  when 'projects_showcase' then 3
  when 'sustainability' then 6
  when 'news' then 7
  when 'cta' then 9
  else sort_order
end
where page_id = (select id from public.pages where slug = 'home')
  and section_key in ('hero', 'entities', 'pillars', 'projects_showcase', 'sustainability', 'news', 'cta');

-- New sections. `clients` is inserted as draft (unpublished): it has zero
-- CMS backing anywhere in this project (no table, no admin resource) and
-- its adapter (src/lib/landing/clients-adapter.ts) returns an empty array
-- rather than invented company names, so publishing it now would show an
-- empty section with nothing gained -- flip it to published once real data
-- exists (or you decide you want the honest-empty-state visible sooner).
insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, s.key, s.ord, s.status
from public.pages p
cross join (values
  ('milestones', 4, 'published'),
  ('leadership', 5, 'published'),
  ('documents', 8, 'published'),
  ('clients', 24, 'draft')
) as s (key, ord, status)
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

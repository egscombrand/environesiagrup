-- Phase 1 homepage redesign: retire the green_business stub (superseded by
-- the more properly scoped leadership_message + sustainability sections
-- below) and add three new sections. green_business is toggled to draft
-- rather than deleted -- the row and its component (green-business-split.tsx)
-- stay in place, reversible, in case a future revision wants the
-- manifesto+quote split again in a different form.
update public.page_sections
set status = 'draft', sort_order = 20
where section_key = 'green_business'
  and page_id = (select id from public.pages where slug = 'home');

-- Renumber the surviving sections to make room, in the same style as the
-- original 0003 seed.
update public.page_sections
set sort_order = case section_key
  when 'hero' then 0
  when 'stats' then 1
  when 'entities' then 2
  when 'pillars' then 3
  when 'map' then 5
  when 'news' then 8
  when 'cta' then 9
  else sort_order
end
where page_id = (select id from public.pages where slug = 'home')
  and section_key in ('hero', 'stats', 'entities', 'pillars', 'map', 'news', 'cta');

insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, s.key, s.ord, 'published'
from public.pages p
cross join (values
  ('projects_showcase', 4),
  ('leadership_message', 6),
  ('sustainability', 7)
) as s (key, ord)
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

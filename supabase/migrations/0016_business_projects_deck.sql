-- New homepage section — "Lini Bisnis dan Proyek Berjalan": a stacked-deck
-- showcase of ongoing/business-line projects, reusing the existing
-- `projects` CMS table (no new content model). Placed directly under the
-- group-ecosystem banner. Shift every published section from 'pillars'
-- onward down by one slot to make room at sort_order 3.
update public.page_sections
set sort_order = sort_order + 1
where page_id = (select id from public.pages where slug = 'home')
  and status = 'published'
  and section_key in ('pillars', 'projects_showcase', 'milestones', 'leadership', 'sustainability', 'news', 'documents', 'cta');

insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, 'business_projects', 3, 'published'
from public.pages p
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

-- New homepage section — "Standar yang Kami Pegang dan Jalankan": an
-- editorial numbered list of the group's real operating standards, reusing
-- the same StandardsSection component already shown on the Tentang Kami
-- page (shared component, not duplicated content or a new content model).
-- Placed directly under "Lini Bisnis dan Proyek Berjalan" (business_projects,
-- sort_order 3). Shift every published section currently at sort_order 4 or
-- later down by one slot to make room.
update public.page_sections
set sort_order = sort_order + 1
where page_id = (select id from public.pages where slug = 'home')
  and status = 'published'
  and sort_order >= 4;

insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, 'standards', 4, 'published'
from public.pages p
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

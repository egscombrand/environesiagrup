-- New homepage section — "Dipercaya oleh Berbagai Mitra": a client/partner
-- trust wall, placed directly under "Standar yang Kami Pegang dan Jalankan"
-- (standards, sort_order 4). Shift every published section currently at
-- sort_order 5 or later down by one slot to make room.
update public.page_sections
set sort_order = sort_order + 1
where page_id = (select id from public.pages where slug = 'home')
  and status = 'published'
  and sort_order >= 5;

insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, 'trusted_partners', 5, 'published'
from public.pages p
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

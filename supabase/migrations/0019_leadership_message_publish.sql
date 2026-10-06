-- Publish the real "Pesan Direktur Utama" content into the existing
-- leadership_message slot (previously an honest structural placeholder —
-- see leadership-message.tsx), placed directly after "Dipercaya oleh
-- Berbagai Mitra" (trusted_partners, sort_order 5). Shift every other
-- published section currently at sort_order 6 or later down by one slot;
-- leadership_message itself is still 'draft' at this point, so it is not
-- matched (and re-shifted) by this update.
update public.page_sections
set sort_order = sort_order + 1
where page_id = (select id from public.pages where slug = 'home')
  and status = 'published'
  and sort_order >= 6;

update public.page_sections
set sort_order = 6, status = 'published'
where page_id = (select id from public.pages where slug = 'home')
  and section_key = 'leadership_message';

-- The header and footer render two independent link sets. navigation_items
-- needs to know which one a row belongs to so wp-admin can manage them
-- separately (adding a footer link should not add a header item).
alter table public.navigation_items
  add column menu text not null default 'header' check (menu in ('header', 'footer'));

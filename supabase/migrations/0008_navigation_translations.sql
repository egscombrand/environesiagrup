-- Navigation labels are the only content translated in this phase: they sit in
-- the header on every page, so leaving them Indonesian would make the Chinese
-- and English sites read as half-finished. Both columns are nullable and a null
-- falls back to `label`, so existing rows stay valid and an untranslated item
-- degrades to Indonesian rather than rendering empty.
alter table public.navigation_items
  add column label_en text,
  add column label_zh text;

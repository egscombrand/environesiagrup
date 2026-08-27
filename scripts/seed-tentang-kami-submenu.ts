// Adds the six Tentang Kami sub-pages as children of the existing
// "Tentang Kami" header item, so the navbar renders them as a dropdown.
//
// Deliberately ADDITIVE and idempotent — unlike seed-navigation-and-settings,
// which resets navigation wholesale. Anything an editor has since changed in
// wp-admin survives a run of this script: an item that already exists is
// updated in place rather than deleted and recreated, so its id (and any
// child rows pointing at it) stay stable.
//
// Usage: npx tsx scripts/seed-tentang-kami-submenu.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/database.types';

process.loadEnvFile?.('.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Labels mirror src/lib/tentang-kami-routes.ts for Indonesian; the English and
// Chinese are the nav-label translations for those same pages.
const CHILDREN = [
  { url: '/tentang-kami/sejarah', label: 'Sejarah', label_en: 'History', label_zh: '发展历程' },
  { url: '/tentang-kami/visi-misi', label: 'Visi & Misi', label_en: 'Vision & Mission', label_zh: '愿景与使命' },
  { url: '/tentang-kami/makna-logo', label: 'Makna Logo', label_en: 'Logo Meaning', label_zh: '标志寓意' },
  { url: '/tentang-kami/struktur-organisasi', label: 'Struktur Organisasi', label_en: 'Organisational Structure', label_zh: '组织架构' },
  { url: '/tentang-kami/green-business', label: 'Green Business', label_en: 'Green Business', label_zh: '绿色商业' },
  { url: '/tentang-kami/penghargaan', label: 'Penghargaan', label_en: 'Awards', label_zh: '荣誉奖项' },
];

// The label_en/label_zh columns only exist once migration 0008 has been
// applied. Probing for them lets this script do its real job — creating the
// submenu — on a database that has not been migrated yet, instead of failing
// outright. navigationLabel already falls back to `label`, so an unmigrated
// site simply shows Indonesian labels in every locale.
async function hasTranslationColumns() {
  const { error } = await supabase.from('navigation_items').select('label_en').limit(1);
  return !error;
}

async function main() {
  const translatable = await hasTranslationColumns();
  if (!translatable) {
    console.warn(
      'label_en/label_zh not present — run migration 0008 to enable translated nav labels.\n' +
        'Seeding Indonesian labels only; rerun this script after migrating.'
    );
  }

  const { data: parent, error: parentError } = await supabase
    .from('navigation_items')
    .select('id')
    .eq('menu', 'header')
    .eq('url', '/tentang-kami')
    .is('parent_id', null)
    .maybeSingle();

  if (parentError) throw new Error(`Lookup failed: ${parentError.message}`);
  if (!parent) {
    console.error('No top-level header item with url /tentang-kami. Create it in wp-admin first.');
    process.exit(1);
  }

  const { data: existing, error: existingError } = await supabase
    .from('navigation_items')
    .select('id, url')
    .eq('parent_id', parent.id);

  if (existingError) throw new Error(`Child lookup failed: ${existingError.message}`);
  const byUrl = new Map((existing ?? []).map((row) => [row.url, row.id]));

  let inserted = 0;
  let updated = 0;

  for (const [index, child] of CHILDREN.entries()) {
    const { label_en, label_zh, ...base } = child;
    const payload = {
      ...base,
      ...(translatable ? { label_en, label_zh } : {}),
      menu: 'header' as const,
      parent_id: parent.id,
      sort_order: index,
      status: 'published' as const,
      open_new_tab: false,
    };

    const id = byUrl.get(child.url);
    if (id) {
      const { error } = await supabase.from('navigation_items').update(payload).eq('id', id);
      if (error) throw new Error(`Update ${child.url} failed: ${error.message}`);
      updated += 1;
    } else {
      const { error } = await supabase.from('navigation_items').insert(payload);
      if (error) throw new Error(`Insert ${child.url} failed: ${error.message}`);
      inserted += 1;
    }
  }

  console.log(`Tentang Kami submenu: ${inserted} inserted, ${updated} updated`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

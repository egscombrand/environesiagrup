// One-off seed: moves the header/footer nav arrays and office
// address/tagline that used to be hardcoded in src/components/layout/* and
// src/lib/site.ts into Supabase, with the exact same values, so switching
// those components to read from the CMS causes zero visible change.
// Idempotent: navigation is reset (delete-then-insert) each run; settings is
// a single-row update.
//
// Usage: npx tsx scripts/seed-navigation-and-settings.ts

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

const HEADER_ITEMS = [
  { label: 'Beranda', url: '/' },
  { label: 'Entitas', url: '/entitas' },
  { label: 'Pimpinan', url: '/pimpinan' },
  { label: 'Bisnis', url: '/bisnis' },
  { label: 'Tentang Kami', url: '/tentang-kami' },
  { label: 'Proyek', url: '/proyek-insight' },
  { label: 'Berita', url: '/berita' },
  { label: 'Karier', url: '/karier' },
  { label: 'Kontak', url: '/kontak' },
];

const FOOTER_ITEMS = [
  { label: 'Entitas', url: '/entitas' },
  { label: 'Proyek', url: '/proyek-insight' },
  { label: 'Berita', url: '/berita' },
  { label: 'Karier', url: '/karier' },
  { label: 'Unduhan', url: '/unduhan' },
  { label: 'Kontak', url: '/kontak' },
  { label: 'Kebijakan Privasi', url: '/kebijakan-privasi' },
];

async function seedNavigation() {
  await supabase.from('navigation_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const rows = [
    ...HEADER_ITEMS.map((item, i) => ({ ...item, menu: 'header' as const, sort_order: i, status: 'published' as const })),
    ...FOOTER_ITEMS.map((item, i) => ({ ...item, menu: 'footer' as const, sort_order: i, status: 'published' as const })),
  ];

  const { error } = await supabase.from('navigation_items').insert(rows);
  if (error) throw new Error(`Failed to seed navigation: ${error.message}`);
  console.log(`navigation_items: ${rows.length} inserted`);
}

async function seedSettings() {
  const { error } = await supabase
    .from('site_settings')
    .update({
      site_name: 'Environesia Company Group',
      tagline: 'The World-Class Integrated Green Ecosystem',
      email: null,
      phone: null,
      address:
        'Grha Environesia (Lantai 2)\nJl. Jati Mataram No. 284B, Karangjati\nSinduadi, Mlati, Sleman\nDaerah Istimewa Yogyakarta 55284',
      seo_default_title: 'Environesia Company Group',
      seo_default_description:
        'Environesia Company Group menaungi lima entitas di bidang lingkungan dan manufaktur apparel.',
    })
    .eq('id', 1);

  if (error) throw new Error(`Failed to seed site_settings: ${error.message}`);
  console.log('site_settings: updated');
}

async function main() {
  await seedNavigation();
  await seedSettings();
}

main();

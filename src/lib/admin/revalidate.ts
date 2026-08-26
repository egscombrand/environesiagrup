import 'server-only';

import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

/**
 * Busts every public page under both locales. Content lives behind one
 * shared [locale] layout, so revalidating that layout invalidates every
 * page rendered under it (home, listing, and slug-based detail pages alike)
 * — simpler and more robust than hand-maintaining a per-resource path map
 * that has to be kept in sync with every new cross-reference (e.g. an
 * entity showing up on /tentang-kami, /bisnis/[pilar], and its own page).
 */
export function revalidatePublicSite() {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, 'layout');
  }
  revalidatePath('/sitemap.xml');
}

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
  // Pass the ROUTE PATTERN, not a resolved path. Every public page lives under
  // the dynamic segment /[locale], and a resolved path like '/id' does not
  // reliably match a dynamic route — the call returns without error and
  // invalidates nothing, so an edit in wp-admin looks saved while the live
  // site keeps serving the page built at deploy time. One call covers all
  // locales, since they are the same route.
  revalidatePath('/[locale]', 'layout');

  // Kept as literal paths: these are static routes with no dynamic segment.
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, 'layout');
  }
  revalidatePath('/sitemap.xml');
}

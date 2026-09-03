import type { Database } from '@/lib/supabase/database.types';

// createClient/createPublicClient are imported dynamically inside the
// functions below (rather than statically at module scope) so that pure,
// side-effect-free helpers like navigationLabel can be imported — e.g. from
// tests — without pulling in `server-only`, which throws unconditionally
// outside Next.js's webpack client/server split.

export { navigationLabel } from './navigation-label';

type NavigationRow = Database['public']['Tables']['navigation_items']['Row'];

export type NavigationNode = NavigationRow & { children: NavigationNode[] };

export function buildTree(rows: NavigationRow[]): NavigationNode[] {
  const nodes = new Map<string, NavigationNode>(rows.map((row) => [row.id, { ...row, children: [] }]));
  const roots: NavigationNode[] = [];

  for (const row of rows) {
    const node = nodes.get(row.id)!;
    if (row.parent_id && nodes.has(row.parent_id)) {
      nodes.get(row.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function getPublishedNavigation(menu: 'header' | 'footer' = 'header'): Promise<NavigationNode[]> {
  const { createPublicClient } = await import('@/lib/supabase/public');
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('status', 'published')
    .eq('menu', menu)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load navigation: ${error.message}`);
  return buildTree(data ?? []);
}

export async function listNavigationForAdmin(): Promise<NavigationRow[]> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data, error } = await supabase.from('navigation_items').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load navigation: ${error.message}`);
  return data ?? [];
}

/**
 * Public: every published navigation item's own `slug` mapped to its
 * `url` — the destination URL for a given identifier (e.g. an entity's
 * `slug`) is whatever an admin has set on the matching navigation item, not
 * anything computed or hardcoded in the frontend. An admin linking a menu
 * item to "environesia" by setting that item's Slug field is what makes
 * `map['environesia']` resolve; items with no slug set are simply absent
 * from the map (nothing to link to yet, not an error).
 */
export async function getPublishedNavigationUrlsBySlug(
  menu: 'header' | 'footer' = 'header'
): Promise<Record<string, string>> {
  const { createPublicClient } = await import('@/lib/supabase/public');
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('navigation_items')
    .select('slug, url')
    .eq('status', 'published')
    .eq('menu', menu)
    .not('slug', 'is', null);

  if (error) throw new Error(`Failed to load navigation slugs: ${error.message}`);

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.slug) map[row.slug] = row.url;
  }
  return map;
}

/**
 * Public: the published navigation item whose `url` exactly matches the
 * given path — the reverse of `getPublishedNavigationUrlsBySlug`, used by a
 * page that only knows its own URL to find which `slug` (and so which
 * entity, or other CMS record) an admin has linked it to.
 */
export async function getPublishedNavigationItemByUrl(
  url: string,
  menu: 'header' | 'footer' = 'header'
): Promise<{ slug: string | null; url: string } | null> {
  const { createPublicClient } = await import('@/lib/supabase/public');
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('navigation_items')
    .select('slug, url')
    .eq('url', url)
    .eq('status', 'published')
    .eq('menu', menu)
    .maybeSingle();

  if (error) throw new Error(`Failed to load navigation item for url "${url}": ${error.message}`);
  return data;
}

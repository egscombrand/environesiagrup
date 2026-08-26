import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

type NavigationRow = Database['public']['Tables']['navigation_items']['Row'];

export type NavigationNode = NavigationRow & { children: NavigationNode[] };

function buildTree(rows: NavigationRow[]): NavigationNode[] {
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
  const supabase = await createClient();
  const { data, error } = await supabase.from('navigation_items').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load navigation: ${error.message}`);
  return data ?? [];
}

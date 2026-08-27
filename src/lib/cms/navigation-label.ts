import type { Database } from '@/lib/supabase/database.types';

// Split out from navigation.ts (and imported only via type-only imports from
// there) so this pure, side-effect-free resolver can be safely imported from
// anywhere — including 'use client' components — without ever pulling in
// next/headers or `server-only` transitively.
type NavigationRow = Database['public']['Tables']['navigation_items']['Row'];

// Resolves a navigation item's label for a locale. A missing translation falls
// back to the Indonesian `label` rather than rendering an empty menu item.
export function navigationLabel(
  node: Pick<NavigationRow, 'label' | 'label_en' | 'label_zh'>,
  locale: string
): string {
  if (locale === 'en') return node.label_en?.trim() || node.label;
  if (locale === 'zh') return node.label_zh?.trim() || node.label;
  return node.label;
}

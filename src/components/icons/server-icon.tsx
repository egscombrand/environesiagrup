import type { ReactElement } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { BarChart3, type LucideProps } from 'lucide-react';

type IconModuleMap = typeof dynamicIconImports;

/**
 * Server-only counterpart to DynamicIcon (./dynamic-icon.tsx). Use this
 * anywhere the icon renders inside a Server Component with no other reason
 * to cross the client boundary (public pages) — it resolves the actual icon
 * during SSR, so only static SVG markup reaches the browser.
 *
 * The client DynamicIcon exists for a reason: lucide-react/dynamic's client
 * component ships a ~2000-entry lazy-import map into the bundle of whatever
 * client component uses it. That's fine for wp-admin (already a
 * client-heavy, internal-tool bundle), but on the public homepage it blew
 * the First Load JS budget project.md sets (max 200 KB) — this is the fix:
 * same "name in DB -> icon" behavior, zero client bytes.
 *
 * This is a plain async function, not a component rendered as `<ServerIcon />`
 * JSX — only Next's RSC renderer tolerates an async component as an element
 * type, and it isn't renderable by React's client renderer at all (which is
 * what plain unit tests and any client-tree consumer use). Call and await it
 * directly, then embed the resolved element in JSX.
 */
export async function resolveServerIcon({
  name,
  ...props
}: { name?: string | null } & Omit<LucideProps, 'ref' | 'name'>): Promise<ReactElement> {
  if (name && Object.prototype.hasOwnProperty.call(dynamicIconImports, name)) {
    try {
      const mod = await dynamicIconImports[name as keyof IconModuleMap]();
      const Icon = mod.default;
      return <Icon {...props} aria-hidden="true" />;
    } catch {
      // Fall through to the fallback below — a bad/renamed icon name must
      // never break the page.
    }
  }
  return <BarChart3 {...props} aria-hidden="true" />;
}

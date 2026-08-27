import Link from 'next/link';
import { navigationLabel } from '@/lib/cms/navigation-label';
import type { NavigationNode } from '@/lib/cms/navigation';

function href(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url === '/' ? '' : url}`;
}

// The submenu opens on hover AND on focus-within, using CSS only. That keeps
// this a Server Component — no open/close state, no client bundle — and it
// means the dropdown works for keyboard users, who would be locked out of a
// hover-only menu, and still works if JavaScript never arrives.
export function NavItem({ item, locale }: { item: NavigationNode; locale: string }) {
  const label = navigationLabel(item, locale);
  const link = (
    <Link
      href={href(item.url, locale)}
      target={item.open_new_tab ? '_blank' : undefined}
      rel={item.open_new_tab ? 'noreferrer' : undefined}
      className="text-small text-ink transition-colors hover:text-forest group-data-[overlay]/hdr:text-paper group-data-[overlay]/hdr:hover:text-paper/70 motion-reduce:transition-none"
    >
      {label}
    </Link>
  );

  if (item.children.length === 0) return link;

  return (
    <div className="group relative focus-within:z-50">
      <span className="flex items-center gap-1">
        {link}
        <svg
          className="h-3 w-3 text-slate group-data-[overlay]/hdr:text-paper/70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180 motion-reduce:transition-none"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>

      <ul
        className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 rounded-[14px] border border-line bg-paper p-2 opacity-0 shadow-sm transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none"
      >
        {item.children.map((child) => (
          <li key={child.id}>
            <Link
              href={href(child.url, locale)}
              target={child.open_new_tab ? '_blank' : undefined}
              rel={child.open_new_tab ? 'noreferrer' : undefined}
              className="block rounded-[10px] px-3 py-2 text-small text-ink hover:bg-stone hover:text-forest"
            >
              {navigationLabel(child, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

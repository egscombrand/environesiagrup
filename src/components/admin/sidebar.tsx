'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { Role } from '@/lib/admin/roles';
import {
  DASHBOARD_ITEM,
  NAV_SECTIONS,
  isItemActive,
  matchesPath,
  visibleItems,
  type NavItem,
} from './nav-config';

// Touch targets are at least 44px tall on phones and tablets, and 38px on desktop.
const ROW =
  'group relative flex min-h-[44px] w-full items-center gap-3 rounded-[12px] px-3 text-left text-small transition-colors duration-200 motion-reduce:transition-none lg:min-h-[38px] lg:py-1.5';

const ACTIVE = 'bg-[#e6f3f6] font-semibold text-[#1f6478]';
const IDLE = 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]';

function Accent({ visible }: { visible: boolean }) {
  return (
    <span
      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#2a7793] transition-opacity duration-200 motion-reduce:transition-none ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
}

/**
 * One row of the navigation tree, rendered from nav-config. A row with an admin
 * `href` is a link to an editor; a row with a `publicHref` opens the existing
 * public page in a new tab; a row with `children` is a group that expands and
 * collapses. A group opens by itself when the current page is inside it, and
 * the user's own open or close choice wins until the page changes section.
 */
function NavRow({
  item,
  depth,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  depth: number;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const containsActive = isItemActive(item, pathname);
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? containsActive;
  const Icon = item.icon;
  const active = item.href ? matchesPath(item.href, pathname) : false;
  const indent = depth > 0 ? 'pl-3 text-[13.5px]' : '';

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setManual(!open)}
          aria-expanded={open}
          aria-label={collapsed ? item.label : undefined}
          className={`${ROW} ${containsActive ? 'font-medium text-[#2a7793]' : IDLE} ${collapsed ? 'justify-center px-0' : ''}`}
        >
          {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" /> : null}
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-[#64748b] transition-transform duration-200 motion-reduce:transition-none ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </>
          ) : null}
        </button>
        {open && !collapsed ? (
          <div className="ml-[22px] mt-0.5 space-y-0.5 border-l border-[#e3e8ee] pb-1">
            {item.children.map((child) => (
              <NavRow
                key={`${child.label}-${child.href ?? child.publicHref ?? ''}`}
                item={child}
                depth={depth + 1}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (item.publicHref) {
    return (
      <a
        href={item.publicHref}
        target="_blank"
        rel="noopener noreferrer"
        title="Buka halaman publik"
        className={`${ROW} ${IDLE} ${indent} ${collapsed ? 'justify-center px-0' : ''}`}
      >
        {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" /> : null}
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#64748b]/60 transition-colors group-hover:text-[#2a7793]" aria-hidden="true" />
          </>
        ) : (
          <span className="sr-only">{item.label}</span>
        )}
      </a>
    );
  }

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`${ROW} ${indent} ${active ? ACTIVE : IDLE} ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <Accent visible={active} />
      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" /> : null}
      {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : <span className="sr-only">{item.label}</span>}
      {collapsed ? (
        <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar({
  role,
  collapsed = false,
  onNavigate,
  onToggleCollapse,
}: {
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="wp-admin" className="flex h-full flex-col bg-white">
      <div
        className={`flex h-16 shrink-0 items-center border-b border-[#e3e8ee] ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <Link href="/wp-admin/dashboard" aria-label="wp-admin" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/brand/environesia-group.png"
            alt=""
            width={collapsed ? 28 : 24}
            height={collapsed ? 28 : 24}
            className={`${collapsed ? 'h-7 w-7' : 'h-6 w-6'} shrink-0 object-contain`}
          />
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-semibold leading-tight text-ink">Environesia</span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[#64748b]">Admin</span>
            </span>
          ) : null}
        </Link>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden shrink-0 rounded-[8px] p-1.5 text-[#64748b] transition-colors hover:bg-[#f4f6f9] hover:text-ink lg:block ${
              collapsed ? 'absolute -right-3 top-14 border border-[#e3e8ee] bg-white' : ''
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div>
          <NavRow item={DASHBOARD_ITEM} depth={0} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
        </div>

        {NAV_SECTIONS.map((section) => {
          const items = visibleItems(section.items, role);
          if (items.length === 0) return null;

          return (
            <div key={section.label}>
              {!collapsed ? (
                <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#64748b]">{section.label}</p>
              ) : (
                <div className="mb-2 h-px bg-line" aria-hidden="true" />
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavRow
                    key={`${item.label}-${item.href ?? item.publicHref ?? ''}`}
                    item={item}
                    depth={0}
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

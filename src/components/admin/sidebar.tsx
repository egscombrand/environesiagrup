'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { Role } from '@/lib/admin/roles';
import { NAV_GROUPS, OVERVIEW_LINK } from './nav-config';

function NavItem({
  href,
  label,
  Icon,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: (typeof NAV_GROUPS)[number]['links'][number]['icon'];
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-small transition-colors ${
        active ? 'bg-stone font-medium text-ink' : 'text-slate hover:bg-stone/60 hover:text-ink'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span
        className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-forest transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {!collapsed ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
      {collapsed ? (
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 font-mono text-label uppercase text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
          {label}
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
    <nav className="flex h-full flex-col bg-paper">
      <div className={`flex h-16 shrink-0 items-center border-b border-line ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {collapsed ? (
          <Link href="/wp-admin/dashboard" aria-label="wp-admin">
            <Image src="/brand/environesia-group.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          </Link>
        ) : (
          <Link href="/wp-admin/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Image src="/brand/environesia-group.png" alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0 object-contain" />
            <span className="truncate font-display text-h3 text-ink">wp-admin</span>
          </Link>
        )}
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden shrink-0 rounded-[8px] p-1.5 text-slate hover:bg-stone hover:text-ink lg:block ${collapsed ? 'absolute -right-3 top-14 bg-paper border border-line' : ''}`}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" /> : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div>
          <NavItem
            href={OVERVIEW_LINK.href}
            label={OVERVIEW_LINK.label}
            Icon={OVERVIEW_LINK.icon}
            active={pathname === OVERVIEW_LINK.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>

        {NAV_GROUPS.map((group) => {
          const visibleLinks = group.links.filter((link) => !link.roles || link.roles.includes(role));
          if (visibleLinks.length === 0) return null;

          return (
            <div key={group.label}>
              {!collapsed ? (
                <p className="px-3 pb-2 font-mono text-label uppercase text-slate">{group.label}</p>
              ) : (
                <div className="mb-2 h-px bg-line" aria-hidden="true" />
              )}
              <div className="space-y-0.5">
                {visibleLinks.map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    Icon={link.icon}
                    active={pathname.startsWith(link.href)}
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

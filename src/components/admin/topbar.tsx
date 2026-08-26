'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { signOutAction } from '@/app/wp-admin/logout-action';
import { ROLE_LABELS, type Role } from '@/lib/admin/roles';
import { useClickOutside } from '@/lib/admin/use-click-outside';
import { NAV_GROUPS, OVERVIEW_LINK } from './nav-config';
import type { ActivityItem } from '@/lib/admin/activity';

function useBreadcrumb(pathname: string) {
  return useMemo(() => {
    if (pathname.startsWith(OVERVIEW_LINK.href)) return { group: 'Overview', label: OVERVIEW_LINK.label };
    for (const group of NAV_GROUPS) {
      const match = group.links.find((link) => pathname.startsWith(link.href));
      if (match) return { group: group.label, label: match.label };
    }
    return { group: 'wp-admin', label: '' };
  }, [pathname]);
}

const ACTION_VERBS: Record<string, string> = {
  create: 'created',
  update: 'updated',
  delete: 'deleted',
  publish: 'published',
  unpublish: 'unpublished',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function SearchMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const allLinks = useMemo(() => [OVERVIEW_LINK, ...NAV_GROUPS.flatMap((g) => g.links)], []);
  const results = useMemo(() => {
    if (!query.trim()) return allLinks.slice(0, 6);
    const q = query.trim().toLowerCase();
    return allLinks.filter((l) => l.label.toLowerCase().includes(q));
  }, [allLinks, query]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search"
        className="flex items-center gap-2 rounded-[10px] border border-line px-3 py-1.5 text-small text-slate hover:border-slate/40"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search…</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-[12px] border border-line bg-paper p-2 shadow-[0_12px_32px_rgba(16,34,28,0.14)]">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to…"
            className="w-full rounded-[8px] border border-line bg-paper px-3 py-2 text-small text-ink outline-none focus:border-forest"
          />
          <div className="mt-2 max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <p className="px-2 py-3 text-small text-slate">No matches.</p>
            ) : (
              results.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[8px] px-2 py-2 text-small text-ink hover:bg-stone"
                >
                  <link.icon className="h-4 w-4 text-slate" aria-hidden="true" />
                  {link.label}
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationsMenu({ activity }: { activity: ActivityItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-[10px] border border-line p-2 text-slate hover:border-slate/40"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {activity.length > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-[12px] border border-line bg-paper p-2 shadow-[0_12px_32px_rgba(16,34,28,0.14)]">
          <p className="px-2 py-1.5 font-mono text-label uppercase text-slate">Recent Activity</p>
          {activity.length === 0 ? (
            <p className="px-2 py-3 text-small text-slate">No recent activity yet.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {activity.map((item) => (
                <div key={item.id} className="rounded-[8px] px-2 py-2 text-small hover:bg-stone">
                  <p className="text-ink">
                    <span className="font-medium">{item.actorName}</span>{' '}
                    {ACTION_VERBS[item.action] ?? item.action} {item.resource.toLowerCase()}
                  </p>
                  <p className="mt-0.5 font-mono text-label uppercase text-slate">{timeAgo(item.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UserMenu({ username, role }: { username: string; role: Role }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-[10px] border border-line py-1.5 pl-1.5 pr-2.5 hover:border-slate/40"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-paper">
          {username.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden text-small text-ink sm:inline">{username}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-[12px] border border-line bg-paper p-2 shadow-[0_12px_32px_rgba(16,34,28,0.14)]">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-small font-medium text-paper">
              {username.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-small font-medium text-ink">{username}</p>
              <p className="font-mono text-label uppercase text-slate">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link href="/wp-admin/dashboard" className="flex items-center gap-2 rounded-[8px] px-2 py-2 text-small text-ink hover:bg-stone">
            <User className="h-4 w-4 text-slate" aria-hidden="true" />
            Dashboard
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left text-small text-danger hover:bg-danger/5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({
  username,
  role,
  activity,
  onOpenMobileNav,
}: {
  username: string;
  role: Role;
  activity: ActivityItem[];
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const breadcrumb = useBreadcrumb(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-paper px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="rounded-[8px] p-1.5 text-ink hover:bg-stone lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate font-mono text-label uppercase text-slate">{breadcrumb.group}</p>
          <p className="truncate font-display text-h3 text-ink">{breadcrumb.label}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <SearchMenu />
        <NotificationsMenu activity={activity} />
        <UserMenu username={username} role={role} />
      </div>
    </header>
  );
}

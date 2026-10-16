'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Role } from '@/lib/admin/roles';
import type { ActivityItem } from '@/lib/admin/activity';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ToastProvider } from './toast-provider';

const COLLAPSE_STORAGE_KEY = 'wp-admin-sidebar-collapsed';

export function AdminShell({
  username,
  role,
  activity,
  children,
}: {
  username: string;
  role: Role;
  activity: ActivityItem[];
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1');
    } catch {
      // localStorage unavailable (private mode, blocked) — default expanded.
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // best-effort only
      }
      return next;
    });
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#f4f7fb]">
        {/* Desktop sidebar */}
        <div
          className={`relative hidden shrink-0 border-r border-[#e3e8ee] transition-[width] duration-200 lg:block ${
            collapsed ? 'w-[76px]' : 'w-[264px]'
          }`}
        >
          <Sidebar role={role} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
        </div>

        {/* Mobile slide-over */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 w-[280px] border-r border-[#e3e8ee] bg-white shadow-xl">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 z-10 rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#f4f6f9]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        {/*
          min-h-0 on both this column and `main` below is load-bearing, not
          decorative: a flex item's default min-height is its own CONTENT
          size ("min-height: auto"), not 0. Without overriding it, a tall
          page (e.g. a long editor form) forces `main` — and this whole
          column — to grow to fit that content instead of clipping it to the
          h-screen box above and scrolling internally. That's what let a
          second, outer (document-level) scrollbar appear once a page's
          content got tall enough to hit it — `main`'s own overflow-y-auto
          never got the chance to do its job, because `main` had already
          grown past the viewport. min-w-0 exists on this element for the
          exact same reason on the horizontal axis.
        */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Topbar username={username} role={role} activity={activity} onOpenMobileNav={() => setMobileOpen(true)} />
          {/*
            h-full here gives every page's root a real, bounded height to
            work with (main's own box, already correctly sized by the
            min-h-0 chain above) — WITHOUT forcing every page to use it. A
            page that renders normal block content (lists, dashboard,
            settings) just ignores it and sizes to its own content as
            before; `overflow-y-auto` on `main` stays as the scroll
            mechanism for those. A page that opts into `h-full flex flex-col`
            on its own root (every editor — see editor-layout.tsx's
            EditorFrame) gets a true, self-contained Header/Content-scroll/
            Footer box instead: ITS OWN content area scrolls internally,
            `main` never needs to, and there is exactly one scrollbar.
          */}
          <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto h-full w-full max-w-[1440px]">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

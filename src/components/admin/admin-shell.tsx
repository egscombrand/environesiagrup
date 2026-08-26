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
      <div className="flex h-screen bg-stone">
        {/* Desktop sidebar */}
        <div
          className={`relative hidden shrink-0 border-r border-line transition-[width] duration-200 lg:block ${
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
            <div className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-paper shadow-xl">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 z-10 rounded-[8px] p-1.5 text-slate hover:bg-stone"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar username={username} role={role} activity={activity} onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

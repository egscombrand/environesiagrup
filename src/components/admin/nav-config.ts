import {
  LayoutDashboard,
  Building2,
  Layers,
  FolderOpen,
  GalleryHorizontal,
  BarChart3,
  FolderKanban,
  Newspaper,
  Users,
  Milestone,
  FileText,
  Briefcase,
  LayoutTemplate,
  Waypoints,
  Settings,
  Image as ImageIcon,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/lib/admin/roles';

export type NavLink = { label: string; href: string; icon: LucideIcon; roles?: Role[] };
export type NavGroup = { label: string; links: NavLink[] };

export const OVERVIEW_LINK: NavLink = { label: 'Dashboard', href: '/wp-admin/dashboard', icon: LayoutDashboard };

// "Content" is ordered to match the homepage top-to-bottom exactly (see
// Website → Homepage Sections for the live, authoritative order and an
// enable/disable/reorder control) — scrolling this list mirrors scrolling
// the actual page, so "which section is this" is never a guess. Jobs and
// (for now, unpublished) Statistics sit at the end since they aren't part
// of that flow — Jobs is its own careers page, not a homepage section.
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content',
    links: [
      { label: 'Hero', href: '/wp-admin/content/hero', icon: GalleryHorizontal },
      { label: 'Entities (Capabilities Grid)', href: '/wp-admin/content/entities', icon: Building2 },
      { label: 'Business Pillars', href: '/wp-admin/content/pillars', icon: Layers },
      { label: 'Projects', href: '/wp-admin/content/projects', icon: FolderKanban },
      { label: 'Milestones (Our Journey)', href: '/wp-admin/content/milestones', icon: Milestone },
      { label: 'Leadership', href: '/wp-admin/content/leadership', icon: Users },
      { label: 'Siaran Pers', href: '/wp-admin/content/siaran-pers', icon: Newspaper },
      { label: 'Documents', href: '/wp-admin/content/documents', icon: FileText },
      { label: 'Statistics (unpublished)', href: '/wp-admin/content/stats', icon: BarChart3 },
      { label: 'Jobs (careers page, not a homepage section)', href: '/wp-admin/content/jobs', icon: Briefcase },
    ],
  },
  {
    label: 'Proyek & Insight',
    links: [{ label: 'Proyek & Insight', href: '/wp-admin/proyek-insight', icon: FolderOpen }],
  },
  {
    label: 'Website',
    links: [
      {
        label: 'Homepage Sections',
        href: '/wp-admin/site/pages',
        icon: LayoutTemplate,
        roles: ['super_admin'],
      },
      { label: 'Navigation', href: '/wp-admin/site/navigation', icon: Waypoints, roles: ['super_admin'] },
      { label: 'Site Settings', href: '/wp-admin/site/settings', icon: Settings, roles: ['super_admin'] },
    ],
  },
  {
    label: 'Media',
    links: [{ label: 'Media Library', href: '/wp-admin/media', icon: ImageIcon }],
  },
  {
    label: 'System',
    links: [{ label: 'Users', href: '/wp-admin/users', icon: UserCog, roles: ['super_admin'] }],
  },
];

import {
  LayoutDashboard,
  Building2,
  Layers,
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
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/lib/admin/roles';

export type NavLink = { label: string; href: string; icon: LucideIcon; roles?: Role[] };
export type NavGroup = { label: string; links: NavLink[] };

export const OVERVIEW_LINK: NavLink = { label: 'Dashboard', href: '/wp-admin/dashboard', icon: LayoutDashboard };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content',
    links: [
      { label: 'Entities', href: '/wp-admin/content/entities', icon: Building2 },
      { label: 'Business Pillars', href: '/wp-admin/content/pillars', icon: Layers },
      { label: 'Hero', href: '/wp-admin/content/hero', icon: GalleryHorizontal },
      { label: 'Statistics', href: '/wp-admin/content/stats', icon: BarChart3 },
      { label: 'Projects', href: '/wp-admin/content/projects', icon: FolderKanban },
      { label: 'News', href: '/wp-admin/content/posts', icon: Newspaper },
      { label: 'Leadership', href: '/wp-admin/content/leadership', icon: Users },
      { label: 'Milestones', href: '/wp-admin/content/milestones', icon: Milestone },
      { label: 'Documents', href: '/wp-admin/content/documents', icon: FileText },
      { label: 'Jobs', href: '/wp-admin/content/jobs', icon: Briefcase },
    ],
  },
  {
    label: 'Website',
    links: [
      {
        label: 'Environesia Group Experience',
        href: '/wp-admin/site/group-experience',
        icon: Sparkles,
        roles: ['super_admin', 'editor'],
      },
      { label: 'Pages', href: '/wp-admin/site/pages', icon: LayoutTemplate, roles: ['super_admin'] },
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

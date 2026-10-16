import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  FolderKanban,
  House,
  Layers,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
  Waypoints,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/lib/admin/roles';

/**
 * The wp-admin navigation, as one tree. It mirrors the public website's own
 * structure, so the admin reads the way the site is organised: Website → Tentang
 * Kami, Proyek & Insight, Tata Kelola & Keberlanjutan, and so on.
 *
 * An item with an `href` opens an existing editor. An item with a `publicHref`
 * opens the matching public page in a new tab, for a section that has no admin
 * editor yet. An item with `children` is a group that expands in the sidebar.
 * No route is invented: every target already exists.
 */
export type NavItem = {
  label: string;
  /** An admin editor inside wp-admin. */
  href?: string;
  /**
   * An existing public page for a section that has no admin editor. Opens in a
   * new tab. Points only at routes that exist in the app.
   */
  publicHref?: string;
  icon?: LucideIcon;
  roles?: Role[];
  children?: NavItem[];
};

export type NavSection = { label: string; items: NavItem[] };

export const DASHBOARD_ITEM: NavItem = { label: 'Dashboard', href: '/wp-admin/dashboard', icon: LayoutDashboard };

const GOVERNANCE_AREAS = [
  'Tata Kelola',
  'Kode Etik',
  'Kebijakan & Kepatuhan',
  'Manajemen Risiko',
  'Nilai & Budaya',
  'Keberlanjutan',
  'Inisiatif & Dampak',
];

const GOVERNANCE_SLUGS = [
  'tata-kelola',
  'kode-etik',
  'kebijakan',
  'manajemen-risiko',
  'nilai-budaya',
  'keberlanjutan',
  'dampak',
];

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Website',
    items: [
      {
        label: 'Homepage',
        href: '/wp-admin/site/pages',
        icon: House,
        roles: ['super_admin'],
        children: [
          { label: 'Hero', href: '/wp-admin/content/hero' },
          { label: 'Statistik', href: '/wp-admin/content/stats' },
        ],
      },
      {
        label: 'Tentang Kami',
        icon: Building2,
        children: [
          { label: 'Overview', href: '/wp-admin/content/narasi/tentang-kami' },
          { label: 'Makna Logo', href: '/wp-admin/content/narasi/makna-logo' },
          {
            label: 'Visi, Misi & Tata Nilai',
            children: [
              { label: 'Visi & Misi', href: '/wp-admin/content/narasi/visi-misi' },
              { label: 'Komitmen', href: '/wp-admin/content/narasi/komitmen' },
            ],
          },
          {
            label: 'Sejarah',
            children: [
              { label: 'Narasi & Foto', href: '/wp-admin/content/narasi/sejarah' },
              { label: 'Intro Rekam Jejak', href: '/wp-admin/content/narasi/perjalanan-timeline' },
              { label: 'Milestone', href: '/wp-admin/content/milestones' },
            ],
          },
          { label: 'Struktur Organisasi', href: '/wp-admin/content/narasi/struktur-organisasi' },
          {
            label: 'Direktur Utama & Dewan Direksi',
            children: [
              { label: 'Orang & Profil', href: '/wp-admin/content/leadership' },
              { label: 'Judul Bagian', href: '/wp-admin/content/narasi/direktur' },
            ],
          },
          { label: 'Penghargaan', href: '/wp-admin/content/narasi/penghargaan' },
          { label: 'Entitas & Kapabilitas', href: '/wp-admin/content/entities' },
          {
            label: 'Legalitas & Sertifikasi',
            children: [
              { label: 'Judul & Catatan', href: '/wp-admin/content/narasi/legalitas' },
              { label: 'Entitas & Dokumen', href: '/wp-admin/content/legal' },
            ],
          },
          { label: 'Dokumen Perusahaan', href: '/wp-admin/content/documents' },
          // Not one of the seven Front End tabs, and not connected to any public
          // page yet (see the Tentang Kami migration notes). Kept last, pending a
          // decision on whether it gets its own page or is retired.
          { label: 'Profil Perusahaan', href: '/wp-admin/content/narasi/profil-perusahaan' },
        ],
      },
      {
        label: 'Bisnis & Ekosistem',
        icon: Layers,
        children: [
          { label: 'Hero Halaman', href: '/wp-admin/content/narasi/bisnis-layanan-hero' },
          { label: 'Ekosistem Hijau', href: '/wp-admin/content/narasi/bisnis-layanan-ekosistem' },
          { label: 'Pilar Bisnis', href: '/wp-admin/content/pillars' },
        ],
      },
      { label: 'Layanan', href: '/wp-admin/content/narasi/layanan', icon: BriefcaseBusiness },
      {
        label: 'Proyek & Insight',
        icon: FolderKanban,
        children: [
          { label: 'Portofolio Proyek', href: '/wp-admin/content/projects' },
          { label: 'Klien & Mitra', href: '/wp-admin/content/clients' },
          { label: 'Berita Perusahaan', href: '/wp-admin/content/berita-perusahaan' },
          { label: 'Siaran Pers', href: '/wp-admin/content/siaran-pers' },
          { label: 'Pengaturan Halaman', href: '/wp-admin/proyek-insight' },
        ],
      },
      {
        label: 'Tata Kelola & Keberlanjutan',
        icon: ShieldCheck,
        children: [
          // The shared hero and the seven pillars come first, then the seven areas.
          { label: 'Hero Halaman', href: '/wp-admin/content/narasi/tata-kelola-keberlanjutan' },
          { label: 'Tujuh Pilar', href: '/wp-admin/content/narasi/tata-kelola-kerangka' },
          ...GOVERNANCE_AREAS.map((label, i) => ({ label, href: `/wp-admin/content/narasi/${GOVERNANCE_SLUGS[i]}` })),
        ],
      },
      { label: 'Karier', href: '/wp-admin/content/jobs', icon: Briefcase },
      { label: 'Navigasi Website', href: '/wp-admin/site/navigation', icon: Waypoints, roles: ['super_admin'] },
      { label: 'Pengaturan Website', href: '/wp-admin/site/settings', icon: Settings, roles: ['super_admin'] },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Users', href: '/wp-admin/users', icon: UserCog, roles: ['super_admin'] }],
  },
];

/** A route matches when it is the path itself or a sub-path of it. */
export function matchesPath(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Whether an item, or anything below it, is the page the user is on. */
export function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href && matchesPath(item.href, pathname)) return true;
  return (item.children ?? []).some((child) => isItemActive(child, pathname));
}

/** Filters out items the role may not see, at every level. */
export function visibleItems(items: NavItem[], role: Role): NavItem[] {
  return items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) => (item.children ? { ...item, children: visibleItems(item.children, role) } : item));
}

/** Every item that can be opened, flattened — used by the search box. */
export function openableItems(items: NavItem[]): (NavItem & { href: string })[] {
  return items.flatMap((item) => [
    ...(item.href ? [{ ...item, href: item.href }] : []),
    ...(item.publicHref ? [{ ...item, href: item.publicHref }] : []),
    ...openableItems(item.children ?? []),
  ]);
}

/**
 * The breadcrumb trail for a path: the section, each group above the page, and
 * the page itself. Uses the longest matching route, so a sub-route like an
 * import page still resolves to its parent editor.
 */
export function breadcrumbTrail(pathname: string): string[] {
  const candidates: { trail: string[]; href: string }[] = [];

  function walk(items: NavItem[], ancestors: string[]) {
    for (const item of items) {
      const trail = [...ancestors, item.label];
      if (item.href) candidates.push({ trail, href: item.href });
      if (item.children) walk(item.children, trail);
    }
  }

  walk([DASHBOARD_ITEM], []);
  for (const section of NAV_SECTIONS) walk(section.items, [section.label]);

  const best = candidates
    .filter((c) => matchesPath(c.href, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return best ? best.trail : ['wp-admin'];
}

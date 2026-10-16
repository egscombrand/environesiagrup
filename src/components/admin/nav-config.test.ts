import { describe, expect, it } from 'vitest';
import {
  NAV_SECTIONS,
  breadcrumbTrail,
  isItemActive,
  visibleItems,
  type NavItem,
} from './nav-config';

describe('breadcrumbTrail', () => {
  it('places an editor under its section and group', () => {
    expect(breadcrumbTrail('/wp-admin/content/milestones')).toEqual(['Website', 'Tentang Kami', 'Sejarah', 'Milestone']);
    expect(breadcrumbTrail('/wp-admin/content/siaran-pers')).toEqual(['Website', 'Proyek & Insight', 'Siaran Pers']);
  });

  it('resolves a sub-route to its parent editor, not to the section', () => {
    expect(breadcrumbTrail('/wp-admin/content/siaran-pers/import')).toEqual([
      'Website',
      'Proyek & Insight',
      'Siaran Pers',
    ]);
    expect(breadcrumbTrail('/wp-admin/content/berita-perusahaan/import')).toEqual([
      'Website',
      'Proyek & Insight',
      'Berita Perusahaan',
    ]);
  });

  it('does not match a prefix that is only a partial segment', () => {
    // /content/projects must not swallow /content/projects-archive.
    expect(breadcrumbTrail('/wp-admin/content/projects-archive')).toEqual(['wp-admin']);
  });

  it('shows the dashboard for the dashboard route', () => {
    expect(breadcrumbTrail('/wp-admin/dashboard')).toEqual(['Dashboard']);
  });
});

describe('isItemActive', () => {
  const tentang = NAV_SECTIONS[0].items.find((i) => i.label === 'Tentang Kami') as NavItem;

  it('is active for a group when a child is the current page', () => {
    expect(isItemActive(tentang, '/wp-admin/content/leadership')).toBe(true);
  });

  it('is not active for a group when the page is elsewhere', () => {
    expect(isItemActive(tentang, '/wp-admin/content/siaran-pers')).toBe(false);
  });
});

describe('visibleItems', () => {
  const all = NAV_SECTIONS.flatMap((s) => s.items);

  it('hides super-admin-only items from an editor, at every level', () => {
    const editor = visibleItems(all, 'author');
    const labels = editor.map((i) => i.label);
    expect(labels).not.toContain('Homepage');
    expect(labels).not.toContain('Navigasi Website');
    expect(labels).not.toContain('Pengaturan Website');
    expect(labels).not.toContain('Users');
  });

  it('keeps everything for a super admin', () => {
    expect(visibleItems(all, 'super_admin').map((i) => i.label)).toContain('Homepage');
  });
});

describe('the tree', () => {
  it('mirrors the website sections the user asked for, in order', () => {
    const website = NAV_SECTIONS[0].items.map((i) => i.label);
    expect(website).toEqual([
      'Homepage',
      'Tentang Kami',
      'Bisnis & Ekosistem',
      'Layanan',
      'Proyek & Insight',
      'Tata Kelola & Keberlanjutan',
      'Karier',
      'Navigasi Website',
      'Pengaturan Website',
    ]);
    const tentang = NAV_SECTIONS[0].items.find((i) => i.label === 'Tentang Kami');
    expect(tentang?.children?.map((c) => c.label)).toEqual([
      'Overview',
      'Makna Logo',
      'Visi, Misi & Tata Nilai',
      'Sejarah',
      'Struktur Organisasi',
      'Direktur Utama & Dewan Direksi',
      'Penghargaan',
      'Entitas & Kapabilitas',
      'Legalitas & Sertifikasi',
      'Dokumen Perusahaan',
      'Profil Perusahaan',
    ]);
    const governance = NAV_SECTIONS[0].items.find((i) => i.label === 'Tata Kelola & Keberlanjutan');
    expect(governance?.children?.map((c) => c.label)).toEqual([
      'Hero Halaman',
      'Tujuh Pilar',
      'Tata Kelola',
      'Kode Etik',
      'Kebijakan & Kepatuhan',
      'Manajemen Risiko',
      'Nilai & Budaya',
      'Keberlanjutan',
      'Inisiatif & Dampak',
    ]);
  });

  it('gives every item a real target, and every admin route is unique', () => {
    const leaves: NavItem[] = [];
    const walk = (items: NavItem[]) =>
      items.forEach((i) => {
        if (i.children) walk(i.children);
        else leaves.push(i);
      });
    NAV_SECTIONS.forEach((s) => walk(s.items));
    expect(leaves.every((i) => i.href || i.publicHref)).toBe(true);

    // Admin editors only: a public link may legitimately share a page with another item.
    const adminHrefs: string[] = [];
    const collectAdmin = (items: NavItem[]) =>
      items.forEach((i) => {
        if (i.href) adminHrefs.push(i.href);
        if (i.children) collectAdmin(i.children);
      });
    NAV_SECTIONS.forEach((s) => collectAdmin(s.items));
    expect(new Set(adminHrefs).size).toBe(adminHrefs.length);
    expect(adminHrefs.every((h) => h.startsWith('/wp-admin/'))).toBe(true);
  });

  it('keeps every admin menu item inside wp-admin, with no public-site links', () => {
    // Every section now has an admin editor, so the sidebar never opens a page on the public site.
    const publicLinks: string[] = [];
    const collect = (items: NavItem[]) =>
      items.forEach((i) => {
        if (i.publicHref) publicLinks.push(i.publicHref);
        if (i.children) collect(i.children);
      });
    NAV_SECTIONS.forEach((s) => collect(s.items));
    expect(publicLinks).toEqual([]);
  });
});

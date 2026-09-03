import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavigationList } from './navigation-list';
import { ToastProvider } from './toast-provider';
import type { NavigationNode } from '@/lib/cms/navigation';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/app/wp-admin/(protected)/site/navigation/actions', () => ({
  reorderNavigationAction: vi.fn().mockResolvedValue({}),
  reparentNavigationAction: vi.fn().mockResolvedValue({}),
  deleteNavigationAction: vi.fn().mockResolvedValue({}),
}));

function makeNode(overrides: Partial<NavigationNode> & Pick<NavigationNode, 'id' | 'label'>): NavigationNode {
  return {
    label_en: null,
    label_zh: null,
    url: '/',
    menu: 'header',
    parent_id: null,
    slug: null,
    sort_order: 0,
    status: 'published',
    open_new_tab: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    children: [],
    ...overrides,
  };
}

function renderList(roots: NavigationNode[]) {
  return render(
    <ToastProvider>
      <NavigationList menu="header" roots={roots} />
    </ToastProvider>
  );
}

describe('NavigationList', () => {
  it('renders a parent row immediately followed by its own children', () => {
    const parent = makeNode({
      id: 'parent-1',
      label: 'Tentang Kami',
      children: [
        makeNode({ id: 'child-1', label: 'Sejarah', parent_id: 'parent-1' }),
        makeNode({ id: 'child-2', label: 'Visi & Misi', parent_id: 'parent-1' }),
      ],
    });
    const top = makeNode({ id: 'top-1', label: 'Beranda' });

    renderList([top, parent]);

    const labels = screen.getAllByText(/^(Tentang Kami|Sejarah|Visi & Misi|Beranda)$/).map((el) => el.textContent);
    expect(labels).toEqual(['Beranda', 'Tentang Kami', 'Sejarah', 'Visi & Misi']);
  });

  it('shows "Add Submenu" only for top-level items, not for their children', () => {
    const parent = makeNode({
      id: 'parent-1',
      label: 'Tentang Kami',
      children: [makeNode({ id: 'child-1', label: 'Sejarah', parent_id: 'parent-1' })],
    });

    renderList([parent]);

    expect(screen.getByLabelText('Add submenu under Tentang Kami')).toBeInTheDocument();
    expect(screen.queryByLabelText('Add submenu under Sejarah')).not.toBeInTheDocument();
  });

  it('links "Add Submenu" to the new-item form pre-filled with the parent', () => {
    const parent = makeNode({ id: 'parent-1', label: 'Tentang Kami', menu: 'header' });

    renderList([parent]);

    expect(screen.getByLabelText('Add submenu under Tentang Kami')).toHaveAttribute(
      'href',
      '/wp-admin/site/navigation/new?menu=header&parent_id=parent-1'
    );
  });
});

import { describe, expect, it } from 'vitest';
import { navigationLabel, buildTree } from './navigation';

type Row = Parameters<typeof buildTree>[0][number];

function makeRow(overrides: Partial<Row> & Pick<Row, 'id' | 'label'>): Row {
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
    ...overrides,
  };
}

const node = {
  label: 'Entitas',
  label_en: 'Entities',
  label_zh: '旗下企业',
} as Parameters<typeof navigationLabel>[0];

describe('navigationLabel', () => {
  it('returns the label for the requested locale', () => {
    expect(navigationLabel(node, 'id')).toBe('Entitas');
    expect(navigationLabel(node, 'en')).toBe('Entities');
    expect(navigationLabel(node, 'zh')).toBe('旗下企业');
  });

  it('falls back to Indonesian when a translation is missing', () => {
    const untranslated = { label: 'Karier', label_en: null, label_zh: null } as typeof node;
    expect(navigationLabel(untranslated, 'zh')).toBe('Karier');
  });

  it('falls back to Indonesian for an unknown locale', () => {
    expect(navigationLabel(node, 'pt')).toBe('Entitas');
  });
});

describe('buildTree', () => {
  it('groups children under their true parent regardless of interleaving in the input order', () => {
    const rows = [
      makeRow({ id: 'child-1', label: 'Sejarah', parent_id: 'parent-1', sort_order: 0 }),
      makeRow({ id: 'top-1', label: 'Beranda', sort_order: 1 }),
      makeRow({ id: 'parent-1', label: 'Tentang Kami', sort_order: 2 }),
      makeRow({ id: 'child-2', label: 'Visi & Misi', parent_id: 'parent-1', sort_order: 3 }),
    ];

    const tree = buildTree(rows);

    expect(tree.map((node) => node.id)).toEqual(['top-1', 'parent-1']);
    const parent = tree.find((node) => node.id === 'parent-1')!;
    expect(parent.children.map((child) => child.id)).toEqual(['child-1', 'child-2']);
  });

  it('preserves each child group’s relative sort_order', () => {
    const rows = [
      makeRow({ id: 'parent-1', label: 'Tentang Kami' }),
      makeRow({ id: 'child-b', label: 'B', parent_id: 'parent-1', sort_order: 2 }),
      makeRow({ id: 'child-a', label: 'A', parent_id: 'parent-1', sort_order: 1 }),
    ];

    const tree = buildTree(rows);
    const parent = tree.find((node) => node.id === 'parent-1')!;
    expect(parent.children.map((child) => child.id)).toEqual(['child-b', 'child-a']);
  });

  it('treats a row whose parent is missing from the input as a root', () => {
    const rows = [makeRow({ id: 'orphan', label: 'Orphan', parent_id: 'does-not-exist' })];
    const tree = buildTree(rows);
    expect(tree.map((node) => node.id)).toEqual(['orphan']);
  });

  it('nests a grandchild (parent_id pointing at another child) rather than dropping it', () => {
    const rows = [
      makeRow({ id: 'top', label: 'Top' }),
      makeRow({ id: 'mid', label: 'Mid', parent_id: 'top' }),
      makeRow({ id: 'deep', label: 'Deep', parent_id: 'mid' }),
    ];

    const tree = buildTree(rows);
    expect(tree.map((node) => node.id)).toEqual(['top']);
    expect(tree[0].children.map((child) => child.id)).toEqual(['mid']);
    expect(tree[0].children[0].children.map((child) => child.id)).toEqual(['deep']);
  });
});

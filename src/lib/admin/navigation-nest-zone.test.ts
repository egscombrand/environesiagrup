import { describe, expect, it } from 'vitest';
import { isInNestZone, canNestDrop } from './navigation-nest-zone';

describe('isInNestZone', () => {
  const overRect = { top: 100, height: 40 };

  it('is true when the dragged item is centered over the target', () => {
    expect(isInNestZone({ top: 118, height: 4 }, overRect)).toBe(true);
  });

  it('is false near the top edge of the target (reorder-before zone)', () => {
    expect(isInNestZone({ top: 100, height: 4 }, overRect)).toBe(false);
  });

  it('is false near the bottom edge of the target (reorder-after zone)', () => {
    expect(isInNestZone({ top: 136, height: 4 }, overRect)).toBe(false);
  });
});

describe('canNestDrop', () => {
  const base = { activeId: 'a', overId: 'b', activeGroupKey: 'root', overGroupKey: 'root', activeHasChildren: false };

  it('allows a top-level item without children dropped onto another top-level item', () => {
    expect(canNestDrop(base)).toBe(true);
  });

  it('rejects dropping an item onto itself', () => {
    expect(canNestDrop({ ...base, overId: 'a' })).toBe(false);
  });

  it('rejects nesting a child item (not top-level)', () => {
    expect(canNestDrop({ ...base, activeGroupKey: 'some-parent' })).toBe(false);
  });

  it('rejects dropping onto a child item (not top-level)', () => {
    expect(canNestDrop({ ...base, overGroupKey: 'some-parent' })).toBe(false);
  });

  it('rejects nesting an item that already has its own submenu', () => {
    expect(canNestDrop({ ...base, activeHasChildren: true })).toBe(false);
  });
});

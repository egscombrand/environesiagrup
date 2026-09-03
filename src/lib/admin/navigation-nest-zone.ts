type Rect = { top: number; height: number };

/**
 * Splits a sortable row's drop target into vertical bands: the middle ~50%
 * means "nest under this item", the outer ~25% bands on either side mean
 * "reorder" (insert before/after). Determined from the dragged item's
 * current center Y relative to the target row's rect.
 */
export function isInNestZone(activeRect: Rect, overRect: Rect): boolean {
  const activeCenterY = activeRect.top + activeRect.height / 2;
  const relative = (activeCenterY - overRect.top) / overRect.height;
  return relative > 0.25 && relative < 0.75;
}

/**
 * True when the drop, position aside, is even eligible to mean "nest":
 * dragging one top-level item onto a different top-level item, where the
 * dragged item has no submenu of its own yet — matches the 2-level cap
 * enforced elsewhere (a nested item can't itself become a parent).
 */
export function canNestDrop(params: {
  activeId: string;
  overId: string;
  activeGroupKey: string;
  overGroupKey: string;
  activeHasChildren: boolean;
}): boolean {
  const { activeId, overId, activeGroupKey, overGroupKey, activeHasChildren } = params;
  if (activeId === overId) return false;
  if (activeGroupKey !== 'root' || overGroupKey !== 'root') return false;
  if (activeHasChildren) return false;
  return true;
}

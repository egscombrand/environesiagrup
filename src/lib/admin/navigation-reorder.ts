/**
 * True when `orderedIds` is exactly a permutation of `existingIds` — no
 * missing, duplicate, or foreign ids. reorderNavigationAction uses this to
 * reject a stale/foreign id list before writing anything, since it's the
 * only thing standing between a scoped reorder and silently overwriting
 * sort_order for rows the caller was never shown.
 */
export function validateReorderScope(existingIds: string[], orderedIds: string[]): boolean {
  if (existingIds.length !== orderedIds.length) return false;

  const existingSet = new Set(existingIds);
  const seen = new Set<string>();
  for (const id of orderedIds) {
    if (!existingSet.has(id) || seen.has(id)) return false;
    seen.add(id);
  }
  return true;
}

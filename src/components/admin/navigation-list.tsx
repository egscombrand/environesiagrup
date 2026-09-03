'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { NavigationSortableRow } from './navigation-sortable-row';
import { reorderNavigationAction, reparentNavigationAction } from '@/app/wp-admin/(protected)/site/navigation/actions';
import { useToast } from './toast-provider';
import { isInNestZone, canNestDrop } from '@/lib/admin/navigation-nest-zone';
import type { NavigationNode } from '@/lib/cms/navigation';

const ROOT = 'root';

type Tree = {
  nodesById: Record<string, NavigationNode>;
  // groupKey -> ordered child ids. Top-level items live under ROOT; a
  // parent's own children (if any) live under that parent's id.
  groups: Record<string, string[]>;
};

function flatten(roots: NavigationNode[]): Tree {
  const nodesById: Record<string, NavigationNode> = {};
  const groups: Record<string, string[]> = { [ROOT]: [] };

  function walk(nodes: NavigationNode[], groupKey: string) {
    groups[groupKey] = nodes.map((node) => node.id);
    for (const node of nodes) {
      nodesById[node.id] = node;
      if (node.children.length > 0) walk(node.children, node.id);
    }
  }
  walk(roots, ROOT);
  return { nodesById, groups };
}

function groupKeyOf(groups: Record<string, string[]>, id: string): string {
  for (const [key, ids] of Object.entries(groups)) {
    if (ids.includes(id)) return key;
  }
  return ROOT;
}

// Reordering (drop near the top/bottom of a row) and nesting (drop onto the
// middle of a row) share one gesture — see navigation-nest-zone.ts for the
// pure zone/eligibility logic this just wires up to the live drag event.
function isNestDrop(activeId: string, overId: string, tree: Tree, event: DragOverEvent | DragEndEvent): boolean {
  if (
    !canNestDrop({
      activeId,
      overId,
      activeGroupKey: groupKeyOf(tree.groups, activeId),
      overGroupKey: groupKeyOf(tree.groups, overId),
      activeHasChildren: (tree.groups[activeId]?.length ?? 0) > 0,
    })
  ) {
    return false;
  }

  const activeRect = event.active.rect.current.translated ?? event.active.rect.current.initial;
  const overRect = event.over?.rect;
  if (!activeRect || !overRect) return false;

  return isInNestZone(activeRect, overRect);
}

function GroupRows({
  groupKey,
  tree,
  nestTargetId,
}: {
  groupKey: string;
  tree: Tree;
  nestTargetId: string | null;
}) {
  const ids = tree.groups[groupKey] ?? [];

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div className={groupKey === ROOT ? 'space-y-2' : 'ml-8 mt-2 space-y-2 border-l border-line pl-4'}>
        {ids.map((id) => (
          <div key={id}>
            <NavigationSortableRow item={tree.nodesById[id]} highlighted={nestTargetId === id} />
            {tree.groups[id]?.length ? <GroupRows groupKey={id} tree={tree} nestTargetId={nestTargetId} /> : null}
          </div>
        ))}
      </div>
    </SortableContext>
  );
}

export function NavigationList({ menu, roots }: { menu: 'header' | 'footer'; roots: NavigationNode[] }) {
  const [tree, setTree] = useState<Tree>(() => flatten(roots));
  const [nestTargetId, setNestTargetId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setTree(flatten(roots));
  }, [roots]);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      setNestTargetId(null);
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);
    setNestTargetId(isNestDrop(activeId, overId, tree, event) ? overId : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const wasNestDrop = nestTargetId !== null;
    setNestTargetId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    if (wasNestDrop && isNestDrop(activeId, overId, tree, event)) {
      const activeNode = tree.nodesById[activeId];
      const targetNode = tree.nodesById[overId];
      const previous = tree;

      setTree((prev) => {
        const nextGroups = { ...prev.groups };
        nextGroups[ROOT] = nextGroups[ROOT].filter((id) => id !== activeId);
        nextGroups[overId] = [...(nextGroups[overId] ?? []), activeId];
        return {
          nodesById: { ...prev.nodesById, [activeId]: { ...activeNode, parent_id: overId } },
          groups: nextGroups,
        };
      });

      startTransition(async () => {
        const result = await reparentNavigationAction(menu, activeId, overId);
        if (result?.error) {
          toast('error', result.error);
          setTree(previous);
          return;
        }
        toast('success', `"${activeNode.label}" is now a submenu of "${targetNode.label}".`);
        router.refresh();
      });
      return;
    }

    const groupKey = groupKeyOf(tree.groups, activeId);
    if (groupKeyOf(tree.groups, overId) !== groupKey) return;

    const ids = tree.groups[groupKey];
    const oldIndex = ids.indexOf(activeId);
    const newIndex = ids.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = tree;
    const nextIds = arrayMove(ids, oldIndex, newIndex);
    setTree((prev) => ({ ...prev, groups: { ...prev.groups, [groupKey]: nextIds } }));

    startTransition(async () => {
      const result = await reorderNavigationAction(menu, groupKey === ROOT ? null : groupKey, nextIds);
      if (result?.error) {
        toast('error', result.error);
        setTree(previous);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-[14px] border border-line bg-paper p-3">
      <div className="mb-2 grid grid-cols-[1fr_1fr_120px_140px] gap-4 px-3">
        <span className="font-mono text-label uppercase text-slate">Label</span>
        <span className="font-mono text-label uppercase text-slate">URL</span>
        <span className="font-mono text-label uppercase text-slate">Status</span>
        <span />
      </div>
      <DndContext
        id={`nav-${menu}`}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <GroupRows groupKey={ROOT} tree={tree} nestTargetId={nestTargetId} />
      </DndContext>
    </div>
  );
}

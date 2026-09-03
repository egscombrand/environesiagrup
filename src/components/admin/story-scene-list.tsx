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
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { StorySceneSortableRow } from './story-scene-sortable-row';
import { reorderStorySceneAction } from '@/app/wp-admin/(protected)/content/entities/[id]/story/actions';
import { useToast } from './toast-provider';
import type { StoryScene } from '@/lib/cms/story-scenes';

// A flat drag-reorder list — scenes have no nesting, so this is the
// navigation menu's DndContext + single SortableContext + useSortable row
// pattern (src/components/admin/navigation-list.tsx) with the nest-zone
// machinery dropped entirely, since it doesn't apply here.
export function StorySceneList({ entityId, scenes }: { entityId: string; scenes: StoryScene[] }) {
  const [ids, setIds] = useState(() => scenes.map((scene) => scene.id));
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setIds(scenes.map((scene) => scene.id));
  }, [scenes]);

  const scenesById = new Map(scenes.map((scene) => [scene.id, scene]));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = ids.indexOf(activeId);
    const newIndex = ids.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const previous = ids;
    const nextIds = arrayMove(ids, oldIndex, newIndex);
    setIds(nextIds);

    startTransition(async () => {
      const result = await reorderStorySceneAction(entityId, nextIds);
      if (result?.error) {
        toast('error', result.error);
        setIds(previous);
        return;
      }
      router.refresh();
    });
  }

  if (ids.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-line bg-paper p-3">
      <div className="mb-2 grid grid-cols-[1fr_120px_140px] gap-4 px-3">
        <span className="font-mono text-label uppercase text-slate">Headline</span>
        <span className="font-mono text-label uppercase text-slate">Status</span>
        <span />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {ids.map((id, index) => {
              const scene = scenesById.get(id);
              return scene ? (
                <StorySceneSortableRow key={id} entityId={entityId} scene={scene} position={index + 1} />
              ) : null;
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

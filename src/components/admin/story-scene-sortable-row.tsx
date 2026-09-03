'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, PenLine } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { DeleteButton } from './delete-button';
import { deleteStorySceneAction } from '@/app/wp-admin/(protected)/content/entities/[id]/story/actions';
import type { StoryScene } from '@/lib/cms/story-scenes';

export function StorySceneSortableRow({
  entityId,
  scene,
  position,
}: {
  entityId: string;
  scene: StoryScene;
  position: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const label = scene.headline || `Scene ${position}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[1fr_120px_140px] items-center gap-4 rounded-[10px] border border-line bg-paper px-3 py-2.5 ${
        isDragging ? 'z-10 shadow-md' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${label}`}
          className="cursor-grab touch-none rounded-[6px] p-1 text-slate hover:bg-stone hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="text-ink">{label}</span>
      </div>
      <StatusBadge status={scene.status} />
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/wp-admin/content/entities/${entityId}/story/${scene.id}`}
          aria-label={`Edit ${label}`}
          title="Edit"
          className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </Link>
        <DeleteButton action={deleteStorySceneAction.bind(null, entityId, scene.id)} itemLabel={label} iconOnly />
      </div>
    </div>
  );
}

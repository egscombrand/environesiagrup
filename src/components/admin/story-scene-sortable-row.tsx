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

  const label = scene.headline || `Foto ${position}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[48px_1fr_120px_140px] items-center gap-4 rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 ${
        isDragging ? 'z-10 shadow-md' : ''
      }`}
    >
      {scene.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase Storage URL, not statically known
        <img src={scene.imageUrl} alt="" className="h-9 w-9 rounded-[6px] object-cover" />
      ) : (
        <div className="h-9 w-9 rounded-[6px] bg-[#f4f6f9]" aria-hidden="true" />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${label}`}
          className="cursor-grab touch-none rounded-[6px] p-1 text-[#64748b] hover:bg-[#f4f6f9] hover:text-ink active:cursor-grabbing"
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
          className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#2a7793]/10 hover:text-[#2a7793]"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </Link>
        <DeleteButton action={deleteStorySceneAction.bind(null, entityId, scene.id)} itemLabel={label} iconOnly />
      </div>
    </div>
  );
}

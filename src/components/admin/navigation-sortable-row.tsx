'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, PenLine } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { DeleteButton } from './delete-button';
import { deleteNavigationAction } from '@/app/wp-admin/(protected)/site/navigation/actions';
import type { NavigationNode } from '@/lib/cms/navigation';

export function NavigationSortableRow({ item, highlighted = false }: { item: NavigationNode; highlighted?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[1fr_1fr_120px_140px] items-center gap-4 rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 ${
        isDragging ? 'z-10 shadow-md' : ''
      } ${highlighted ? 'ring-2 ring-[#2a7793] bg-[#2a7793]/5' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${item.label}`}
          className="cursor-grab touch-none rounded-[6px] p-1 text-[#64748b] hover:bg-[#f4f6f9] hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="text-ink">{item.label}</span>
      </div>
      <span className="truncate text-[#64748b]">{item.url}</span>
      <StatusBadge status={item.status} />
      <div className="flex items-center justify-end gap-1">
        {item.parent_id === null ? (
          <Link
            href={`/wp-admin/site/navigation/new?menu=${item.menu}&parent_id=${item.id}`}
            aria-label={`Add submenu under ${item.label}`}
            title="Add Submenu"
            className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#2a7793]/10 hover:text-[#2a7793]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
        <Link
          href={`/wp-admin/site/navigation/${item.id}`}
          aria-label={`Edit ${item.label}`}
          title="Edit"
          className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#2a7793]/10 hover:text-[#2a7793]"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </Link>
        <DeleteButton action={deleteNavigationAction.bind(null, item.id)} itemLabel={item.label} iconOnly />
      </div>
    </div>
  );
}

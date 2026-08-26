'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronUp, ChevronDown, PenLine } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { DeleteButton } from './delete-button';
import { deleteNavigationAction, moveNavigationAction } from '@/app/wp-admin/(protected)/site/navigation/actions';

export function NavigationRow({
  item,
  isFirst,
  isLast,
}: {
  item: { id: string; label: string; url: string; status: string; menu: string; parent_id: string | null };
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function move(direction: 'up' | 'down') {
    startTransition(async () => {
      await moveNavigationAction(item.id, direction, item.menu);
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-line last:border-0 hover:bg-stone/40">
      <td className="px-4 py-3">
        <span className={item.parent_id ? 'pl-4 text-slate' : 'text-ink'}>{item.parent_id ? '— ' : ''}{item.label}</span>
      </td>
      <td className="px-4 py-3 text-slate">{item.url}</td>
      <td className="px-4 py-3">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => move('up')}
            aria-label="Move up"
            className="rounded-[8px] p-1.5 text-slate hover:bg-stone hover:text-ink disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => move('down')}
            aria-label="Move down"
            className="rounded-[8px] p-1.5 text-slate hover:bg-stone hover:text-ink disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <Link
            href={`/wp-admin/site/navigation/${item.id}`}
            aria-label={`Edit ${item.label}`}
            title="Edit"
            className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest"
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
          </Link>
          <DeleteButton action={deleteNavigationAction.bind(null, item.id)} itemLabel={item.label} iconOnly />
        </div>
      </td>
    </tr>
  );
}

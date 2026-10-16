'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from './confirm-dialog';
import { useToast } from './toast-provider';

export function DeleteButton({
  action,
  label,
  itemLabel,
  successMessage = 'Berhasil dihapus.',
  iconOnly = false,
}: {
  action: () => Promise<{ error?: string } | void>;
  label?: string;
  /** Name of the specific item being deleted, e.g. the row's title — used only for the icon's own aria-label, not shown in the confirm dialog. */
  itemLabel: string;
  successMessage?: string;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        toast('error', result.error);
        setOpen(false);
        return;
      }
      toast('success', successMessage);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          // This button is sometimes placed inside a clickable row/card
          // that opens its own detail view on click (e.g. a table row) —
          // without this, that ambient click handler would also fire,
          // opening that view instead of (or right under) this confirm
          // dialog. ConfirmDialog's own AdminModal stops the rest of that
          // click's journey once the dialog is open; this stops the very
          // first click, before the dialog exists yet.
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={iconOnly ? `${label ?? 'Hapus'} ${itemLabel}` : undefined}
        title={iconOnly ? (label ?? 'Hapus') : undefined}
        className={
          iconOnly
            ? 'rounded-[8px] p-1.5 text-[#64748b] hover:bg-danger/10 hover:text-danger'
            : 'text-small text-danger hover:underline'
        }
      >
        {iconOnly ? <Trash2 className="h-4 w-4" aria-hidden="true" /> : (label ?? 'Hapus')}
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Data?"
        description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

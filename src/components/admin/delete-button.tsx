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
  successMessage = 'Deleted successfully.',
  iconOnly = false,
}: {
  action: () => Promise<{ error?: string } | void>;
  label?: string;
  /** Name of the specific item being deleted, e.g. the row's title. */
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
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? (label ?? 'Delete') : undefined}
        title={iconOnly ? (label ?? 'Delete') : undefined}
        className={
          iconOnly
            ? 'rounded-[8px] p-1.5 text-slate hover:bg-danger/10 hover:text-danger'
            : 'text-small text-danger hover:underline'
        }
      >
        {iconOnly ? <Trash2 className="h-4 w-4" aria-hidden="true" /> : (label ?? 'Delete')}
      </button>
      <ConfirmDialog
        open={open}
        title={`Delete "${itemLabel}"?`}
        description="This action cannot be undone."
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

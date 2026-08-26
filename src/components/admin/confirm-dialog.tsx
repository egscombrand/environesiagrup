'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

// Built on the native <dialog> element rather than a modal library: it gives
// us ESC-to-close, a real ::backdrop, and focus trapping for free, which
// covers everything this needs without a new dependency.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onCancel();
      }}
      className="m-auto w-full max-w-sm rounded-[14px] border border-line bg-paper p-6 backdrop:bg-ink/40"
    >
      <div className="flex items-start gap-3">
        {destructive ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
          </div>
        ) : null}
        <div>
          <p className="font-display text-h3 text-ink">{title}</p>
          {description ? <p className="mt-1 text-small text-slate">{description}</p> : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-[10px] border border-line px-4 py-2 text-small text-ink hover:bg-stone disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={`rounded-[10px] px-4 py-2 text-small font-medium text-paper disabled:opacity-60 ${
            destructive ? 'bg-danger hover:opacity-90' : 'bg-forest hover:opacity-90'
          }`}
        >
          {pending ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

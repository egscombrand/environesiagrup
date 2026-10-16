'use client';

import { AlertTriangle } from 'lucide-react';
import { AdminModal } from './editor-layout';

// Built on the shared AdminModal (a native <dialog>): Escape and a click on the
// backdrop cancel, and focus stays inside the dialog while it is open.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
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
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onCancel}
      width="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-2 text-small text-ink transition-colors hover:bg-[#f4f6f9] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`rounded-[10px] px-4 py-2 text-small font-medium text-white transition-opacity disabled:opacity-60 ${
              destructive ? 'bg-danger hover:opacity-90' : 'bg-[#2a7793] hover:opacity-90'
            }`}
          >
            {pending ? 'Memproses…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        {destructive ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
          </div>
        ) : null}
        {description ? <p className="text-body text-[#475569]">{description}</p> : null}
      </div>
    </AdminModal>
  );
}

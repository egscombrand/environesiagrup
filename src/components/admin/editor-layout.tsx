'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * Shared layout pieces for every WP Admin editor. They only shape the markup,
 * so the forms keep their fields, actions, and data as they were.
 */

/** The card every editor section sits in: a header row, a divider, and a padded body. */
export function EditorSection({
  title,
  description,
  action,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[16px] border border-[#e3e8ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef2f6] px-6 py-4">
        <div className="min-w-0">
          <h2 className="font-display text-h3 text-ink">{title}</h2>
          {description ? <p className="mt-1 text-small text-[#64748b]">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

/**
 * Two equal columns on desktop, one column on phones. A child that should take
 * the full row adds `FIELD_WIDE`.
 */
export function FieldGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ${className}`}>{children}</div>;
}

export const FIELD_WIDE = 'md:col-span-2';

/**
 * The Header / Content(scroll) / Footer frame every full-page editor form
 * uses — the exact same shape as AdminModal below, just sized to the page's
 * own box (h-full, threaded down from AdminShell's `main` — see
 * admin-shell.tsx) instead of a viewport percentage, since a page also has
 * page-level chrome (PageHeader) above it that a true overlay doesn't.
 *
 * Only EditorFrameContent scrolls. EditorFrameHeader and EditorFrameFooter
 * are plain flex children with `shrink-0` — not `sticky`, not `fixed` —
 * so they can never visually float over content mid-scroll or escape the
 * frame's own bounds; they simply never move, because the flex layout
 * itself never asks them to.
 */
export function EditorFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex h-full min-h-0 flex-col ${className}`}>{children}</div>;
}

export function EditorFrameHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`shrink-0 ${className}`}>{children}</div>;
}

/** The one scrolling region in the frame. `-mx-6`/`px-6` give the scrollbar its own gutter outside the content's normal padding. */
export function EditorFrameContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`min-h-0 flex-1 overflow-y-auto ${className}`}>{children}</div>;
}

export function EditorFrameFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-3 border-t border-[#e3e8ee] bg-white px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A native <dialog> with a header, a scrolling body, and a footer. Used for
 * add, edit, and confirm steps. It closes on Escape and on a click outside it.
 */
const MODAL_WIDTH = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
} as const;

export function AdminModal({
  open,
  title,
  description,
  onClose,
  footer,
  width = 'md',
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer?: ReactNode;
  width?: keyof typeof MODAL_WIDTH;
  children: ReactNode;
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
        onClose();
      }}
      onClick={(e) => {
        // A native <dialog> stays in its original place in the DOM/React
        // tree even while shown modally — so without this, a click on
        // anything inside it (its footer buttons included) still bubbles
        // up to whatever row/card rendered this modal, which can trigger
        // that row's own click handler (e.g. opening a different modal) on
        // top of whatever this one just did. Stopping it here protects
        // every AdminModal use, not just this one call site.
        e.stopPropagation();
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto w-[calc(100%-2rem)] ${MODAL_WIDTH[width]} overflow-hidden rounded-[16px] border border-[#e3e8ee] bg-white p-0 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] backdrop:bg-ink/40`}
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-[#eef2f6] px-6 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-h3 text-ink">{title}</h2>
            {description ? <p className="mt-1 text-small text-[#64748b]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-[8px] p-1.5 text-[#64748b] transition-colors hover:bg-[#f4f6f9] hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[#eef2f6] bg-[#fafbfc] px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}

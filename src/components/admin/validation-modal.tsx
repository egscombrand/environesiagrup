'use client';

import { AlertTriangle, ChevronRight } from 'lucide-react';
import { AdminModal } from './editor-layout';
import type { RequiredField } from './use-required-fields';

/**
 * "Data Belum Lengkap" — lists every required field a Save attempt found
 * empty, each one clickable to jump straight to it. Shared by every WP
 * Admin editor via useRequiredFieldsValidation, so this list and its
 * behavior stay identical everywhere instead of being rebuilt per form.
 */
export function ValidationModal({
  open,
  missing,
  onSelectField,
  onClose,
}: {
  open: boolean;
  missing: RequiredField[];
  onSelectField: (name: string) => void;
  onClose: () => void;
}) {
  return (
    <AdminModal
      open={open}
      title="Data Belum Lengkap"
      onClose={onClose}
      width="sm"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-[10px] border border-[#e3e8ee] bg-white px-4 py-2 text-small text-ink transition-colors hover:bg-[#f4f6f9]"
        >
          Tutup
        </button>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body text-[#475569]">Silakan lengkapi field berikut sebelum menyimpan:</p>
          <ul className="mt-3 space-y-1.5">
            {missing.map((field) => (
              <li key={field.name}>
                <button
                  type="button"
                  onClick={() => onSelectField(field.name)}
                  className="flex w-full items-center justify-between gap-2 rounded-[8px] border border-danger/20 bg-danger/5 px-3 py-2 text-left text-small font-medium text-ink transition-colors hover:border-danger/40 hover:bg-danger/10"
                >
                  {field.label}
                  <ChevronRight className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminModal>
  );
}

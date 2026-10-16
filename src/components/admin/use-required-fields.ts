'use client';

import { useRef, useState, type FormEvent } from 'react';

export type RequiredField = { name: string; label: string };

function isEmptyValue(value: FormDataEntryValue | null): boolean {
  return value === null || String(value).trim() === '';
}

/**
 * Client-side pre-submit validation for a form's required fields, shared by
 * every WP Admin editor (see validation-modal.tsx for the "Data Belum
 * Lengkap" modal this drives). The server/API keeps validating independently
 * (every resource's zod schema already does) — this only improves the UX of
 * catching the same problem before a round trip.
 *
 * Reads straight from the native <form> via FormData, so it works with any
 * mix of controlled and uncontrolled fields without per-field wiring: a
 * field only needs its real `name` attribute to match the one passed here.
 * A field never listed here is treated as optional — it's never flagged,
 * never blocks Save, and can stay empty.
 */
export function useRequiredFieldsValidation(requiredFields: RequiredField[]) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [missing, setMissing] = useState<RequiredField[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  /** True when every required field is filled. Otherwise opens the modal and marks each empty one. */
  function validate(): boolean {
    const form = formRef.current;
    if (!form) return true;
    const data = new FormData(form);
    const found = requiredFields.filter((field) => isEmptyValue(data.get(field.name)));

    if (found.length === 0) {
      setErrors(new Set());
      setMissing([]);
      setModalOpen(false);
      return true;
    }

    setErrors(new Set(found.map((field) => field.name)));
    setMissing(found);
    setModalOpen(true);
    return false;
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }

  /**
   * One delegated listener for the whole form — covers every native input,
   * textarea, and select without each field needing its own onChange. Fires
   * on both 'input' and 'change' since different field types only emit one
   * of the two; clearing twice is harmless.
   */
  function handleFieldActivity(e: FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.name;
    if (name) clearError(name);
  }

  function closeModal() {
    setModalOpen(false);
  }

  /** Closes the modal, then scrolls to and focuses the chosen field once it's no longer hidden behind it. */
  function goToField(name: string) {
    setModalOpen(false);
    requestAnimationFrame(() => {
      const control = formRef.current?.elements.namedItem(name);
      const target = control instanceof RadioNodeList ? control[0] : control;
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      }
    });
  }

  return { formRef, errors, missing, modalOpen, validate, clearError, closeModal, goToField, handleFieldActivity };
}

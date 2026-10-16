'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LegalitasCardDocument } from '@/lib/legalitas-data';

export function DetailButton({
  document: doc,
  entityName,
  category,
}: {
  document: LegalitasCardDocument;
  entityName: string;
  category: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!doc.description) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Lihat Detail — ${doc.title}`}
        className="group mt-1 inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold text-[#2A7793]"
      >
        <span aria-hidden="true" className="relative">
          Lihat Detail
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#2A7793] transition-transform duration-300 motion-reduce:transition-none group-hover:scale-x-100" />
        </span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-[5px]"
        >
          →
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-pine-ink/60"
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(11,43,34,0.25)] [scrollbar-gutter:stable] sm:p-8"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Tutup"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-pine-ink/50 transition hover:bg-stone hover:text-pine-ink"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>

                  <p className="pr-8 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#2A7793]">
                    {entityName}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[#666666]">{category}</p>
                  <p id={titleId} className="mt-2 font-landing-display text-[19px] font-bold leading-snug text-[#111111]">
                    {doc.title}
                  </p>
                  <p className="mt-3 text-body text-[#444444]">{doc.description}</p>

                  {doc.fields.length || doc.issuer ? (
                    <div className="mt-4 space-y-0.5 border-t border-[#E5E7EB] pt-4">
                      {doc.fields.map((field) => (
                        <p key={field.label} className="text-small text-[#666666]">
                          {field.label}: {field.value}
                        </p>
                      ))}
                      {doc.issuer ? <p className="text-small text-[#666666]">Penerbit: {doc.issuer}</p> : null}
                    </div>
                  ) : null}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

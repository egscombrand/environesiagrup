'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LegalitasCardDocument } from '@/lib/legalitas-data';

export function DocumentPreviewButton({
  document: doc,
  entityName,
}: {
  document: LegalitasCardDocument;
  entityName: string;
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

  const ctaText = doc.ctaLabel ?? 'Lihat Dokumen';

  // A real, given external verification link (e.g. a certifying body's
  // public directory) opens in a new tab as a plain link — never routed
  // through the local-file preview modal.
  if (!doc.documentUrl) {
    if (!doc.externalUrl) return null;
    return (
      <a
        href={doc.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-[#2A7793]"
      >
        <span className="relative">
          {ctaText}
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#2A7793] transition-transform duration-300 motion-reduce:transition-none group-hover:scale-x-100" />
        </span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-[5px]"
        >
          →
        </span>
      </a>
    );
  }

  const nomor = doc.fields.find((field) => field.label.toLowerCase().startsWith('nomor'))?.value;
  const tanggal = doc.fields.find((field) => field.label.toLowerCase() === 'tanggal')?.value;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${ctaText} — ${doc.title}`}
        className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-[#2A7793]"
      >
        <span aria-hidden="true" className="relative">
          {ctaText}
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
                  className="relative z-10 flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(11,43,34,0.25)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Tutup"
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-pine-ink/50 backdrop-blur transition hover:bg-stone hover:text-pine-ink"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
                    {doc.documentType === 'image' ? (
                      <Image
                        src={doc.documentUrl}
                        alt={doc.title}
                        width={1200}
                        height={1600}
                        className="h-auto w-full object-contain"
                      />
                    ) : (
                      <iframe src={doc.documentUrl} title={doc.title} className="h-[60vh] w-full" />
                    )}

                    <div className="border-t border-[#E5E7EB] p-6 sm:p-8">
                      <p id={titleId} className="font-landing-display text-[20px] font-bold leading-snug text-[#111111]">
                        {doc.title}
                      </p>
                      <dl className="mt-4 grid grid-cols-1 gap-3 text-[14px] sm:grid-cols-2">
                        <div>
                          <dt className="text-[12px] uppercase tracking-[0.06em] text-[#666666]">Pemilik</dt>
                          <dd className="mt-0.5 text-[#111111]">{entityName}</dd>
                        </div>
                        {nomor ? (
                          <div>
                            <dt className="text-[12px] uppercase tracking-[0.06em] text-[#666666]">Nomor</dt>
                            <dd className="mt-0.5 text-[#111111]">{nomor}</dd>
                          </div>
                        ) : null}
                        {tanggal ? (
                          <div>
                            <dt className="text-[12px] uppercase tracking-[0.06em] text-[#666666]">Tanggal</dt>
                            <dd className="mt-0.5 text-[#111111]">{tanggal}</dd>
                          </div>
                        ) : null}
                        {doc.issuer ? (
                          <div>
                            <dt className="text-[12px] uppercase tracking-[0.06em] text-[#666666]">Penerbit</dt>
                            <dd className="mt-0.5 text-[#111111]">{doc.issuer}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

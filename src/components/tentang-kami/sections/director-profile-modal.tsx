'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { useEffect, useId, useState, type SVGProps } from 'react';
import { createPortal } from 'react-dom';
import { SectionReveal } from '@/components/tentang-kami/sections/director-motion';

export type EducationEntry = {
  level: string;
  institution: string;
  degree?: string;
  scholarship?: string;
  /** Free-form note used when degree/scholarship don't apply (e.g. an in-progress doctoral program). */
  note?: string;
  /** Local asset path (e.g. `/universities/ugm.png`) — never an external/hotlinked URL. Omitted until the real file exists. */
  logo?: string;
};

export type StatHighlight = {
  value: string;
  label: string;
};

export type TeachingEntry = {
  institution: string;
  program: string;
  description: string;
  /** Local asset path — never an external/hotlinked URL. */
  logo?: string;
};

export type DirectorProfile = {
  name: string;
  position: string;
  /** The entity a leadership member belongs to, shown only when it isn't Environesia itself — e.g. "Bikin Indonesia Berdaya" for a group-entity leader, so their jabatan is never mistaken for an Environesia role. */
  entity?: string;
  /** Short professional descriptor shown under the name (e.g. "Praktisi Bisnis Lingkungan") — plain text, never a badge/pill. */
  descriptor?: string;
  /** Every field below is only rendered when real data exists — never filled with guessed content. */
  education?: EducationEntry[];
  experience?: string[];
  stats?: StatHighlight[];
  contribution?: string[];
  /** Defaults to "Kontribusi di Environesia"; Direktur Utama uses "Kontribusi Profesional". */
  contributionLabel?: string;
  teaching?: TeachingEntry[];
  /** Professional/social links, shown as icons at the very bottom of the modal — each only when its URL/address is actually set. */
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
};

const LINK_ICON =
  'flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#555555] transition-colors duration-200 hover:border-[#2A7793] hover:bg-[#2A7793] hover:text-white motion-reduce:transition-none';

// lucide-react no longer ships brand marks (only generic icons), so LinkedIn
// and Instagram are small inline glyphs here — kept filled (the usual way
// these two marks are drawn) rather than forced into lucide's stroke style,
// same size/currentColor as the Mail icon so all three sit consistently in
// the row of link buttons below.
function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.92 4.92 0 0 1-1.15 1.76 4.92 4.92 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.92 4.92 0 0 1-1.76-1.15 4.92 4.92 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.92 4.92 0 0 1 1.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.36-1.02.67-.31.31-.5.6-.67 1.02-.12.31-.26.78-.3 1.65C4.27 8.55 4.26 8.87 4.26 11.55s.01 3 .06 4.05c.04.87.18 1.34.3 1.65.17.42.36.71.67 1.02.31.31.6.5 1.02.67.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.17.71-.36 1.02-.67.31-.31.5-.6.67-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.05s-.01-3-.06-4.05c-.04-.87-.18-1.34-.3-1.65a2.72 2.72 0 0 0-.67-1.02 2.72 2.72 0 0 0-1.02-.67c-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8Zm0 3.38a4.82 4.82 0 1 1 0 9.64 4.82 4.82 0 0 1 0-9.64Zm0 1.8a3.02 3.02 0 1 0 0 6.04 3.02 3.02 0 0 0 0-6.04Zm5.02-1.99a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0Z" />
    </svg>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#2A7793]" aria-hidden="true" />
      <h3 className="text-h3 font-bold text-[#111111]">{children}</h3>
    </div>
  );
}

export function DirectorProfileButton({ person }: { person: DirectorProfile }) {
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

  const hasDetail = Boolean(
    person.education?.length || person.experience?.length || person.contribution?.length || person.teaching?.length
  );
  const hasLinks = Boolean(person.linkedinUrl || person.instagramUrl || person.email);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Lihat Profil Lengkap — ${person.name}`}
        className="group mt-5 inline-flex items-center gap-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.1em] text-[#2A7793]"
      >
        <span aria-hidden="true" className="relative">
          Lihat Profil Lengkap
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
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 max-h-[85vh] w-full max-w-[760px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(11,43,34,0.25)]"
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

                  <div className="max-h-[85vh] overflow-y-auto p-6 [scrollbar-gutter:stable] sm:p-10">
                  <p className="pr-8 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-[#2A7793] sm:text-[14px]">
                    {person.position}
                  </p>
                  <p id={titleId} className="mt-1.5 pr-8 font-landing-display text-[28px] font-bold leading-[1.15] text-[#111111] sm:text-[32px]">
                    {person.name}
                  </p>
                  {person.entity ? <p className="mt-1 text-[14px] font-medium text-[#444444]">{person.entity}</p> : null}
                  {person.descriptor ? (
                    <p className="mt-1.5 text-[15px] font-medium text-[#555555]">{person.descriptor}</p>
                  ) : null}

                  {hasDetail ? <div className="mt-6 h-px bg-[#E5E7EB]" /> : null}

                  {hasDetail ? (
                    <div className="mt-7 space-y-7">
                      {person.education?.length ? (
                        <SectionReveal>
                          <SectionLabel>Pendidikan</SectionLabel>
                          <div className="mt-4">
                            {person.education.map((entry, index) => {
                              const isLast = index === person.education!.length - 1;
                              const meta = [
                                entry.degree ? entry.degree : null,
                                entry.scholarship ? `Beasiswa ${entry.scholarship}` : null,
                              ].filter(Boolean);
                              return (
                                <div key={`${entry.level}-${entry.institution}`} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className="mt-1.5 h-[10px] w-[10px] shrink-0 rounded-full bg-[#2A7793]" />
                                    {!isLast ? <div className="w-px flex-1 bg-[#E5E7EB]" /> : null}
                                  </div>
                                  <div className={`flex flex-1 items-start justify-between gap-3 ${isLast ? '' : 'pb-6'}`}>
                                    <div>
                                      <p className="text-[17px] font-bold text-[#111111] sm:text-[18px]">{entry.level}</p>
                                      <p className="mt-0.5 text-[15px] font-semibold text-[#2A7793]">
                                        {entry.institution}
                                      </p>
                                      {meta.length ? (
                                        <p className="mt-0.5 text-[14px] text-[#666666]">{meta.join(' · ')}</p>
                                      ) : null}
                                      {entry.note ? (
                                        <p className="mt-1.5 max-w-[46ch] text-small text-[#555555]">
                                          {entry.note}
                                        </p>
                                      ) : null}
                                    </div>
                                    {entry.logo ? (
                                      <Image
                                        src={entry.logo}
                                        alt={entry.institution}
                                        width={96}
                                        height={96}
                                        className="h-14 w-14 shrink-0 rounded-md border border-[#E5E7EB] bg-white object-contain p-1.5 sm:h-16 sm:w-16"
                                      />
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </SectionReveal>
                      ) : null}

                      {person.experience?.length ? (
                        <SectionReveal>
                          <SectionLabel>Pengalaman Profesional</SectionLabel>
                          {person.stats?.length ? (
                            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                              {person.stats.map((stat) => (
                                <div key={stat.label}>
                                  <p className="font-landing-display text-[26px] font-extrabold text-[#2A7793] sm:text-[28px]">
                                    {stat.value}
                                  </p>
                                  <p className="mt-0.5 text-[12px] text-[#666666] sm:text-[13px]">{stat.label}</p>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          <div className="mt-4 max-w-[62ch] space-y-3 text-body text-[#444444]">
                            {person.experience.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                        </SectionReveal>
                      ) : null}

                      {person.contribution?.length ? (
                        <SectionReveal>
                          <SectionLabel>{person.contributionLabel ?? 'Kontribusi di Environesia'}</SectionLabel>
                          <div className="mt-4 space-y-3 border-l-2 border-[#2A7793] pl-5">
                            {person.contribution.map((paragraph) => (
                              <p key={paragraph} className="text-[17px] font-medium leading-[1.7] text-[#333333] sm:text-[18px]">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </SectionReveal>
                      ) : null}

                      {person.teaching?.length ? (
                        <SectionReveal>
                          <SectionLabel>Dosen Praktisi</SectionLabel>
                          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                            {person.teaching.map((entry, index) => (
                              <div
                                key={entry.institution}
                                className={index === 0 ? 'sm:border-r sm:border-[#E5E7EB] sm:pr-8' : ''}
                              >
                                <p className="text-[15px] font-semibold text-[#2A7793]">{entry.institution}</p>
                                <p className="mt-1 text-[15px] font-bold text-[#111111]">{entry.program}</p>
                                <p className="mt-1.5 text-small text-[#444444]">{entry.description}</p>
                              </div>
                            ))}
                          </div>
                        </SectionReveal>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-6 text-[16px] leading-[1.7] text-[#444444]">Profil lengkap akan segera hadir.</p>
                  )}

                  {/* Always last, below every other section, regardless of
                      whether hasDetail rendered anything above — the one
                      part of the modal that is never "complete content" vs.
                      "placeholder", it simply shows or doesn't. */}
                  {hasLinks ? (
                    <SectionReveal>
                      <div className="mt-7 h-px bg-[#E5E7EB]" />
                      <div className="mt-6">
                        <SectionLabel>Tautan Profesional</SectionLabel>
                        <div className="mt-4 flex items-center gap-3">
                          {person.linkedinUrl ? (
                            <a
                              href={person.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`LinkedIn — ${person.name}`}
                              className={LINK_ICON}
                            >
                              <LinkedinGlyph className="h-[18px] w-[18px]" />
                            </a>
                          ) : null}
                          {person.instagramUrl ? (
                            <a
                              href={person.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Instagram — ${person.name}`}
                              className={LINK_ICON}
                            >
                              <InstagramGlyph className="h-[18px] w-[18px]" />
                            </a>
                          ) : null}
                          {person.email ? (
                            <a href={`mailto:${person.email}`} aria-label={`Email — ${person.name}`} className={LINK_ICON}>
                              <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </SectionReveal>
                  ) : null}
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

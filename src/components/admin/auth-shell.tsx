'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  accentColors,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accentColors: string[];
  children: ReactNode;
  footer?: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual panel — abstract, brand-derived; no stock imagery. Collapses
          to a compact band on mobile rather than a scaled-down copy. */}
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10221C] via-[#0F4C3A] to-[#10221C]" />
          <motion.div
            className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-moss/30 blur-[120px]"
            animate={shouldReduceMotion ? undefined : { opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] h-[480px] w-[480px] rounded-full bg-forest/40 blur-[140px]"
            animate={shouldReduceMotion ? undefined : { opacity: [0.6, 0.3, 0.6], scale: [1, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(251,251,249,0.6) 40px)',
            }}
          />
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative"
        >
          <p className="font-mono text-label uppercase tracking-[0.08em] text-paper/60">
            Environesia Company Group
          </p>
          <p className="mt-1 font-mono text-label uppercase tracking-[0.08em] text-paper/60">
            Admin Workspace
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="relative max-w-md"
        >
          <h1 className="font-display text-display text-paper" style={{ fontVariationSettings: '"wght" 600' }}>
            Satu grup, satu sistem.
          </h1>
          <p className="mt-4 text-body text-paper/70">
            Kelola entitas, proyek, berita, dan seluruh konten publik grup dari satu tempat.
          </p>
          {accentColors.length > 0 ? (
            <div className="mt-8 flex items-center gap-2">
              {accentColors.map((color, i) => (
                <span
                  key={`${color}-${i}`}
                  className="h-2 w-2 rounded-full ring-1 ring-paper/30"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-6 py-16 md:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-full max-w-sm"
        >
          <Image
            src="/brand/environesia-group.png"
            alt="Environesia Company Group"
            width={172}
            height={36}
            priority
            className="h-8 w-auto lg:hidden"
          />
          <p className="mt-8 font-mono text-label uppercase text-slate lg:mt-0">{eyebrow}</p>
          <h2 className="mt-3 font-display text-h2 text-ink">{title}</h2>
          <p className="mt-2 text-body text-slate">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-6">{footer}</div> : null}
        </motion.div>
      </div>
    </div>
  );
}

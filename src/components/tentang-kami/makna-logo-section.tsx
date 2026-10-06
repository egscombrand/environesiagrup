'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion';

const ACCENT = '#0DA19D'; // Simbol — green
const TYPO_COLOR = '#0F7A6B'; // Tipografi
const BLUE = '#2E7692'; // Warna — biru
const EASE = [0.16, 1, 0.3, 1] as const;
const LIQUID_EASE = [0.37, 0, 0.16, 1] as const; // slow start, long unhurried middle

// The real logo (6869×1437) genuinely contains two separate objects with a
// true transparent gap between them — the swirl symbol, and the
// "environesia®" wordmark fused together with its tagline beneath it as
// one lockup (kept together as a single object, not split further — they
// already read as one unit in the source file). Both were extracted as
// their own, complete, unmodified PNGs via real alpha-channel
// bounding-box detection against the production asset — nothing here is a
// guessed percentage or a runtime crop of a single image, so neither
// piece can ever render half-cut. See public/brand/environesia-symbol.png
// and environesia-wordmark.png; regenerate both (same technique) if the
// brand mark itself is ever replaced.
//
// The stage below reproduces their real relative position and scale: each
// box is the element's true measured pixel rect (plus a small breathing
// margin), expressed as a percentage of the full original canvas, so the
// two pieces recompose into exactly the original lockup — not an
// approximation of it.
const LOGO_ASPECT = 6869 / 1437;
const SYMBOL_BOX = { left: -0.626, top: -2.993, width: 20.731, height: 105.985 };
const WORDMARK_BOX = { left: 21.051, top: 15.24, width: 79.575, height: 87.683 };

// The color reveal is driven by a single CSS custom property animated
// across a wide, angled, soft-edged feather (see colorMask below) so
// "how much has turned to color" reads as a slow tide moving through the
// mark rather than a hard-edged wipe. The extremes sit well outside
// 0–100 so that feather never leaks a sliver of color/gray at the wrong
// time.
const FEATHER = 24;
const COLOR_OFF = -(FEATHER + 4);
const COLOR_ON = 100 + FEATHER + 4;

const ICON_ENTER_S = 0.85;
const WORDMARK_ENTER_S = 0.9;
const COLOR_FLOW_S = 2.2;
const SETTLE_S = 1.2;

type LogoPart = {
  id: string;
  label: string;
  color: string;
  description: string;
};

const PARTS: LogoPart[] = [
  {
    id: 'simbol',
    label: 'Simbol',
    color: ACCENT,
    description:
      'Bentuk pusaran pada simbol Environesia menggambarkan siklus dan pergerakan yang berkelanjutan, cara kerja lingkungan yang terus berputar, saling terhubung, dan tidak pernah berhenti pada satu titik.',
  },
  {
    id: 'tipografi',
    label: 'Tipografi',
    color: TYPO_COLOR,
    description:
      'Wordmark huruf kecil (lowercase) dengan bentuk yang membulat dan modern mencerminkan sikap yang terbuka dan mudah diajak bekerja sama, tanpa mengurangi kesan profesional sebagai grup usaha.',
  },
  {
    id: 'warna',
    label: 'Warna',
    color: BLUE,
    description:
      'Gradasi hijau menuju biru menyatukan dua asosiasi utama grup: hijau untuk lingkungan dan keberlanjutan, biru untuk kepercayaan dan profesionalisme dalam setiap pekerjaan yang dijalankan.',
  },
  {
    id: 'kesatuan',
    label: 'Kesatuan Identitas',
    color: ACCENT,
    description:
      'Simbol dan wordmark dirancang menyatu sebagai satu kesatuan visual, merepresentasikan bagaimana lima entitas di bawah Environesia Group bekerja sebagai satu ekosistem, bukan lini usaha yang berdiri sendiri-sendiri.',
  },
];

function boxStyle(box: { left: number; top: number; width: number; height: number }): React.CSSProperties {
  return { left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` };
}

export function MaknaLogoSection({ logoAlt }: { logoUrl: string; logoAlt: string }) {
  const [index, setIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const active = PARTS[index];

  const wordmarkShown = index >= 1;
  const colorShown = index >= 2;
  const isFinal = index === 3;

  const prevIndexRef = useRef(index);
  const [streakKey, setStreakKey] = useState(0);
  const stageControls = useAnimation();

  useEffect(() => {
    const prev = prevIndexRef.current;
    if (!shouldReduceMotion && prev < 2 && index >= 2) {
      setStreakKey((n) => n + 1);
    }
    if (!shouldReduceMotion && prev !== 3 && index === 3) {
      // If color hasn't finished its own flow yet (jumping straight from
      // a step before Warna), let it finish before the final assembly
      // settle starts — the assembly is a separate, later beat.
      const delay = prev < 2 ? COLOR_FLOW_S : 0;
      stageControls.start({
        scale: [1, 1.025, 1],
        transition: { delay, duration: SETTLE_S, ease: EASE, times: [0, 0.6, 1] },
      });
    }
    prevIndexRef.current = index;
  }, [index, shouldReduceMotion, stageControls]);

  function go(delta: number) {
    setIndex((current) => (current + delta + PARTS.length) % PARTS.length);
  }

  const iconEnter = { duration: shouldReduceMotion ? 0 : ICON_ENTER_S, ease: EASE };
  const wordmarkEnter = { duration: shouldReduceMotion ? 0 : WORDMARK_ENTER_S, ease: EASE };
  const colorTransition = { duration: shouldReduceMotion ? 0 : COLOR_FLOW_S, ease: LIQUID_EASE };
  const nudgeTransition = { duration: shouldReduceMotion ? 0 : SETTLE_S, ease: EASE };

  // A wide, gently angled, soft-edged boundary — a slow tide, not a wipe.
  const colorMask = `linear-gradient(97deg, black 0%, black max(0%, calc(var(--color-reveal) * 1% - ${FEATHER}%)), transparent calc(var(--color-reveal) * 1% + ${FEATHER}%), transparent 100%)`;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <svg
        className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 opacity-[0.05]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path d="M100 20a80 80 0 1 1-56.6 23.4" stroke={ACCENT} strokeWidth="1.5" />
      </svg>

      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-6 py-14 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-14 md:px-12 md:py-16">
        {/* Left — the interactive build-up stage. */}
        <div>
          <p className="font-mono text-label uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
            Identitas Visual
          </p>

          <motion.div
            className="relative mt-6 w-full"
            style={{ aspectRatio: `${LOGO_ASPECT}` }}
            animate={stageControls}
            role="img"
            aria-label={logoAlt}
          >
            {/* Simbol — a whole, independent object. Fades, scales, and
                un-blurs in once on mount, then stays visible through every
                later step; nudges very slightly on final assembly. */}
            <motion.div
              className="absolute"
              style={boxStyle(SYMBOL_BOX)}
              initial={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }
                  : { opacity: 0, scale: 0.92, filter: 'blur(10px)', x: 0 }
              }
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: isFinal ? [0, 3, 0] : 0 }}
              transition={{ ...iconEnter, x: nudgeTransition }}
            >
              <div className="relative h-full w-full">
                <Image
                  src="/brand/environesia-symbol.png"
                  alt=""
                  fill
                  quality={100}
                  sizes="(min-width: 768px) 20vw, 45vw"
                  className="object-contain grayscale"
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            {/* Tipografi — the wordmark as a whole, independent object;
                slides and fades in from the right and settles, leaving the
                same way in reverse. Never a crop of the symbol layer. */}
            <AnimatePresence>
              {wordmarkShown && (
                <motion.div
                  key="wordmark"
                  className="absolute"
                  style={boxStyle(WORDMARK_BOX)}
                  initial={shouldReduceMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 26, scale: 0.98 }}
                  animate={{ opacity: 1, x: isFinal ? [0, -3, 0] : 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 26, scale: 0.98 }}
                  transition={{ ...wordmarkEnter, x: nudgeTransition }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src="/brand/environesia-wordmark.png"
                      alt=""
                      fill
                      quality={100}
                      sizes="(min-width: 768px) 36vw, 70vw"
                      className="object-contain grayscale"
                      aria-hidden="true"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Warna — full-color copies of the same two objects, revealed
                through one continuous animated mask so color reads as a
                slow tide moving through the whole composed mark. */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={
                {
                  maskImage: colorMask,
                  WebkitMaskImage: colorMask,
                  '--color-reveal': shouldReduceMotion ? (colorShown ? COLOR_ON : COLOR_OFF) : COLOR_OFF,
                } as React.CSSProperties
              }
              animate={{ '--color-reveal': colorShown ? COLOR_ON : COLOR_OFF } as unknown as Record<string, number>}
              transition={colorTransition}
              aria-hidden="true"
            >
              <div className="absolute" style={boxStyle(SYMBOL_BOX)}>
                <div className="relative h-full w-full">
                  <Image src="/brand/environesia-symbol.png" alt="" fill quality={100} sizes="(min-width: 768px) 20vw, 45vw" className="object-contain" />
                </div>
              </div>
              {wordmarkShown && (
                <div className="absolute" style={boxStyle(WORDMARK_BOX)}>
                  <div className="relative h-full w-full">
                    <Image src="/brand/environesia-wordmark.png" alt="" fill quality={100} sizes="(min-width: 768px) 36vw, 70vw" className="object-contain" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* A very soft highlight that drifts once across the mark as
                color arrives — a liquid flourish, not a looping effect. */}
            <AnimatePresence>
              {streakKey > 0 && (
                <motion.div
                  key={streakKey}
                  className="pointer-events-none absolute inset-y-0 w-1/3"
                  style={{
                    background: 'linear-gradient(100deg, transparent 25%, rgba(255,255,255,0.32) 50%, transparent 75%)',
                    mixBlendMode: 'overlay',
                  }}
                  initial={{ left: '-30%', opacity: 0 }}
                  animate={{ left: '105%', opacity: [0, 0.7, 0] }}
                  transition={{ duration: COLOR_FLOW_S * 0.85, ease: LIQUID_EASE }}
                  onAnimationComplete={() => setStreakKey(0)}
                />
              )}
            </AnimatePresence>

            {/* Kesatuan — one brief soft glow behind the assembled mark as
                everything settles into its final state. */}
            <AnimatePresence>
              {isFinal && !shouldReduceMotion && (
                <motion.div
                  key="settle-glow"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(60% 60% at 30% 50%, ${ACCENT}33, transparent 70%)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: SETTLE_S, ease: EASE, delay: prevIndexRef.current === 2 ? 0 : COLOR_FLOW_S }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress — counter, dots, and a thin fill line. */}
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] tabular-nums text-pine-ink/40">
                0{index + 1} / 0{PARTS.length}
              </span>
              <div className="flex gap-1.5">
                {PARTS.map((part, i) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={part.label}
                    aria-current={i === index ? 'true' : undefined}
                    className="h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                    style={{
                      width: i === index ? '20px' : '6px',
                      backgroundColor: i === index ? active.color : 'rgba(11,43,34,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 h-[3px] w-full max-w-[220px] overflow-hidden rounded-full bg-pine-ink/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: active.color }}
                animate={{ width: `${((index + 1) / PARTS.length) * 100}%` }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            </div>
          </div>
        </div>

        {/* Right — one active explanation at a time, chip nav to jump. */}
        <div>
          <h2 className="font-landing-display text-h2 font-bold text-pine-ink">Makna Logo</h2>

          {/* 2×2 grid — four parts of one identity to explore one at a
              time, not a row of chips. Number, name, and a shared,
              morphing underline (via layoutId) that slides between cells
              instead of jumping, so the active state itself reads as part
              of the same premium motion language as the stage on the
              left. */}
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5">
            {PARTS.map((part, i) => {
              const isActive = i === index;
              const isHighlighted = isActive || hoveredIndex === i;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex((current) => (current === i ? null : current))}
                  aria-pressed={isActive}
                  className="relative flex flex-col items-start gap-1 py-2.5 text-left"
                >
                  <span
                    className="font-mono text-[11px] font-bold tracking-[0.06em] transition-colors duration-200"
                    style={{ color: isHighlighted ? part.color : 'rgba(11,43,34,0.35)' }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="font-landing-display text-[17px] font-bold leading-tight transition-colors duration-200 md:text-[19px]"
                    style={{ color: isHighlighted ? part.color : '#0B2B22' }}
                  >
                    {part.label}
                  </span>
                  {isActive ? (
                    <motion.span
                      layoutId="makna-logo-nav-indicator"
                      className="absolute -bottom-0.5 left-0 h-[2.5px] w-9 rounded-full"
                      style={{ backgroundColor: part.color }}
                      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  ) : (
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[2.5px] rounded-full bg-pine-ink/20 transition-all duration-200 ${
                        hoveredIndex === i ? 'w-9 opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative mt-6 min-h-[130px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <p className="font-landing-display text-[20px] font-bold" style={{ color: active.color }}>
                  0{index + 1} {active.label}
                </p>
                <p className="mt-2 max-w-[520px] text-[15px] leading-[1.6] text-pine-ink/70">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev/next — step navigation only. */}
          <div className="mt-6 flex items-center gap-4 border-t border-pine-ink/10 pt-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="text-[14px] font-medium text-pine-ink/50 transition-colors hover:text-pine-ink"
            >
              ← {PARTS[(index - 1 + PARTS.length) % PARTS.length].label}
            </button>
            <span className="text-pine-ink/20">|</span>
            <button
              type="button"
              onClick={() => go(1)}
              className="text-[14px] font-medium text-pine-ink/50 transition-colors hover:text-pine-ink"
            >
              {PARTS[(index + 1) % PARTS.length].label} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

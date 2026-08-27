'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Stat } from '@/lib/cms/stats';

// project.md §4 caps counters at 1.5s. The stagger is included in that budget:
// the last tile starts at STAGGER_MS × (n-1) and still lands under the cap.
const DURATION_MS = 1100;
const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 5;

// Quartic ease-out. Mirrors the character of the project's signature fade-up
// curve [0.16, 1, 0.3, 1]: quick off the mark, then a long settle. A linear
// ramp is what reads as cheap — the number arrives at a constant rate and
// stops dead, with no sense of deceleration.
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, active: boolean, delayMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    // requestAnimationFrame rather than a 30-step interval: the old version
    // advanced 20 times a second, which is visibly chunky on a large numeral.
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start - delayMs;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / DURATION_MS, 1);
      setValue(Math.round(target * easeOut(progress)));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, delayMs]);

  return value;
}

function Counter({ stat, icon, index }: { stat: Stat; icon: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const delayMs = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
  const value = useCountUp(Number(stat.value), active, delayMs);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/10 transition-all duration-500 ease-out motion-reduce:transition-none"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'scale(1)' : 'scale(0.9)',
            transitionDelay: `${delayMs}ms`,
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
        {/* tabular-nums keeps every digit the same width, so the numeral does
            not jitter sideways while it counts — the detail that separates a
            considered counter from a twitchy one. */}
        <p className="font-display text-display tabular-nums text-forest">
          {stat.prefix}
          {value}
          {stat.suffix}
        </p>
      </div>
      <p className="mt-3 font-mono text-label uppercase text-slate">{stat.label}</p>
    </div>
  );
}

export function KeyStatsCounters({ items }: { items: { stat: Stat; icon: ReactNode }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-12">
      {items.map(({ stat, icon }, index) => (
        <div key={stat.id} className="basis-[calc(50%-1.25rem)] md:basis-[calc(33.333%-1.667rem)]">
          <Counter stat={stat} icon={icon} index={index} />
        </div>
      ))}
    </div>
  );
}

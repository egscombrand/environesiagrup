'use client';

import { useEffect, useRef, useState } from 'react';
import type { StatEntry } from '@/lib/content-types';

const DURATION_MS = 1500;
const STEPS = 30;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let step = 0;
    const increment = target / STEPS;
    const interval = setInterval(() => {
      step += 1;
      if (step >= STEPS) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.round(increment * step));
      }
    }, DURATION_MS / STEPS);

    return () => clearInterval(interval);
  }, [target, active]);

  return value;
}

function Counter({ stat }: { stat: StatEntry }) {
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

  const value = useCountUp(stat.nilai, active);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-display text-forest">
        {value}
        {stat.satuan}
      </p>
      <p className="mt-2 font-mono text-label uppercase text-slate">{stat.label}</p>
    </div>
  );
}

export function KeyStatsCounters({ stats }: { stats: StatEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat) => (
        <Counter key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

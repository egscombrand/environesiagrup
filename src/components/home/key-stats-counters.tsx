'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Stat } from '@/lib/cms/stats';

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

function Counter({ stat, icon }: { stat: Stat; icon: ReactNode }) {
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

  const value = useCountUp(Number(stat.value), active);

  return (
    <div ref={ref} className="text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10">
        {icon}
      </span>
      <p className="mt-4 font-display text-display text-forest">
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 font-mono text-label uppercase text-slate">{stat.label}</p>
    </div>
  );
}

export function KeyStatsCounters({ items }: { items: { stat: Stat; icon: ReactNode }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-10">
      {items.map(({ stat, icon }) => (
        <div key={stat.id} className="basis-[calc(50%-1.25rem)] md:basis-[calc(25%-1.875rem)]">
          <Counter stat={stat} icon={icon} />
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

const ACCENT = '#0DA19D';
const DURATION_MS = 1800;

// Quartic ease-out — quick off the mark, long settle, rather than a linear
// ramp that arrives at a constant rate and stops dead.
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export type TrustedPartnersStatItem = {
  id: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string;
};

/**
 * The 3 trust numbers count up together, once, the first time this block
 * enters the viewport — not per-item, so they read as one shared trust
 * statement rather than three separate counters. A returning scroll never
 * re-triggers it (the observer disconnects after the first hit), and
 * `prefers-reduced-motion` skips the animation entirely and shows the final
 * values immediately.
 */
export function TrustedPartnersStats({ items }: { items: TrustedPartnersStatItem[] }) {
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
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto flex max-w-xl items-stretch justify-center divide-x divide-pine-ink/10">
      {items.map((item) => (
        <StatValue key={item.id} item={item} active={active} />
      ))}
    </div>
  );
}

function StatValue({ item, active }: { item: TrustedPartnersStatItem; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(item.value);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(item.value * easeOut(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, item.value]);

  return (
    <div className="flex-1 px-6 text-center first:pl-0 last:pr-0 md:px-10">
      {/* tabular-nums keeps every digit the same width, so the numeral
          doesn't jitter sideways while it counts. The `+` suffix is part of
          the same string, after the number, so it never gets stranded in
          front of it while the value is still animating. */}
      <p className="font-mono text-[28px] font-bold tabular-nums md:text-[34px]" style={{ color: ACCENT }}>
        {item.prefix ?? ''}
        {value.toLocaleString('id-ID')}
        {item.suffix ?? ''}
      </p>
      <p className="mt-1 text-small text-pine-ink/55">{item.label}</p>
    </div>
  );
}

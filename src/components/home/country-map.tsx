'use client';

import { useState } from 'react';
import type { ProjectPin } from '@/lib/content-types';

function project([lng, lat]: [number, number]) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 60;
  return { x, y };
}

export function CountryMap({ pins }: { pins: ProjectPin[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (pins.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[14px] border border-line bg-stone px-6 text-center">
        <p className="text-small text-slate">
          Peta jejak proyek akan tersedia setelah data 10 negara lengkap.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[14px] border border-line bg-stone">
      <svg viewBox="0 0 100 60" className="h-full w-full" role="img" aria-label="Peta jejak proyek">
        {pins.map((pin, index) => {
          const { x, y } = project(pin.koordinat);
          return (
            <circle
              key={`${pin.negara}-${index}`}
              cx={x}
              cy={y}
              r={1.2}
              className="cursor-pointer fill-forest"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${pin.judul}, ${pin.negara}`}
            />
          );
        })}
      </svg>
      {activeIndex !== null ? (
        <div className="absolute bottom-4 left-4 rounded border border-line bg-paper px-3 py-2 text-small text-ink shadow-sm">
          <p className="font-medium">{pins[activeIndex].judul}</p>
          <p className="text-slate">{pins[activeIndex].negara}</p>
        </div>
      ) : null}
    </div>
  );
}

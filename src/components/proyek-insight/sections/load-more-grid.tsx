'use client';

import { Children, useState, type ReactNode } from 'react';

/** Reveals a server-rendered grid a page at a time, so a long archive never renders all at once. */
export function LoadMoreGrid({
  children,
  className,
  initial = 9,
  step = 9,
}: {
  children: ReactNode;
  className: string;
  initial?: number;
  step?: number;
}) {
  const items = Children.toArray(children);
  const [count, setCount] = useState(initial);

  return (
    <>
      <div className={className}>{items.slice(0, count)}</div>
      {count < items.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + step)}
            className="rounded-[10px] border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 hover:border-[#01B3A1]"
            style={{ borderColor: '#E5E7EB', color: '#2A7793' }}
          >
            Tampilkan lebih banyak
          </button>
        </div>
      ) : null}
    </>
  );
}

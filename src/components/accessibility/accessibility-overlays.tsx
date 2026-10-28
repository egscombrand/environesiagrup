'use client';

import { useEffect, useRef } from 'react';
import { useAccessibility } from './accessibility-context';

/**
 * Feature 17 (sorotan kursor) and 23/24 (garis bantu / penyorotan area baca)
 * — all three are "a small element that tracks the pointer," so they share
 * one mousemove listener instead of three. `pointer-events-none` throughout
 * so none of them can ever block a click, text selection, or a link.
 *
 * Cursor highlight is a ring/halo, not a filled disc — a filled circle at
 * 15% opacity sat directly on top of whatever text was under the cursor,
 * which is exactly the "sorotan mengganggu tulisan" problem reported. An
 * outlined halo (a soft outer shadow + a crisp inner ring, no fill) stays
 * visible against both light and dark backgrounds without ever covering
 * the glyph underneath. Size/intensity now come from a real slider
 * (cursorHighlightSizeStep) instead of being fixed. It's also skipped
 * entirely on coarse/touch-only pointers, where there's no cursor to
 * highlight and the fixed-position dot would just be stray decoration.
 */
const CURSOR_HALO_SIZES = [28, 36, 48, 64]; // px, indexed by cursorHighlightSizeStep (0–3)

export function AccessibilityOverlays() {
  const { settings } = useAccessibility();
  const cursorRef = useRef<HTMLDivElement>(null);
  const guideLineRef = useRef<HTMLDivElement>(null);
  const guideAreaRef = useRef<HTMLDivElement>(null);
  const hasFinePointerRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    hasFinePointerRef.current = window.matchMedia('(pointer: fine)').matches;
  }, []);

  const cursorHighlightActive = settings.cursorHighlight && hasFinePointerRef.current;
  const needsTracking = cursorHighlightActive || settings.readingGuideLine || settings.readingAreaHighlight;

  useEffect(() => {
    if (!needsTracking) return;

    function onMove(event: PointerEvent) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      }
      if (guideLineRef.current) {
        guideLineRef.current.style.transform = `translateY(${event.clientY}px)`;
      }
      if (guideAreaRef.current) {
        guideAreaRef.current.style.transform = `translateY(${event.clientY - 60}px)`;
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [needsTracking]);

  const haloSize = CURSOR_HALO_SIZES[settings.cursorHighlightSizeStep] ?? CURSOR_HALO_SIZES[1];

  return (
    <div aria-hidden="true">
      {cursorHighlightActive ? (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[9997] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: haloSize,
            height: haloSize,
            willChange: 'transform',
            border: '2px solid rgba(42,119,147,0.9)',
            boxShadow: '0 0 0 2px rgba(255,255,255,0.9), 0 0 10px 2px rgba(0,0,0,0.25)',
            background: 'transparent',
          }}
        />
      ) : null}
      {settings.readingGuideLine ? (
        <div
          ref={guideLineRef}
          className="pointer-events-none fixed left-0 top-0 z-[9997] h-[2px] w-full bg-[#F2A93B]"
          style={{ willChange: 'transform', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
        />
      ) : null}
      {settings.readingAreaHighlight ? (
        <div
          ref={guideAreaRef}
          className="pointer-events-none fixed left-0 top-0 z-[9996] h-[120px] w-full bg-[#2A7793]/[0.06]"
          style={{ willChange: 'transform' }}
        />
      ) : null}
    </div>
  );
}

// Standard, widely-used color-vision-deficiency simulation/correction
// matrices, as flat 4x5 arrays (row-major) so they can be blended against
// the identity matrix by intensity below.
const IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
const COLOR_FILTERS: { id: string; matrix: number[] }[] = [
  { id: 'a11y-protanopia', matrix: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0] },
  { id: 'a11y-deuteranopia', matrix: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0] },
  { id: 'a11y-tritanopia', matrix: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0] },
];

function blendMatrix(matrix: number[], intensity: number): string {
  const t = Math.min(100, Math.max(0, intensity)) / 100;
  return matrix.map((v, i) => (IDENTITY_MATRIX[i] * (1 - t) + v * t).toFixed(4)).join(' ');
}

/**
 * Rendered once, globally — `filter: url(#a11y-...)` on <html> (see
 * globals.css) references these by id. `intensity` (0–100, from the
 * Color Filter panel's slider) blends each matrix against the identity
 * matrix so the effect is real and adjustable, not just on/off.
 */
export function AccessibilityColorFilters({ intensity }: { intensity: number }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {COLOR_FILTERS.map((f) => (
          <filter key={f.id} id={f.id}>
            <feColorMatrix type="matrix" values={blendMatrix(f.matrix, intensity)} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

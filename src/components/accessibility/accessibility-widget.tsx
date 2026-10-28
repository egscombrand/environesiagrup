'use client';

import { useRef, useState } from 'react';
import { Accessibility } from 'lucide-react';
import { messagesFor } from '@/i18n/messages';
import { AccessibilityProvider, useAccessibility } from './accessibility-context';
import { AccessibilityOverlays, AccessibilityColorFilters } from './accessibility-overlays';
import { AccessibilityPanel } from './accessibility-panel';

/** Reads the live color-filter intensity from context so the SVG matrices stay in sync with the slider. */
function ColorFiltersBridge() {
  const { settings } = useAccessibility();
  return <AccessibilityColorFilters intensity={settings.colorFilterIntensity} />;
}

/**
 * The floating trigger + panel + the mouse-tracking overlays it can turn
 * on, all under one AccessibilityProvider. Mounted once near the root of
 * the public layout (see src/app/[locale]/layout.tsx) — everything else
 * (Header, Footer, every page) just lives inside the same CSS effects via
 * the data-a11y-* attributes this sets on <html>.
 *
 * Position/size here were last adjusted directly in-editor rather than by
 * this file's own commit history — see the live `top-[...]`/`h-*` classes
 * below for the current values, not this comment.
 */
export function AccessibilityWidget({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <AccessibilityProvider>
      <ColorFiltersBridge />
      <AccessibilityOverlays />
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t.aksesibilitas.tombolLabel}
        title={t.aksesibilitas.tombolLabel}
        onClick={() => setOpen((v) => !v)}
        className="group fixed left-3 top-[78vh] z-[9995] flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(42,119,147,0.4)] transition-transform duration-200 hover:scale-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:left-5 sm:h-16 sm:w-16"
        style={{ backgroundColor: '#2A7793' }}
      >
        <Accessibility className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-[8px] bg-[#1A1A1A] px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 motion-reduce:transition-none sm:block"
        >
          {t.aksesibilitas.judul}
        </span>
      </button>
      <AccessibilityPanel locale={locale} open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </AccessibilityProvider>
  );
}

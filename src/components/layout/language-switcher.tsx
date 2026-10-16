'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { messagesFor } from '@/i18n/messages';

// Flag + native name + code — the flag is never the only identifier (a
// color-blind or flag-unfamiliar visitor still gets the name and code),
// per the design brief. Emoji flags render natively per-OS with no extra
// asset/build step, and are what the brief itself used to spec these three.
const LANGUAGES = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
] as const;

const CODE_LABEL: Record<string, string> = { id: 'ID', en: 'EN', zh: 'ZH' };

// Matches the panel's `w-56` class (56 * 4px) — kept in sync explicitly
// since the position math below needs the pixel value, not just a class.
const PANEL_WIDTH = 224;

// useSearchParams() (needed to carry the query string across a language
// switch) opts a client component out of static rendering unless it sits
// behind a Suspense boundary — without one, every statically-generated
// page that renders the header would fail to prerender. The exported
// LanguageSwitcher below is that boundary; the real component (reading
// usePathname/useSearchParams) stays inner and client-only, same reasoning
// as before — keep this off the server-rendered critical path — just now
// wrapped so static generation isn't affected either. The fallback is a
// same-sized placeholder (never empty space) so there's no layout shift;
// in the browser this resolves on the very first paint, no visible flash.
function LanguageSwitcherFallback() {
  return (
    <div
      className="tap-target h-[30px] w-[88px] animate-pulse rounded-full border border-pine-ink/10 bg-pine-ink/5"
      aria-hidden="true"
    />
  );
}

export function LanguageSwitcher({ locale }: { locale: string }) {
  return (
    <Suspense fallback={<LanguageSwitcherFallback />}>
      <LanguageSwitcherInner locale={locale} />
    </Suspense>
  );
}

function LanguageSwitcherInner({ locale }: { locale: string }) {
  const t = messagesFor(locale);
  const pathname = usePathname() ?? `/${locale}`;
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Fixed-position coordinates for the portalled panel, measured from the
  // trigger on open — see the portal comment below for why this exists.
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  // Hash isn't available from any Next.js hook (it never reaches the
  // server) — read it directly on mount client-side only, so SSR output
  // stays hash-free and hydration matches.
  const [hash, setHash] = useState('');
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function updateCoords() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Right-aligns the panel to the trigger's right edge (as on the
      // desktop header, where the trigger sits near the viewport's own
      // right edge) — but clamped so that on a narrow viewport with the
      // trigger near the LEFT edge (the mobile menu panel), the fixed
      // PANEL_WIDTH never pushes the panel's left edge off-screen.
      const left = Math.min(
        Math.max(8, rect.right - PANEL_WIDTH),
        window.innerWidth - PANEL_WIDTH - 8
      );
      setCoords({ top: rect.bottom + 8, left });
    }
    updateCoords();

    function onPointerDown(event: MouseEvent) {
      if (
        !rootRef.current?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-language-switcher-panel]')
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    // Closes rather than re-tracks on scroll/resize — simpler than keeping
    // a floating panel glued to its trigger through every scroll frame,
    // and a brief dropdown like this one is cheap to just reopen.
    function onDismiss() {
      setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onDismiss);
    window.addEventListener('scroll', onDismiss, { capture: true, passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onDismiss);
      window.removeEventListener('scroll', onDismiss, { capture: true });
    };
  }, [open]);

  // strip the leading locale segment and any trailing slash;
  // '/id/entitas' -> '/entitas', '/id' -> '', '/id/' -> ''
  const rest = pathname.replace(/^\/[^/]+/, '').replace(/\/$/, '');
  const query = searchParams?.toString();
  const suffix = `${query ? `?${query}` : ''}${hash}`;

  const active = LANGUAGES.find((lang) => lang.code === locale) ?? LANGUAGES[0];

  // Portalled to <body> and positioned `fixed` from the trigger's measured
  // rect, rather than an `absolute` child of this <nav> — this component
  // also renders inside the mobile menu panel, which is its own scrollable,
  // clipped container (`overflow-y-auto`, see header-mobile-nav.tsx); an
  // absolutely-positioned child there gets silently clipped at the panel's
  // own edge no matter its z-index. Escaping to <body> sidesteps that
  // ancestor entirely, in both this and the (unclipped) desktop header.
  const panel =
    mounted && open
      ? createPortal(
          <ul
            role="listbox"
            aria-label={t.nav.pilihBahasa}
            data-language-switcher-panel
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[9999] w-56 overflow-hidden rounded-[14px] border border-stone bg-white py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.14)]"
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === locale;
              return (
                <li key={lang.code} role="none">
                  <Link
                    href={`/${lang.code}${rest}${suffix}`}
                    role="option"
                    aria-selected={isActive}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-small transition-colors motion-reduce:transition-none ${
                      isActive ? 'bg-forest/[0.06] font-semibold text-ink' : 'text-ink/80 hover:bg-stone'
                    }`}
                  >
                    <span className="text-[18px] leading-none" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <span className="flex-1">
                      <span className="block">{lang.name}</span>
                      <span className="block text-[11px] uppercase tracking-[0.08em] text-slate">{lang.code}</span>
                    </span>
                    {isActive ? <Check className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>,
          document.body
        )
      : null;

  return (
    <nav ref={rootRef} aria-label={t.nav.pilihBahasa} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.pilihBahasa}
        onClick={() => setOpen((v) => !v)}
        className="tap-target flex items-center gap-1.5 rounded-full border border-pine-ink/10 px-3 py-1.5 font-mono text-label text-pine-ink/80 transition-colors hover:text-pine-ink group-data-[overlay]/hdr:border-canvas/40 group-data-[overlay]/hdr:text-canvas/90 group-data-[overlay]/hdr:drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] group-data-[overlay]/hdr:hover:text-canvas motion-reduce:transition-none"
      >
        <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{active.flag}</span>
        <span className="uppercase tracking-[0.08em]">{CODE_LABEL[active.code]}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {panel}
    </nav>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { NavigationNode } from '@/lib/cms/navigation';
import { navigationLabel } from '@/lib/cms/navigation-label';
import { messagesFor } from '@/i18n/messages';
import { LanguageSwitcher } from './language-switcher';

const EASE = [0.16, 1, 0.3, 1] as const;
const DESKTOP_MIN_WIDTH = 768;

function hrefFor(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url === '/' ? '' : url}`;
}

/**
 * Mobile navigation for the header, shown below md. The toggle is an icon-only
 * hamburger that becomes an X while open. The panel holds the same CMS
 * navigation the desktop bar uses, so the two cannot drift apart. Items with
 * children get an accordion: the label keeps its own link (when it has a real
 * URL) and a separate chevron button expands the submenu.
 *
 * The panel is portalled to <body>. The header sets `data-overlay`, which turns
 * every header child light for the transparent-over-hero state. A panel inside
 * the header would inherit that and render its light text on a light
 * background. Outside the header it keeps the normal colours.
 */
export function MobileNav({ locale, items }: { locale: string; items: readonly NavigationNode[] }) {
  const t = messagesFor(locale);
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    function onResize() {
      // Crossing into the desktop layout closes the panel, so it never stays
      // open over the desktop header.
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }
    // The panel opens directly under the header bar, whatever its real height.
    const header = toggleRef.current?.closest('header');
    setPanelTop(header ? header.getBoundingClientRect().bottom : 0);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  const panel = (
    <motion.div
      ref={panelRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
      style={{ top: panelTop, maxHeight: `calc(100dvh - ${panelTop}px)` }}
      className="fixed inset-x-0 z-[9998] flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain border-b border-[#E5E7EB] bg-canvas font-landing-body shadow-[0_8px_24px_rgba(11,43,34,0.08)] md:hidden"
    >
      <nav id="mobile-nav-menu" aria-label={t.nav.mobile} className="px-6 pb-4 pt-2">
        <ul>
          {items.map((item) => (
            <MobileNavItem
              key={item.id}
              item={item}
              locale={locale}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
              onNavigate={closeMenu}
            />
          ))}
        </ul>
      </nav>
      <div className="border-t border-[#E5E7EB] px-6 py-4">
        <LanguageSwitcher locale={locale} />
      </div>
    </motion.div>
  );

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? t.nav.tutup : t.nav.menu}
        className="inline-flex h-11 w-11 items-center justify-center text-pine-ink transition-colors group-data-[overlay]/hdr:text-canvas group-data-[overlay]/hdr:drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] motion-reduce:transition-none"
      >
        <span className="relative block h-[14px] w-[22px]" aria-hidden="true">
          <span
            className={`absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] block h-[2px] w-full rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 block h-[2px] w-full rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${
              open ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </span>
      </button>
      {mounted && open ? createPortal(panel, document.body) : null}
    </div>
  );
}

function MobileNavItem({
  item,
  locale,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavigationNode;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const label = navigationLabel(item, locale);
  const rowClass =
    'flex min-h-[44px] flex-1 items-center break-words py-2 text-[16px] font-semibold leading-snug text-[#2A7793] transition-colors hover:text-[#01B3A1] motion-reduce:transition-none';

  if (item.children.length === 0) {
    return (
      <li className="border-b border-[#E5E7EB] last:border-b-0">
        <Link
          href={hrefFor(item.url, locale)}
          target={item.open_new_tab ? '_blank' : undefined}
          rel={item.open_new_tab ? 'noreferrer' : undefined}
          className={rowClass}
          onClick={onNavigate}
        >
          {label}
        </Link>
      </li>
    );
  }

  const subId = `mobile-sub-${item.id}`;
  const hasOwnUrl = item.url !== '' && item.url !== '#';

  return (
    <li className="border-b border-[#E5E7EB] last:border-b-0">
      <div className="flex items-stretch">
        {hasOwnUrl ? (
          <Link
            href={hrefFor(item.url, locale)}
            target={item.open_new_tab ? '_blank' : undefined}
            rel={item.open_new_tab ? 'noreferrer' : undefined}
            className={rowClass}
            onClick={onNavigate}
          >
            {label}
          </Link>
        ) : (
          <button type="button" onClick={onToggle} aria-expanded={expanded} className={`${rowClass} text-left`}>
            {label}
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={subId}
          aria-label={label}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#666666] transition-colors hover:text-[#01B3A1] motion-reduce:transition-none"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        id={subId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <ul className="min-h-0 overflow-hidden border-l border-[#E5E7EB] pl-4">
          {item.children.map((child) => (
            <li key={child.id}>
              <Link
                href={hrefFor(child.url, locale)}
                target={child.open_new_tab ? '_blank' : undefined}
                rel={child.open_new_tab ? 'noreferrer' : undefined}
                className="flex min-h-[44px] items-center break-words py-2 text-[15px] leading-snug text-[#444444] transition-colors hover:text-[#01B3A1] motion-reduce:transition-none"
                onClick={onNavigate}
              >
                {navigationLabel(child, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

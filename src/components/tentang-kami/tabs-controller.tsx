'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TentangKamiSubNav } from './sub-nav';

export function TentangKamiTabsClient({
  locale,
  initialTab = 'sejarah',
  tabs,
}: {
  locale: string;
  initialTab?: string;
  tabs: Record<string, ReactNode>;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Support browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && tabs[lastSegment]) {
        setActiveTab(lastSegment);
      } else if (path.endsWith('/tentang-kami') || path.endsWith('/tentang-kami/')) {
        setActiveTab('sejarah');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [tabs]);

  const handleSelectTab = (slug: string) => {
    if (slug === activeTab) return;
    setActiveTab(slug);

    // Update URL shallowly without page reload
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: slug }, '', `/${locale}/tentang-kami/${slug}`);
    }

    // If user is scrolled down past the hero, smoothly align content under
    // the sticky tabs — with a deliberate safe-spacing buffer so the tabs
    // land just short of "stuck" instead of flush against the header, which
    // otherwise leaves the new tab's own content starting right at the
    // header+tabs boundary with zero margin for error.
    if (containerRef.current) {
      const header = document.querySelector('header');
      const headerH = header ? header.offsetHeight : (window.innerWidth >= 768 ? 92 : 84);
      const SAFE_SPACING = 16;
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const containerTop = currentScrollY + containerRect.top;
      const targetScrollY = containerTop - headerH - SAFE_SPACING;

      if (currentScrollY > targetScrollY) {
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <TentangKamiSubNav
        locale={locale}
        activeSlug={activeTab}
        onSelectTab={handleSelectTab}
      />

      <div className="relative w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

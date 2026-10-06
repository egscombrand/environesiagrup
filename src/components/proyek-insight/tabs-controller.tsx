'use client';

import type { ReactNode } from 'react';
import { ProyekInsightHero } from './hero';
import { ProyekInsightIntroSection } from './intro-section';
import { ProyekInsightStatsSection } from './stats-section';
import { ProyekInsightSubNav } from './sub-nav';

/**
 * Each tab is its own route (/proyek-insight/<tab>) and renders only its own
 * content. The active tab comes from the route, so the tab bar always marks
 * where the user is, and switching tabs is a normal page navigation that
 * starts at the top of the new route.
 */
export function ProyekInsightTabsClient({
  locale,
  initialTab = 'portofolio-proyek',
  tabs,
}: {
  locale: string;
  initialTab?: string;
  tabs: Record<string, ReactNode>;
}) {
  return (
    <div className="relative w-full">
      <ProyekInsightHero activeSlug={initialTab} />

      <ProyekInsightIntroSection />

      <ProyekInsightStatsSection />

      <ProyekInsightSubNav locale={locale} activeSlug={initialTab} />

      <div className="relative w-full">{tabs[initialTab]}</div>
    </div>
  );
}

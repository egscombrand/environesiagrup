'use client';

import { DynamicIcon as LucideDynamicIcon, type IconName } from 'lucide-react/dynamic';
import { BarChart3, type LucideProps } from 'lucide-react';

/**
 * Renders a lucide icon by name (as stored in the CMS — kebab-case, e.g.
 * "leaf", "graduation-cap"). Never crashes on a missing/invalid/empty name:
 * falls back to a neutral BarChart3 rather than throwing or rendering
 * nothing, since this always renders in a content layout that expects an
 * icon-shaped space. Content editors pick names through IconPicker, which
 * only offers valid ones — this fallback exists for old free-text values,
 * icons renamed upstream by lucide, or a still-empty field.
 */
export function DynamicIcon({ name, ...props }: { name?: string | null } & Omit<LucideProps, 'ref' | 'name'>) {
  if (!name) return <BarChart3 {...props} aria-hidden="true" />;

  return (
    <LucideDynamicIcon
      name={name as IconName}
      fallback={() => <BarChart3 {...props} aria-hidden="true" />}
      aria-hidden="true"
      {...props}
    />
  );
}

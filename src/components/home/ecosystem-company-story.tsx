'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { Entity } from '@/lib/cms/entities';
import type { StoryScene } from '@/lib/cms/story-scenes';
import { EcosystemCompanyVisual } from './ecosystem-company-visual';

export type EcosystemCompanyStoryCopy = {
  backLabel: string;
  closeLabel: string;
  profileLabel: string;
  companyPreviousLabel: string;
  companyNextLabel: string;
  scenePreviousLabel: string;
  sceneNextLabel: string;
};

const TEXT_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };

/**
 * The multi-scene "company story" — replaces the old single-paragraph
 * detail overlay. Scene navigation (Sebelumnya/Lanjut + "0X / 0Y") is
 * separate from company-to-company navigation (the existing Previous/Next
 * company controls) — switching company always resets to scene 1, since
 * this component is remounted per company (keyed by entity.id at the call
 * site), so local scene state naturally starts fresh. A company with no
 * authored scenes yet falls back to a single implicit scene built from its
 * short_description rather than an empty story.
 */
// Matches src/components/layout/nav-item.tsx's own `href()` — the profile
// URL comes from a navigation item's `url` (never locale-prefixed in the
// database, same as every other nav link), so it needs the same treatment
// here as it gets when the header renders that same URL.
function localeHref(url: string, locale: string) {
  return url.startsWith('http') ? url : `/${locale}${url === '/' ? '' : url}`;
}

export function EcosystemCompanyStory({
  entity,
  scenes,
  locale,
  copy,
  hasMultipleCompanies,
  companyIndex,
  companyTotal,
  shouldReduceMotion,
  origin,
  profileUrl,
  onClose,
  onNextCompany,
  onPreviousCompany,
}: {
  entity: Entity;
  scenes: StoryScene[];
  locale: string;
  copy: EcosystemCompanyStoryCopy;
  hasMultipleCompanies: boolean;
  companyIndex: number;
  companyTotal: number;
  shouldReduceMotion: boolean;
  /** The clicked composition node's on-screen center, so the panel can grow from that exact point instead of a plain centered scale. */
  origin?: { x: number; y: number };
  /**
   * This company's profile destination — resolved by the caller from
   * WP-Admin → Navigation (the entity's `slug` matched against a published
   * navigation item's own Slug field), never computed or hardcoded here.
   * Absent when no navigation item links to this entity yet — the CTA
   * simply doesn't render rather than pointing anywhere wrong.
   */
  profileUrl?: string;
  onClose: () => void;
  onNextCompany: () => void;
  onPreviousCompany: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const displayScenes: StoryScene[] =
    scenes.length > 0
      ? scenes
      : [
          {
            id: `${entity.id}-fallback`,
            entity_id: entity.id,
            sort_order: 0,
            headline: null,
            description: entity.short_description,
            image_path: null,
            imageUrl: undefined,
            cta_label: null,
            cta_url: null,
            status: 'published',
            created_at: '',
            updated_at: '',
          },
        ];
  const totalScenes = displayScenes.length;
  const scene = displayScenes[Math.min(sceneIndex, totalScenes - 1)];

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function goToScene(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= totalScenes) return;
    setDirection(nextIndex > sceneIndex ? 1 : -1);
    setSceneIndex(nextIndex);
  }

  const accent = entity.accent_color ?? '#0FA96B';

  // A circular iris grows from the exact composition node the user clicked,
  // rather than a plain centered fade — this is the "transformative
  // transition" from the ecosystem composition into the company experience.
  // `clip-path`'s `at <x> <y>` is relative to this scrim's own box, and
  // since the scrim is `fixed inset-0` its box origin already equals the
  // viewport's, so the node's raw viewport coordinates need no conversion.
  const originClip = origin ? `circle(0% at ${origin.x}px ${origin.y}px)` : 'circle(150% at 50% 50%)';
  const revealedClip = origin ? `circle(150% at ${origin.x}px ${origin.y}px)` : 'circle(150% at 50% 50%)';

  return createPortal(
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, clipPath: originClip }}
      animate={{ opacity: 1, clipPath: revealedClip }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: originClip }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-pine-ink/70 p-4 backdrop-blur-sm md:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid w-full max-w-5xl gap-8 overflow-hidden rounded-[14px] bg-canvas p-6 md:grid-cols-2 md:p-10"
        style={{ boxShadow: `0 40px 120px -20px ${accent}55` }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={copy.closeLabel}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-canvas/90 text-pine-ink hover:bg-sage-mist"
        >
          ×
        </button>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] md:aspect-auto">
          <AnimatePresence initial={false}>
            <motion.div
              key={scene.id}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, scale: 1.04, x: direction > 0 ? 32 : -32 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: direction > 0 ? -32 : 32 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <EcosystemCompanyVisual
                entity={entity}
                variant="focus"
                className="h-full w-full"
                priority
                imageOverrideUrl={scene.imageUrl}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-pine-ink/40">
            {String(companyIndex + 1).padStart(2, '0')} / {String(companyTotal).padStart(2, '0')}
          </p>
          {entity.tagline ? (
            <p className="mt-2 font-mono text-label uppercase tracking-[0.06em] text-pine-ink/50">{entity.tagline}</p>
          ) : null}
          <h3 id={headingId} className="mt-2 font-landing-display text-display text-pine-ink">
            {entity.name}
          </h3>

          <AnimatePresence initial={false}>
            <motion.div
              key={scene.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8 }}
              transition={TEXT_TRANSITION}
              className="mt-4"
            >
              {scene.headline ? (
                <p className="font-landing-display text-h3 text-pine-ink">{scene.headline}</p>
              ) : null}
              {scene.description ? (
                <p className="mt-2 font-landing-body text-body text-pine-ink/80">{scene.description}</p>
              ) : null}
              {scene.cta_label && scene.cta_url ? (
                <Link
                  href={scene.cta_url}
                  className="mt-4 inline-flex w-fit items-center gap-1 text-small font-medium text-emerald-pulse"
                >
                  {scene.cta_label} →
                </Link>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {totalScenes > 1 ? (
            <div className="mt-6 flex items-center gap-6">
              <button
                type="button"
                onClick={() => goToScene(sceneIndex - 1)}
                disabled={sceneIndex === 0}
                className="text-small font-medium text-pine-ink/70 hover:text-pine-ink disabled:pointer-events-none disabled:opacity-30"
              >
                ← {copy.scenePreviousLabel}
              </button>
              <span className="font-mono text-label uppercase tracking-[0.06em] text-pine-ink/40">
                {String(sceneIndex + 1).padStart(2, '0')} / {String(totalScenes).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => goToScene(sceneIndex + 1)}
                disabled={sceneIndex === totalScenes - 1}
                className="text-small font-medium text-emerald-pulse disabled:pointer-events-none disabled:opacity-30"
              >
                {copy.sceneNextLabel} →
              </button>
            </div>
          ) : null}

          {profileUrl ? (
            <Link
              href={localeHref(profileUrl, locale)}
              className="mt-6 inline-flex w-fit items-center gap-1 text-small font-medium text-emerald-pulse"
            >
              {copy.profileLabel} →
            </Link>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex w-fit items-center gap-1 text-small font-medium text-pine-ink/60 hover:text-pine-ink"
          >
            ← {copy.backLabel}
          </button>

          {hasMultipleCompanies ? (
            <div className="mt-4 flex items-center gap-6 border-t border-sage-mist pt-4">
              <button type="button" onClick={onPreviousCompany} className="text-small text-pine-ink/60 hover:text-pine-ink">
                ← {copy.companyPreviousLabel}
              </button>
              <button type="button" onClick={onNextCompany} className="text-small text-pine-ink/60 hover:text-pine-ink">
                {copy.companyNextLabel} →
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

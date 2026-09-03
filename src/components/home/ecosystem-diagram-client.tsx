'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Entity } from '@/lib/cms/entities';
import type { StoryScene } from '@/lib/cms/story-scenes';
import { nextEntity, previousEntity, spellCount } from '@/lib/ecosystem-discovery';
import { EcosystemOpening } from './ecosystem-opening';
import { EcosystemProgressiveReveal } from './ecosystem-progressive-reveal';
import { EcosystemCompanyIntro } from './ecosystem-company-intro';
import { EcosystemComposition, type CompositionOrigin } from './ecosystem-composition';
import { EcosystemCompanyStory } from './ecosystem-company-story';

export type EcosystemDiscoveryCopy = {
  /** e.g. "Mempersembahkan…" */
  presentingLabel: string;
  openingHeading: string;
  openingStatement1: string;
  openingStatement2: string;
  /** e.g. "Lanjut" — the overture's single click. */
  continueLabel: string;
  /** e.g. "Lewati" — jumps straight from the automatic reveal/intro to the full composition. */
  skipLabel: string;
  discoveryIntro1: string;
  discoveryIntro2: string;
  /** e.g. "Kenali {name}" — `{name}` is substituted per entity. */
  exploreLabelTemplate: string;
  /** e.g. "Lihat Profil {name}" — `{name}` is substituted per entity. */
  profileLabelTemplate: string;
  backLabel: string;
  closeLabel: string;
  companyPreviousLabel: string;
  companyNextLabel: string;
  scenePreviousLabel: string;
  sceneNextLabel: string;
  /** e.g. "{count} Perusahaan.\nKeahlian yang Berbeda.\nSatu Ecosystem." */
  closingHeadingTemplate: string;
  closingSubtext: string;
  closingCtaLabel: string;
};

type Phase = 'intro' | 'reveal' | 'companies' | 'ecosystem';

/**
 * Orchestrates the section as a single-click-then-automatic cinematic
 * sequence: one click past the brand overture, then a four-beat "who we
 * are" reveal and a one-at-a-time company introduction both play on their
 * own (each with its own reading time and a small "Skip" escape hatch),
 * before the full ecosystem composition opens up (the group's mark
 * anchoring the center, every company forming an asymmetric mosaic around
 * it — no card deck). Selecting a company dims its siblings and grows a
 * "company story" from the exact point clicked. Generic over
 * `entities`/`scenesByEntity` — an admin adding a 6th company or editing a
 * story's scenes changes nothing here.
 */
export function EcosystemDiagramClient({
  entities,
  scenesByEntity,
  companyUrlsBySlug,
  locale,
  siteName,
  logoUrl,
  copy,
  stepDurationMs,
}: {
  entities: Entity[];
  scenesByEntity: Record<string, StoryScene[]>;
  /** Each entity's `slug` mapped to its profile URL, as set on the matching item in WP-Admin → Navigation. */
  companyUrlsBySlug: Record<string, string>;
  locale: string;
  siteName: string;
  logoUrl?: string;
  copy: EcosystemDiscoveryCopy;
  /** Test-only override for the reveal/company-intro auto-advance pacing. */
  stepDurationMs?: number;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<CompositionOrigin | undefined>(undefined);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ecosystemTopRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousSelectedIdRef = useRef<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Return focus to the node that opened the story once it closes —
  // deferred to an effect so it runs after the composition's `inert`
  // attribute has actually been removed from the DOM (inert elements can't
  // take focus).
  useEffect(() => {
    if (selectedId) {
      previousSelectedIdRef.current = selectedId;
    } else if (previousSelectedIdRef.current) {
      cardRefs.current.get(previousSelectedIdRef.current)?.focus();
      previousSelectedIdRef.current = null;
    }
  }, [selectedId]);

  const selectedEntity = selectedId ? entities.find((entity) => entity.id === selectedId) : undefined;

  const revealLines = [...copy.openingStatement1.split('\n'), ...copy.openingStatement2.split('\n')]
    .map((line) => line.trim())
    .filter(Boolean);

  const closingLines = copy.closingHeadingTemplate
    .replace('{count}', spellCount(entities.length, locale))
    .split('\n')
    .filter(Boolean);

  function handleOpen(entityId: string, nodeOrigin: CompositionOrigin) {
    setOrigin(nodeOrigin);
    setSelectedId(entityId);
  }

  return (
    <div ref={containerRef} data-in-view={isInView}>
      <AnimatePresence>
        {phase === 'intro' ? (
          <EcosystemOpening
            key="intro"
            presentingLabel={copy.presentingLabel}
            heading={copy.openingHeading}
            continueLabel={copy.continueLabel}
            logoUrl={logoUrl}
            siteName={siteName}
            entities={entities}
            onComplete={() => setPhase('reveal')}
          />
        ) : phase === 'reveal' ? (
          <EcosystemProgressiveReveal
            key="reveal"
            lines={revealLines}
            entities={entities}
            logoUrl={logoUrl}
            siteName={siteName}
            skipLabel={copy.skipLabel}
            onComplete={() => setPhase('companies')}
            onSkip={() => setPhase('ecosystem')}
            {...(stepDurationMs !== undefined ? { stepDurationMs } : {})}
          />
        ) : phase === 'companies' ? (
          <EcosystemCompanyIntro
            key="companies"
            entities={entities}
            skipLabel={copy.skipLabel}
            onComplete={() => setPhase('ecosystem')}
            onSkip={() => setPhase('ecosystem')}
            {...(stepDurationMs !== undefined ? { stepDurationMs } : {})}
          />
        ) : (
          <motion.div
            key="ecosystem"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div ref={ecosystemTopRef} className="scroll-mt-24">
              <p className="font-landing-display text-h3 text-pine-ink">{copy.discoveryIntro1}</p>
              <p className="mt-2 font-landing-display text-h3 text-pine-ink/70">{copy.discoveryIntro2}</p>
            </div>

            <div className="mt-8">
              <EcosystemComposition
                entities={entities}
                selectedId={selectedId}
                shouldReduceMotion={shouldReduceMotion}
                exploreLabelTemplate={copy.exploreLabelTemplate}
                siteName={siteName}
                logoUrl={logoUrl}
                onOpen={handleOpen}
                registerCardRef={(entityId, el) => {
                  if (el) cardRefs.current.set(entityId, el);
                  else cardRefs.current.delete(entityId);
                }}
              />
            </div>

            <div className="mt-12 max-w-xl border-t border-sage-mist pt-8">
              {closingLines.map((line) => (
                <p key={line} className="font-landing-display text-h3 text-pine-ink">
                  {line}
                </p>
              ))}
              <p className="mt-3 font-landing-body text-body text-pine-ink/70">{copy.closingSubtext}</p>
              <button
                type="button"
                onClick={() => ecosystemTopRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })}
                className="mt-4 inline-flex items-center gap-1 text-small font-medium text-emerald-pulse"
              >
                {copy.closingCtaLabel} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEntity ? (
          <EcosystemCompanyStory
            key={selectedEntity.id}
            entity={selectedEntity}
            scenes={scenesByEntity[selectedEntity.id] ?? []}
            locale={locale}
            profileUrl={companyUrlsBySlug[selectedEntity.slug]}
            copy={{
              backLabel: copy.backLabel,
              closeLabel: copy.closeLabel,
              profileLabel: copy.profileLabelTemplate.replace('{name}', selectedEntity.name),
              companyPreviousLabel: copy.companyPreviousLabel,
              companyNextLabel: copy.companyNextLabel,
              scenePreviousLabel: copy.scenePreviousLabel,
              sceneNextLabel: copy.sceneNextLabel,
            }}
            hasMultipleCompanies={entities.length > 1}
            companyIndex={entities.findIndex((entity) => entity.id === selectedEntity.id)}
            companyTotal={entities.length}
            shouldReduceMotion={shouldReduceMotion}
            origin={origin}
            onClose={() => setSelectedId(null)}
            onNextCompany={() => setSelectedId(nextEntity(entities, selectedEntity.id).id)}
            onPreviousCompany={() => setSelectedId(previousEntity(entities, selectedEntity.id).id)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

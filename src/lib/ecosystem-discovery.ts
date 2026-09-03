// Pure helpers for Section 02's opening → discovery → selected flow — no
// React, no DOM. Circular next/previous over the CMS-ordered entity list,
// adaptive to any count with zero per-entity conditionals.
import type { Entity } from './cms/entities';

export type DiscoveryPhase =
  | { kind: 'opening' }
  | { kind: 'discovery' }
  | { kind: 'selected'; entityId: string };

function indexOf(entities: Entity[], entityId: string): number {
  return entities.findIndex((entity) => entity.id === entityId);
}

/** The entity after `entityId`, wrapping around to the first. Falls back to
 * the first entity if `entityId` is stale (e.g. removed by the CMS mid-session). */
export function nextEntity(entities: Entity[], entityId: string): Entity {
  const index = indexOf(entities, entityId);
  if (index === -1) return entities[0];
  return entities[(index + 1) % entities.length];
}

/** The entity before `entityId`, wrapping around to the last. */
export function previousEntity(entities: Entity[], entityId: string): Entity {
  const index = indexOf(entities, entityId);
  if (index === -1) return entities[0];
  return entities[(index - 1 + entities.length) % entities.length];
}

export function getEntity(entities: Entity[], entityId: string): Entity | undefined {
  return entities.find((entity) => entity.id === entityId);
}

const COUNT_WORDS: Record<string, string[]> = {
  id: ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'],
  en: ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
  zh: ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
};

/** Spells out small counts ("Lima" for 5) so closing copy reads naturally
 * for the current 5-entity ecosystem while staying correct — not stuck at
 * "Lima" — if an admin adds more; falls back to the numeral beyond ten. */
export function spellCount(count: number, locale: string): string {
  const words = COUNT_WORDS[locale] ?? COUNT_WORDS.en;
  return words[count] || String(count);
}

// Pure logic for the PDF Import review table — deliberately no 'use client'
// or React import, so it stays trivially unit-testable without rendering
// the wizard component, the same way pdf-rule-engine.ts is kept separate
// from pdf-import.ts.
import { SECTOR_VALUES } from '@/lib/admin/project-options';
import type { ReviewCandidate } from '@/app/wp-admin/(protected)/content/projects/import/actions';

export type EditableCandidate = {
  key: string;
  selected: boolean;
  project_name: string;
  client: string;
  sector: string;
  location: string;
  year: string;
  service: string;
  brand: string;
  description: string;
  source_page: number | null;
  confidence: 'high' | 'medium' | 'low';
  possibleDuplicateOf: { id: string; title: string } | null;
};

export function toEditable(c: ReviewCandidate, index: number): EditableCandidate {
  const sector = (SECTOR_VALUES as readonly string[]).includes(c.sector ?? '') ? (c.sector as string) : '';
  const row: EditableCandidate = {
    key: `${index}-${c.project_name}`,
    selected: false,
    project_name: c.project_name ?? '',
    client: c.client ?? '',
    sector,
    location: c.location ?? '',
    year: c.year ? String(c.year) : '',
    service: c.service ?? '',
    brand: c.brand ?? 'Environesia',
    description: c.description ?? '',
    source_page: c.source_page,
    confidence: c.confidence,
    possibleDuplicateOf: c.possibleDuplicateOf,
  };
  // A clean, complete, non-duplicate row is pre-selected; anything that
  // needs a second look is left unchecked by default — but never disabled.
  // "Need review" only ever means "worth a glance before importing," never
  // "cannot be imported": an incomplete project is still a real project,
  // and the admin can always import it as Draft and fill in the rest later.
  row.selected = isRowValid(row) && !needsReview(row) && !row.possibleDuplicateOf;
  return row;
}

/** The one true requirement to import a row at all: it has to have a name. Everything else may be missing. */
export function isRowValid(row: EditableCandidate): boolean {
  return Boolean(row.project_name.trim());
}

/** "Need review" per the spec: missing data, an unresolved sector, or low confidence — a prompt to double-check, never a block on import. */
export function needsReview(row: EditableCandidate): boolean {
  return !row.client.trim() || !row.location.trim() || !row.sector || row.confidence === 'low';
}

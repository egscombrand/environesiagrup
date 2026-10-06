// Pure duplicate-matching logic for PDF import review — deliberately no
// 'server-only' import (unlike pdf-import.ts, which calls the Anthropic
// API) so this stays trivially unit-testable in jsdom.

export type ExistingProjectForDuplicateCheck = {
  id: string;
  title: string;
  client: string | null;
  city: string | null;
  year: number | null;
};

type DuplicateCandidate = {
  project_name: string;
  client: string | null;
  year: number | null;
};

function normalize(value: string | null | undefined): string {
  return (value ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Deliberately simple, not fuzzy-matching: an exact normalized title match,
 * or a client+year match, is enough to flag "possible duplicate" — the
 * admin reviews and decides (Skip / Import Anyway), this never blocks or
 * auto-merges anything on its own.
 */
export function findPossibleDuplicate(
  candidate: DuplicateCandidate,
  existing: ExistingProjectForDuplicateCheck[]
): ExistingProjectForDuplicateCheck | null {
  const candidateTitle = normalize(candidate.project_name);
  const candidateClient = normalize(candidate.client);

  for (const row of existing) {
    if (candidateTitle && candidateTitle === normalize(row.title)) return row;
    if (candidateClient && candidate.year && candidateClient === normalize(row.client) && candidate.year === row.year) {
      return row;
    }
  }
  return null;
}

import { describe, expect, it, vi } from 'vitest';
import { buildEntities } from './legal';
import { LEGALITAS_ENTITIES } from '@/lib/legalitas-data';

vi.mock('server-only', () => ({}));
// The reader's module imports the Supabase client, which needs env vars. This test only uses the pure mapping.
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: () => ({}) }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

/**
 * Round trip: turn the current hardcoded data into the rows migration 0027 stores,
 * then rebuild the entities from those rows. If the mapping lost or changed
 * anything, this comparison would fail, so the database path cannot drift from
 * the data the site showed before.
 */
describe('legal data round trip (migration 0027 rows → page shape)', () => {
  it('rebuilds exactly the entities the page used to hardcode', () => {
    const entities = LEGALITAS_ENTITIES.map((e, i) => ({
      id: e.id,
      name: e.name,
      short_name: e.shortName,
      legal_name: e.legalName ?? null,
      sort_order: i + 1,
      created_at: '',
      updated_at: '',
    }));

    const cards = LEGALITAS_ENTITIES.flatMap((e) =>
      e.cards.map((c, i) => ({
        id: c.id,
        entity_id: e.id,
        category: c.category,
        logo: c.logo ?? null,
        logo_alt: c.logoAlt,
        title: c.title,
        subtitle: c.subtitle ?? null,
        intro: c.intro ?? [],
        sort_order: i + 1,
        created_at: '',
        updated_at: '',
      }))
    );

    const documents = LEGALITAS_ENTITIES.flatMap((e) =>
      e.cards.flatMap((c) =>
        c.documents.map((d, i) => ({
          id: `${c.id}-doc-${i + 1}`,
          card_id: c.id,
          title: d.title,
          issuer: d.issuer ?? null,
          fields: d.fields,
          description: d.description ?? null,
          document_url: d.documentUrl ?? null,
          document_type: d.documentType ?? null,
          external_url: d.externalUrl ?? null,
          cta_label: d.ctaLabel ?? null,
          sort_order: i + 1,
          created_at: '',
          updated_at: '',
        }))
      )
    );

    // Typed loosely on purpose: the rows above match the table shapes, and this test is about mapping, not types.
    const rebuilt = buildEntities(entities as never, cards as never, documents as never);
    expect(rebuilt).toEqual(LEGALITAS_ENTITIES);
  });
});

describe('legalLogoUrl (via buildEntities)', () => {
  it('keeps a legacy /public path as-is, so a card never breaks before migration 0041 runs', () => {
    const entities = [{ id: 'e1', name: 'E', short_name: 'E', legal_name: null, sort_order: 1, created_at: '', updated_at: '' }];
    const cards = [
      {
        id: 'c1',
        entity_id: 'e1',
        category: 'legalitas',
        logo: '/legalitas/garuda.svg',
        logo_alt: 'Garuda',
        title: 'T',
        subtitle: null,
        intro: [],
        sort_order: 1,
        created_at: '',
        updated_at: '',
      },
    ];
    const rebuilt = buildEntities(entities as never, cards as never, [] as never);
    expect(rebuilt[0].cards[0].logo).toBe('/legalitas/garuda.svg');
  });

  it('resolves a Storage path (migration 0041 run) through publicMediaUrl', () => {
    const entities = [{ id: 'e1', name: 'E', short_name: 'E', legal_name: null, sort_order: 1, created_at: '', updated_at: '' }];
    const cards = [
      {
        id: 'c1',
        entity_id: 'e1',
        category: 'legalitas',
        logo: 'legacy/legalitas/garuda.svg',
        logo_alt: 'Garuda',
        title: 'T',
        subtitle: null,
        intro: [],
        sort_order: 1,
        created_at: '',
        updated_at: '',
      },
    ];
    const rebuilt = buildEntities(entities as never, cards as never, [] as never);
    expect(rebuilt[0].cards[0].logo).toBe('https://media.test/legacy/legalitas/garuda.svg');
  });
});

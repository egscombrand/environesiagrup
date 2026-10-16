import 'server-only';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import type { Database } from '@/lib/supabase/database.types';
import {
  LEGALITAS_ENTITIES,
  type LegalitasCategory,
  type LegalitasEntity,
  type LegalitasField,
} from '@/lib/legalitas-data';

type EntityRow = Database['public']['Tables']['legal_entities']['Row'];
type CardRow = Database['public']['Tables']['legal_cards']['Row'];
type DocumentRow = Database['public']['Tables']['legal_documents']['Row'];

/**
 * Legalitas & Sertifikasi, read from the database (migrations 0027). The shape
 * handed to the UI is the same LegalitasEntity[] the page has always used, so the
 * components don't change.
 *
 * Until migration 0027 is applied, or if the read fails, this returns the
 * original hardcoded list in src/lib/legalitas-data.ts. The page keeps working
 * either way, and nothing is lost in the switch.
 */
export async function getLegalEntities(): Promise<LegalitasEntity[]> {
  try {
    const supabase = createPublicClient();
    const [entities, cards, documents] = await Promise.all([
      supabase.from('legal_entities').select('*').order('sort_order', { ascending: true }),
      supabase.from('legal_cards').select('*').order('sort_order', { ascending: true }),
      supabase.from('legal_documents').select('*').order('sort_order', { ascending: true }),
    ]);
    if (entities.error || cards.error || documents.error) return LEGALITAS_ENTITIES;
    if (!entities.data || entities.data.length === 0) return LEGALITAS_ENTITIES;

    return buildEntities(entities.data, cards.data ?? [], documents.data ?? []);
  } catch {
    return LEGALITAS_ENTITIES;
  }
}

/**
 * A card's logo was seeded (migration 0027) as a raw /public path. Migration
 * 0041 points it at Storage instead. A path starting with "/" is the old
 * /public reference and is used as-is; anything else is a Storage path,
 * resolved the same way as every other *_path column. This keeps every card's
 * logo showing correctly whether or not 0041 has run yet.
 */
function legalLogoUrl(logo: string | null): string | undefined {
  if (!logo) return undefined;
  return logo.startsWith('/') ? logo : (publicMediaUrl(logo) ?? undefined);
}

/** Pure mapping, kept separate so it can be tested without a database. */
export function buildEntities(
  entities: EntityRow[],
  cards: CardRow[],
  documents: DocumentRow[]
): LegalitasEntity[] {
  return entities.map((entity) => ({
    id: entity.id,
    name: entity.name,
    shortName: entity.short_name,
    legalName: entity.legal_name ?? undefined,
    cards: cards
      .filter((card) => card.entity_id === entity.id)
      .map((card) => ({
        id: card.id,
        category: card.category as LegalitasCategory,
        logo: legalLogoUrl(card.logo),
        logoAlt: card.logo_alt,
        title: card.title,
        subtitle: card.subtitle ?? undefined,
        intro: asFields(card.intro),
        documents: documents
          .filter((doc) => doc.card_id === card.id)
          .map((doc) => ({
            title: doc.title,
            issuer: doc.issuer ?? undefined,
            fields: asFields(doc.fields) ?? [],
            description: doc.description ?? undefined,
            documentUrl: doc.document_url ?? undefined,
            documentType: (doc.document_type as 'pdf' | 'image' | null) ?? undefined,
            externalUrl: doc.external_url ?? undefined,
            ctaLabel: doc.cta_label ?? undefined,
          })),
      })),
  }));
}

/** A jsonb list of {label, value}. Empty means "not set", as in the source data. */
function asFields(value: unknown): LegalitasField[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const fields = value.flatMap((raw) => {
    const f = raw as { label?: unknown; value?: unknown };
    return typeof f.label === 'string' && typeof f.value === 'string' ? [{ label: f.label, value: f.value }] : [];
  });
  return fields.length > 0 ? fields : undefined;
}

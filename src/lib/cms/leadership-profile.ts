import 'server-only';
import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';
import {
  DEWAN_DIREKSI_FALLBACK,
  DIREKTUR_PAGE_META,
  DIREKTUR_UTAMA_FALLBACK,
  ENTITAS_GRUP_FALLBACK,
  LEADERSHIP_HEADINGS,
  type EducationEntry,
  type LeadershipPerson,
  type LeadershipProfile,
  type TeachingEntry,
} from '@/lib/cms/leadership-content';

/**
 * Direktur Utama & Dewan Direksi, read from the database: the `leadership` rows
 * (one per person, by role) and the `direktur` page row (the three section
 * headings). For each role, the rows replace the fallback as a whole. A role with
 * no rows keeps its fallback people, so the page is never half empty.
 */

export const DIREKTUR_PAGE_SLUG = 'direktur';

/** A person as the component shows them: URLs resolved, nothing left as a path. */
export type DirectorView = {
  name: string;
  position: string;
  descriptor?: string;
  entity?: string;
  bio: string | null;
  photoSrc: string | null;
  photoSize: { width: number; height: number };
  education: (Omit<EducationEntry, 'logoPath'> & { logo?: string })[];
  experience: string[];
  stats: { value: string; label: string }[];
  contributionLabel?: string;
  contribution: string[];
  teaching: (Omit<TeachingEntry, 'logoPath'> & { logo?: string })[];
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
};

export type DirekturView = {
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  headings: { direkturUtama: string; dewan: string; entitas: { title: string; intro: string } };
  directorUtama: DirectorView;
  dewan: DirectorView[];
  entitas: DirectorView;
};

type Row = Record<string, unknown>;

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function list<T>(raw: unknown, parse: (item: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const parsed = parse(item as Record<string, unknown>);
    return parsed ? [parsed] : [];
  });
}

const url = (path: unknown): string | undefined => {
  const p = text(path);
  return p ? publicMediaUrl(p) : undefined;
};

function viewOf(person: LeadershipPerson, entityName?: string): DirectorView {
  return {
    name: person.name,
    position: person.position,
    descriptor: person.profile.descriptor,
    entity: entityName,
    bio: person.bio,
    photoSrc: publicMediaUrl(person.photoPath) ?? null,
    photoSize: person.photoSize,
    education: person.profile.education.map(({ logoPath, ...rest }) => ({ ...rest, logo: url(logoPath) })),
    experience: person.profile.experience,
    stats: person.profile.stats,
    contributionLabel: person.profile.contributionLabel,
    contribution: person.profile.contribution,
    teaching: person.profile.teaching.map(({ logoPath, ...rest }) => ({ ...rest, logo: url(logoPath) })),
    linkedinUrl: person.profile.linkedinUrl,
    instagramUrl: person.profile.instagramUrl,
    email: person.profile.email,
  };
}

/** One leadership row, as a person. Null when the row has no name or no photo path. */
export function personFromRow(row: Row): LeadershipPerson | null {
  const name = text(row.name);
  const position = text(row.position);
  const photoPath = text(row.photo_path);
  if (!name || !position || !photoPath) return null;
  const raw = (row.profile ?? {}) as Record<string, unknown>;
  const photo = (raw.photo ?? {}) as { width?: unknown; height?: unknown };
  const profile: LeadershipProfile = {
    descriptor: text(raw.descriptor) || undefined,
    education: list(raw.education, (item) => {
      const level = text(item.level);
      const institution = text(item.institution);
      if (!level || !institution) return null;
      return {
        level,
        institution,
        degree: text(item.degree) || undefined,
        scholarship: text(item.scholarship) || undefined,
        note: text(item.note) || undefined,
        logoPath: text(item.logoPath) || undefined,
      };
    }),
    experience: list(raw.experience, (item) => text(item) || null),
    stats: list(raw.stats, (item) => (text(item.value) && text(item.label) ? { value: text(item.value), label: text(item.label) } : null)),
    contributionLabel: text(raw.contributionLabel) || undefined,
    contribution: list(raw.contribution, (item) => text(item) || null),
    teaching: list(raw.teaching, (item) => {
      const institution = text(item.institution);
      const program = text(item.program);
      if (!institution || !program) return null;
      return { institution, program, description: text(item.description), logoPath: text(item.logoPath) || undefined };
    }),
    linkedinUrl: text(raw.linkedinUrl) || undefined,
    instagramUrl: text(raw.instagramUrl) || undefined,
    email: text(raw.email) || undefined,
  };
  return {
    slug: text(row.slug),
    name,
    position,
    role: (text(row.type) as LeadershipPerson['role']) || 'direksi',
    photoPath,
    photoSize: {
      width: typeof photo.width === 'number' ? photo.width : 801,
      height: typeof photo.height === 'number' ? photo.height : 1426,
    },
    bio: text(row.bio) || null,
    profile,
  };
}

/** Pure, so the rules can be tested without a database. */
export function buildDirektur(
  people: Row[],
  entityNames: Map<string, string>,
  page: Row | null
): DirekturView {
  const parsed = people.map((row) => ({ row, person: personFromRow(row) })).filter((x): x is { row: Row; person: LeadershipPerson } => x.person !== null);
  const byRole = (role: LeadershipPerson['role']) => parsed.filter((x) => x.person.role === role);

  const directorRows = byRole('direktur_utama');
  const dewanRows = byRole('direksi');
  const entitasRows = byRole('entitas_grup');

  const directorUtama = directorRows.length > 0 ? viewOf(directorRows[0].person, entityLabel(directorRows[0].row, entityNames)) : viewOf(DIREKTUR_UTAMA_FALLBACK);
  const dewan = dewanRows.length > 0 ? dewanRows.map((x) => viewOf(x.person, entityLabel(x.row, entityNames))) : DEWAN_DIREKSI_FALLBACK.map((p) => viewOf(p));
  // Matches the entities table's current name for this entity ("Bikin Indonesia
  // Berdaya", no "PT" prefix, consistent with every other entity's display
  // name there), used only when the database is unreachable and the seeded
  // leadership rows are also missing.
  const entitas =
    entitasRows.length > 0
      ? viewOf(entitasRows[0].person, entityLabel(entitasRows[0].row, entityNames))
      : viewOf(ENTITAS_GRUP_FALLBACK, 'Bikin Indonesia Berdaya');

  const items = Array.isArray(page?.items) ? (page.items as { title?: unknown; description?: unknown }[]) : [];
  const headingsOk = items.length === 3 && items.every((item) => text(item.title));
  const fb = LEADERSHIP_HEADINGS;
  const headings = headingsOk
    ? {
        direkturUtama: text(items[0].title),
        dewan: text(items[1].title),
        entitas: { title: text(items[2].title), intro: text(items[2].description) },
      }
    : { direkturUtama: fb.direkturUtama, dewan: fb.dewan, entitas: { ...fb.entitas } };

  return {
    pageTitle: text(page?.title) || DIREKTUR_PAGE_META.title,
    metaTitle: text(page?.meta_title) || DIREKTUR_PAGE_META.metaTitle,
    metaDescription: text(page?.meta_description) || DIREKTUR_PAGE_META.metaDescription,
    headings,
    directorUtama,
    dewan,
    entitas,
  };
}

function entityLabel(row: Row, entityNames: Map<string, string>): string | undefined {
  const id = text(row.entity_id);
  return id ? entityNames.get(id) : undefined;
}

export const getDirektur = cache(async (): Promise<DirekturView> => {
  try {
    const supabase = createPublicClient();
    const [people, page] = await Promise.all([
      supabase.from('leadership').select('*').eq('status', 'published').order('sort_order', { ascending: true }),
      supabase.from('page_content').select('*').eq('slug', DIREKTUR_PAGE_SLUG).maybeSingle(),
    ]);
    if (people.error || page.error) return buildDirektur([], new Map(), null);

    const rows = (people.data ?? []) as Row[];
    const entityIds = [...new Set(rows.map((r) => text(r.entity_id)).filter(Boolean))];
    const entityNames = new Map<string, string>();
    if (entityIds.length > 0) {
      const { data } = await supabase.from('entities').select('id, name').in('id', entityIds);
      for (const entity of data ?? []) entityNames.set(entity.id, entity.name);
    }
    return buildDirektur(rows, entityNames, (page.data as Row | null) ?? null);
  } catch {
    return buildDirektur([], new Map(), null);
  }
});

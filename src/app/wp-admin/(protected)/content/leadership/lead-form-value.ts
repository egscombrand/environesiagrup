import type { LeadershipFormValue } from '@/components/admin/leadership-form';

type Row = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const list = <T,>(v: unknown, f: (item: Record<string, unknown>, i: number) => T): T[] =>
  Array.isArray(v) ? v.flatMap((item, i) => (item && typeof item === 'object' ? [f(item as Record<string, unknown>, i)] : [])) : [];

/** A new person: an empty form, on the Direktur Utama role by default. */
export function emptyLeadershipValue(): LeadershipFormValue {
  return {
    name: '',
    slug: '',
    position: '',
    role: 'direksi',
    status: 'draft',
    sort_order: 0,
    bio: '',
    photo_path: '',
    entity_id: '',
    profile: {
      descriptor: '',
      photo: { width: 801, height: 1426 },
      education: [],
      experience: [],
      stats: [],
      contributionLabel: '',
      contribution: [],
      teaching: [],
      linkedinUrl: '',
      instagramUrl: '',
      email: '',
    },
  };
}

/** A saved person, as the form starts. Each list item gets a stable key for its logo field. */
export function leadershipValueFromRow(row: Row): LeadershipFormValue {
  const profile = (row.profile && typeof row.profile === 'object' ? row.profile : {}) as Row;
  const photo = (profile.photo && typeof profile.photo === 'object' ? profile.photo : {}) as Row;
  return {
    name: str(row.name),
    slug: str(row.slug),
    position: str(row.position),
    role: str(row.type) || 'direksi',
    status: str(row.status) || 'draft',
    sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0,
    bio: str(row.bio),
    photo_path: str(row.photo_path),
    entity_id: str(row.entity_id),
    profile: {
      descriptor: str(profile.descriptor),
      photo: {
        width: typeof photo.width === 'number' ? photo.width : 801,
        height: typeof photo.height === 'number' ? photo.height : 1426,
      },
      education: list(profile.education, (item, i) => ({
        key: `edu-${i}`,
        level: str(item.level),
        institution: str(item.institution),
        degree: str(item.degree),
        scholarship: str(item.scholarship),
        note: str(item.note),
        logoPath: str(item.logoPath),
      })),
      experience: list(profile.experience, (item) => str(item)),
      stats: list(profile.stats, (item) => ({ value: str(item.value), label: str(item.label) })),
      contributionLabel: str(profile.contributionLabel),
      contribution: list(profile.contribution, (item) => str(item)),
      teaching: list(profile.teaching, (item, i) => ({
        key: `tch-${i}`,
        institution: str(item.institution),
        program: str(item.program),
        description: str(item.description),
        logoPath: str(item.logoPath),
      })),
      linkedinUrl: str(profile.linkedinUrl),
      instagramUrl: str(profile.instagramUrl),
      email: str(profile.email),
    },
  };
}

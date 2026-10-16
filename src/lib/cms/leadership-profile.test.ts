import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));
vi.mock('@/lib/cms/media', () => ({
  publicMediaUrl: (path: string | null | undefined) => (path ? `https://media.test/${path}` : undefined),
}));

import { buildDirektur, personFromRow } from './leadership-profile';
import { DEWAN_DIREKSI_FALLBACK, DIREKTUR_UTAMA_FALLBACK, LEADERSHIP_HEADINGS } from './leadership-content';

const row = (overrides: Record<string, unknown> = {}) => ({
  name: 'Orang Uji',
  slug: 'orang-uji',
  position: 'Direktur',
  type: 'direksi',
  photo_path: 'legacy/uji.jpg',
  bio: null,
  entity_id: null,
  status: 'published',
  sort_order: 1,
  profile: { photo: { width: 800, height: 1400 }, education: [], experience: [], stats: [], contribution: [], teaching: [] },
  ...overrides,
});

describe('buildDirektur', () => {
  it('shows the fallback people and headings when there are no rows', () => {
    const view = buildDirektur([], new Map(), null);
    expect(view.directorUtama.name).toBe(DIREKTUR_UTAMA_FALLBACK.name);
    expect(view.dewan).toHaveLength(DEWAN_DIREKSI_FALLBACK.length);
    expect(view.entitas.name).toBe('Fauzan Madani');
    expect(view.headings.dewan).toBe(LEADERSHIP_HEADINGS.dewan);
    expect(view.pageTitle).toBe('Direktur Utama & Dewan Direksi');
  });

  it('replaces the Dewan Direksi as a whole when that role has rows', () => {
    const view = buildDirektur([row({ name: 'Dewan Baru', type: 'direksi' })], new Map(), null);
    expect(view.dewan.map((p) => p.name)).toEqual(['Dewan Baru']);
    expect(view.directorUtama.name).toBe(DIREKTUR_UTAMA_FALLBACK.name);
  });

  it('resolves the entity name for a group-entity leader', () => {
    const view = buildDirektur(
      [row({ name: 'Pimpinan Entitas', type: 'entitas_grup', entity_id: 'e1' })],
      new Map([['e1', 'Bikin Indonesia Berdaya']]),
      null
    );
    expect(view.entitas.name).toBe('Pimpinan Entitas');
    expect(view.entitas.entity).toBe('Bikin Indonesia Berdaya');
  });

  it('uses the stored headings when the page row has exactly three items', () => {
    const view = buildDirektur(
      [],
      new Map(),
      { title: 'Judul', items: [{ title: 'A' }, { title: 'B' }, { title: 'C', description: 'Intro' }] }
    );
    expect(view.pageTitle).toBe('Judul');
    expect(view.headings).toEqual({ direkturUtama: 'A', dewan: 'B', entitas: { title: 'C', intro: 'Intro' } });
  });

  it('falls back to the default headings when the page row is incomplete', () => {
    const view = buildDirektur([], new Map(), { items: [{ title: 'A' }] });
    expect(view.headings.direkturUtama).toBe(LEADERSHIP_HEADINGS.direkturUtama);
  });
});

describe('personFromRow', () => {
  it('needs a name, a position, and a photo', () => {
    expect(personFromRow(row({ name: '' }))).toBeNull();
    expect(personFromRow(row({ position: '' }))).toBeNull();
    expect(personFromRow(row({ photo_path: null }))).toBeNull();
    expect(personFromRow(row())).not.toBeNull();
  });

  it('drops education and teaching entries without their required text', () => {
    const person = personFromRow(
      row({
        profile: {
          education: [{ level: 'S1', institution: '' }, { level: 'S2', institution: 'UGM' }],
          teaching: [{ institution: 'BINUS', program: '' }],
        },
      })
    );
    expect(person?.profile.education.map((e) => e.level)).toEqual(['S2']);
    expect(person?.profile.teaching).toEqual([]);
  });

  it('carries the professional links through when set, and leaves them unset when not', () => {
    const withLinks = personFromRow(
      row({ profile: { linkedinUrl: 'https://linkedin.com/in/orang-uji', email: 'uji@environesia.co.id' } })
    );
    expect(withLinks?.profile.linkedinUrl).toBe('https://linkedin.com/in/orang-uji');
    expect(withLinks?.profile.email).toBe('uji@environesia.co.id');
    expect(withLinks?.profile.instagramUrl).toBeUndefined();

    const withoutLinks = personFromRow(row());
    expect(withoutLinks?.profile.linkedinUrl).toBeUndefined();
    expect(withoutLinks?.profile.instagramUrl).toBeUndefined();
    expect(withoutLinks?.profile.email).toBeUndefined();
  });
});

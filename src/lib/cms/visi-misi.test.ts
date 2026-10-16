import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));

import { buildVisiMisi } from './visi-misi';
import { VISI_MISI_FALLBACK } from './visi-misi-content';

const chapters = [
  { title: 'Visi', description: 'Visi baru **di Indonesia**' },
  { title: 'Misi', description: 'Misi baru' },
];
const commitments = [1, 2, 3, 4].map((n) => ({ title: `Komitmen ${n}`, description: `Isi ${n}` }));

describe('buildVisiMisi', () => {
  it('shows the current copy when no rows exist', () => {
    expect(buildVisiMisi(null, null)).toEqual(VISI_MISI_FALLBACK);
  });

  it('takes the two chapters and the four commitments from the rows', () => {
    const content = buildVisiMisi(
      { title: 'Judul baru', items: chapters },
      { title: 'Judul komitmen', description: 'Intro', items: commitments }
    );
    expect(content.title).toBe('Judul baru');
    expect(content.chapters).toEqual([
      { label: 'Visi', text: 'Visi baru **di Indonesia**' },
      { label: 'Misi', text: 'Misi baru' },
    ]);
    expect(content.komitmen.items).toHaveLength(4);
    expect(content.komitmen.intro).toBe('Intro');
  });

  it('falls back to the copy when a row does not have exactly two chapters', () => {
    expect(buildVisiMisi({ items: [chapters[0]] }, null).chapters).toEqual(VISI_MISI_FALLBACK.chapters);
  });

  it('falls back to the commitments when the list is not four items, or one has no title', () => {
    expect(buildVisiMisi(null, { items: commitments.slice(0, 3) }).komitmen.items).toEqual(VISI_MISI_FALLBACK.komitmen.items);
    const broken = [...commitments.slice(0, 3), { title: '', description: 'x' }];
    expect(buildVisiMisi(null, { items: broken }).komitmen.items).toEqual(VISI_MISI_FALLBACK.komitmen.items);
  });
});

import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));

import { buildPenghargaan } from './penghargaan';
import { PENGHARGAAN_FALLBACK } from './penghargaan-content';

describe('buildPenghargaan', () => {
  it('shows the current heading and intro when no row exists', () => {
    expect(buildPenghargaan(null)).toEqual(PENGHARGAAN_FALLBACK);
  });

  it('takes the heading, intro, and SEO from the row', () => {
    expect(
      buildPenghargaan({ title: 'Judul baru', description: 'Intro baru', meta_title: 'Meta', meta_description: 'Desc' })
    ).toEqual({ title: 'Judul baru', description: 'Intro baru', metaTitle: 'Meta', metaDescription: 'Desc' });
  });
});

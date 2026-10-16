import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/public', () => ({ createPublicClient: vi.fn() }));

import { buildLegalitasPage } from './legalitas-page';
import { LEGALITAS_PAGE_FALLBACK } from './legalitas-page-content';

describe('buildLegalitasPage', () => {
  it('shows the current heading, lead, and note when no row exists', () => {
    expect(buildLegalitasPage(null)).toEqual(LEGALITAS_PAGE_FALLBACK);
  });

  it('takes the heading, note, and SEO from the row', () => {
    expect(
      buildLegalitasPage({
        title: 'Judul baru',
        description: 'Lead baru',
        extra_label: 'Catatan',
        extra_text: 'Teks catatan',
        meta_title: 'Meta',
        meta_description: 'Desc',
      })
    ).toEqual({ title: 'Judul baru', description: 'Lead baru', noteLabel: 'Catatan', noteText: 'Teks catatan', metaTitle: 'Meta', metaDescription: 'Desc' });
  });
});

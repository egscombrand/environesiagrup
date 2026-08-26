import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ENTITIES } from '@/lib/cms/__fixtures__/site-content';

vi.mock('@/lib/cms/entities', () => ({
  getPublishedEntities: vi.fn().mockResolvedValue(ENTITIES),
}));

const { default: SejarahPage } = await import('./sejarah/page');
const { default: VisiMisiPage } = await import('./visi-misi/page');
const { default: MaknaLogoPage } = await import('./makna-logo/page');
const { default: StrukturOrganisasiPage } = await import('./struktur-organisasi/page');
const { default: GreenBusinessPage } = await import('./green-business/page');
const { default: PenghargaanPage } = await import('./penghargaan/page');

const params = Promise.resolve({ locale: 'id' });

describe('Tentang Kami sub-pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Sejarah', await SejarahPage({ params })],
      ['Visi & Misi', await VisiMisiPage({ params })],
      ['Makna Logo', await MaknaLogoPage({ params })],
      ['Green Business', await GreenBusinessPage({ params })],
      ['Penghargaan', await PenghargaanPage({ params })],
    ];

    for (const [title, element] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
      unmount();
    }
  });

  it('shows the real group diagram on the org structure page', async () => {
    render(await StrukturOrganisasiPage({ params }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Struktur Organisasi' })
    ).toBeInTheDocument();
    expect(screen.getByText('Environesia Group')).toBeInTheDocument();
  });

  it('says plainly that the personnel org chart is still pending', async () => {
    render(await StrukturOrganisasiPage({ params }));
    expect(
      screen.getByText('Susunan organisasi tingkat personel sedang disiapkan.')
    ).toBeInTheDocument();
  });
});

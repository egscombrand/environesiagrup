import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SejarahPage from './sejarah/page';
import VisiMisiPage from './visi-misi/page';
import MaknaLogoPage from './makna-logo/page';
import StrukturOrganisasiPage from './struktur-organisasi/page';
import GreenBusinessPage from './green-business/page';
import PenghargaanPage from './penghargaan/page';

const params = Promise.resolve({ locale: 'id' });

describe('Tentang Kami sub-pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Sejarah', await SejarahPage()],
      ['Visi & Misi', await VisiMisiPage()],
      ['Makna Logo', await MaknaLogoPage()],
      ['Green Business', await GreenBusinessPage()],
      ['Penghargaan', await PenghargaanPage()],
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

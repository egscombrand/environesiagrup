import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KarierPage from './karier/page';
import UnduhanPage from './unduhan/page';
import KebijakanPrivasiPage from './kebijakan-privasi/page';

describe('Pelengkap pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Karier', await KarierPage()],
      ['Unduhan', await UnduhanPage()],
      ['Kebijakan Privasi', await KebijakanPrivasiPage()],
    ];

    for (const [title, element] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
      unmount();
    }
  });

  it('notes on the privacy page that the policy text is still being prepared', async () => {
    render(await KebijakanPrivasiPage());
    expect(
      screen.getByText('Naskah kebijakan privasi sedang disusun bersama tim legal.')
    ).toBeInTheDocument();
  });
});

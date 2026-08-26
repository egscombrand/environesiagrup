import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cms/jobs', () => ({
  getOpenPublishedJobs: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/cms/documents', () => ({
  getPublishedDocuments: vi.fn().mockResolvedValue([]),
}));

const { default: KarierPage } = await import('./karier/page');
const { default: UnduhanPage } = await import('./unduhan/page');
const { default: KebijakanPrivasiPage } = await import('./kebijakan-privasi/page');

const params = Promise.resolve({ locale: 'id' });

describe('Pelengkap pages', () => {
  it('renders each page with its own h1 and the pending notice', async () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['Karier', await KarierPage({ params })],
      ['Unduhan', await UnduhanPage({ params })],
      ['Kebijakan Privasi', await KebijakanPrivasiPage({ params })],
    ];

    for (const [title, element] of cases) {
      const { unmount } = render(element);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
      unmount();
    }
  });

  it('notes on the privacy page that the policy text is still being prepared', async () => {
    render(await KebijakanPrivasiPage({ params }));
    expect(
      screen.getByText('Naskah kebijakan privasi sedang disusun bersama tim legal.')
    ).toBeInTheDocument();
  });
});

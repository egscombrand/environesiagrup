import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeDocument } from '@/lib/cms/fixtures';

vi.mock('@/lib/cms/documents', () => ({
  getPublishedDocuments: vi.fn().mockResolvedValue([]),
}));

const { CorporateInformation } = await import('./corporate-information');

describe('CorporateInformation', () => {
  it('renders an honest empty state when there are no documents yet', async () => {
    render(await CorporateInformation({ locale: 'id' }));
    expect(screen.getByText('Dokumen legalitas dan akreditasi sedang disiapkan.')).toBeInTheDocument();
  });
});

describe('CorporateInformation with data', () => {
  it('renders each document as a real download link, reusing the same data the /unduhan page uses', async () => {
    vi.resetModules();
    vi.doMock('@/lib/cms/documents', () => ({
      getPublishedDocuments: vi.fn().mockResolvedValue([
        makeDocument({
          title: 'Akta Pendirian',
          category: 'Legalitas',
          fileUrl: 'https://example.invalid/akta.pdf',
        }),
      ]),
    }));
    const { CorporateInformation: WithData } = await import('./corporate-information');
    render(await WithData({ locale: 'id' }));
    expect(screen.getByRole('link', { name: /Akta Pendirian/ })).toHaveAttribute(
      'href',
      'https://example.invalid/akta.pdf'
    );
  });
});

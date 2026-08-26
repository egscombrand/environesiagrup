import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PendingContent } from './pending-content';

describe('PendingContent', () => {
  it('renders the eyebrow, heading, and description', () => {
    render(
      <PendingContent
        locale="id"
        eyebrow="Tentang Kami"
        title="Sejarah"
        description="Perjalanan grup dari tahun ke tahun."
      />
    );

    expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Sejarah' })).toBeInTheDocument();
    expect(screen.getByText('Perjalanan grup dari tahun ke tahun.')).toBeInTheDocument();
  });

  it('states plainly that the content is not available yet', () => {
    render(<PendingContent locale="id" eyebrow="E" title="T" description="D" />);
    expect(screen.getByText('Konten halaman ini sedang disiapkan.')).toBeInTheDocument();
  });

  it('renders an extra note when one is given', () => {
    render(
      <PendingContent
        locale="id"
        eyebrow="E"
        title="T"
        description="D"
        note="Menunggu konfirmasi struktur."
      />
    );
    expect(screen.getByText('Menunggu konfirmasi struktur.')).toBeInTheDocument();
  });

  it('omits the note element entirely when none is given', () => {
    const { container } = render(
      <PendingContent locale="id" eyebrow="E" title="T" description="D" />
    );
    expect(container.querySelectorAll('[data-pending-note]')).toHaveLength(0);
  });
});

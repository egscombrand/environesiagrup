import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BisnisPage from './page';

describe('BisnisPage', () => {
  it('renders all four pillars in chain order with numbered labels', async () => {
    render(await BisnisPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Pilar Bisnis' })).toBeInTheDocument();
    ['Konsultasi Lingkungan', 'Pengujian & Sampling', 'Pelatihan Kompetensi', 'Sertifikasi Profesi'].forEach(
      (nama) => expect(screen.getByText(nama)).toBeInTheDocument()
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('links each pillar to its locale-prefixed detail page', async () => {
    render(await BisnisPage({ params: Promise.resolve({ locale: 'en' }) }));
    expect(screen.getByRole('link', { name: /Pengujian & Sampling/ })).toHaveAttribute(
      'href',
      '/en/bisnis/pengujian-sampling'
    );
  });
});

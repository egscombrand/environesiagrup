import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LeadershipMessage } from './leadership-message';

describe('LeadershipMessage', () => {
  it('renders an honest placeholder, never claiming to be a real quote', async () => {
    render(await LeadershipMessage({ locale: 'id' }));
    expect(screen.getByText('Kutipan pesan pimpinan akan ditambahkan di sini.')).toBeInTheDocument();
    expect(screen.getByText('Nama dan jabatan menyusul')).toBeInTheDocument();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});

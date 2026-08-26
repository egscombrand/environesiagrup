import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GreenBusinessSplit } from './green-business-split';

describe('GreenBusinessSplit', () => {
  it('renders honest placeholders for both the manifesto and the CEO quote', () => {
    render(<GreenBusinessSplit locale="id" />);
    expect(
      screen.getByText('Manifesto Green Business akan segera hadir di sini.')
    ).toBeInTheDocument();
    expect(screen.getByText('Kutipan pesan CEO menyusul.')).toBeInTheDocument();
  });
});

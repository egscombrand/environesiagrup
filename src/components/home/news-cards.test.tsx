import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewsCards } from './news-cards';

describe('NewsCards', () => {
  it('renders an honest empty state since content/posts has no entries yet', () => {
    render(<NewsCards locale="id" />);
    expect(screen.getByText('Belum ada berita terbaru.')).toBeInTheDocument();
  });
});

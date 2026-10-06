import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoadMoreGrid } from './load-more-grid';

describe('LoadMoreGrid', () => {
  it('reveals items a page at a time and hides the button once everything is shown', async () => {
    const user = userEvent.setup();
    const items = Array.from({ length: 12 }, (_, i) => <p key={i}>Liputan {i + 1}</p>);
    render(
      <LoadMoreGrid className="grid" initial={9} step={9}>
        {items}
      </LoadMoreGrid>
    );

    expect(screen.getByText('Liputan 9')).toBeInTheDocument();
    expect(screen.queryByText('Liputan 10')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tampilkan lebih banyak' }));

    expect(screen.getByText('Liputan 12')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tampilkan lebih banyak' })).not.toBeInTheDocument();
  });
});

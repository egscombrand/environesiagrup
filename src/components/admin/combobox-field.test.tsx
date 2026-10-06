import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ComboboxField } from './combobox-field';

describe('ComboboxField', () => {
  it('commits a value picked from the dropdown', async () => {
    const onCommit = vi.fn();
    const user = userEvent.setup();
    render(<ComboboxField value="" options={['Industri', 'Transportasi']} onCommit={onCommit} ariaLabel="Sektor" />);

    await user.click(screen.getByLabelText('Sektor'));
    await user.click(screen.getByRole('button', { name: 'Transportasi' }));

    expect(onCommit).toHaveBeenCalledWith('Transportasi');
  });

  it('commits free text typed by hand, even when it matches no option', async () => {
    const onCommit = vi.fn();
    const user = userEvent.setup();
    render(<ComboboxField value="" options={['Industri', 'Transportasi']} onCommit={onCommit} ariaLabel="Sektor" />);

    const input = screen.getByLabelText('Sektor');
    await user.type(input, 'Sektor Baru Yang Belum Ada di Daftar');
    await user.tab();

    expect(onCommit).toHaveBeenCalledWith('Sektor Baru Yang Belum Ada di Daftar');
  });

  it('does not commit when the value is unchanged on blur', async () => {
    const onCommit = vi.fn();
    const user = userEvent.setup();
    render(<ComboboxField value="Industri" options={['Industri', 'Transportasi']} onCommit={onCommit} ariaLabel="Sektor" />);

    await user.click(screen.getByLabelText('Sektor'));
    await user.tab();

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('Escape reverts to the last committed value without calling onCommit', async () => {
    const onCommit = vi.fn();
    const user = userEvent.setup();
    render(<ComboboxField value="Industri" options={['Industri', 'Transportasi']} onCommit={onCommit} ariaLabel="Sektor" />);

    const input = screen.getByLabelText('Sektor');
    await user.clear(input);
    await user.type(input, 'Ketikan Belum Jadi');
    await user.keyboard('{Escape}');

    expect(input).toHaveValue('Industri');
    expect(onCommit).not.toHaveBeenCalled();
  });
});

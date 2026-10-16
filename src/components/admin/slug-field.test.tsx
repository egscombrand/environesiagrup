import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SlugField } from './slug-field';

/** The hidden input is what the surrounding <form> actually submits. */
function hiddenValue(name: string) {
  return (document.querySelector(`input[type="hidden"][name="${name}"]`) as HTMLInputElement).value;
}

describe('SlugField', () => {
  it('on a new item with nothing typed yet, previews and submits an empty slug', () => {
    render(<SlugField name="slug" initialSlug="" sourceValue="" />);
    expect(hiddenValue('slug')).toBe('');
    expect(screen.getByText('(dibuat otomatis)')).toBeInTheDocument();
  });

  it('follows the primary field live, character by character, with no debounce or blur needed', () => {
    const { rerender } = render(<SlugField name="slug" initialSlug="" sourceValue="Penyusunan Feasibility Study" />);
    expect(screen.getByText('penyusunan-feasibility-study')).toBeInTheDocument();
    expect(hiddenValue('slug')).toBe('penyusunan-feasibility-study');

    // One more keystroke on the primary field re-renders this with the new value —
    // exactly how the parent form wires its onChange, no intermediate step.
    rerender(<SlugField name="slug" initialSlug="" sourceValue="Penyusunan Feasibility Study TPST" />);
    expect(screen.getByText('penyusunan-feasibility-study-tpst')).toBeInTheDocument();
    expect(hiddenValue('slug')).toBe('penyusunan-feasibility-study-tpst');
  });

  it('on an existing row whose slug still matches its name, stays in auto mode and keeps following it', () => {
    render(<SlugField name="slug" initialSlug="greenlab" sourceValue="GreenLab" />);
    expect(hiddenValue('slug')).toBe('greenlab');
    expect(screen.getByText('greenlab')).toBeInTheDocument();
    expect(screen.getByText('(dibuat otomatis)')).toBeInTheDocument();
  });

  it('on an existing row whose slug was hand-edited, starts in custom mode and stops following the name', () => {
    render(<SlugField name="slug" initialSlug="greenlab-the-original" sourceValue="GreenLab" />);
    expect(hiddenValue('slug')).toBe('greenlab-the-original');
    expect(screen.getByText('(diatur manual)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kembali ke otomatis' })).toBeInTheDocument();
  });

  it('editing and saving a custom slug submits the slugified value and stops auto mode', async () => {
    const user = userEvent.setup();
    render(<SlugField name="slug" initialSlug="" sourceValue="Nama Awal" />);

    await user.click(screen.getByRole('button', { name: 'Edit URL/Slug' }));
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'URL Kustom Saya!');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(hiddenValue('slug')).toBe('url-kustom-saya');
    expect(screen.getByText('(diatur manual)')).toBeInTheDocument();
  });

  it('while editing, shows a live sanitized preview of the draft before it is saved', async () => {
    const user = userEvent.setup();
    render(<SlugField name="slug" initialSlug="" sourceValue="Nama" />);

    await user.click(screen.getByRole('button', { name: 'Edit URL/Slug' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Draft Belum Disimpan!');

    expect(screen.getByText('→ draft-belum-disimpan')).toBeInTheDocument();
    // Not submitted yet — editing a draft must not change what the form would send.
    expect(hiddenValue('slug')).toBe('nama');
  });

  it('"Kembali ke otomatis" clears the override and resumes following the primary field', async () => {
    const user = userEvent.setup();
    render(<SlugField name="slug" initialSlug="slug-custom" sourceValue="Nama" />);
    expect(hiddenValue('slug')).toBe('slug-custom');

    await user.click(screen.getByRole('button', { name: 'Kembali ke otomatis' }));

    expect(hiddenValue('slug')).toBe('nama');
    expect(screen.getByText('(dibuat otomatis)')).toBeInTheDocument();
  });

  it('cancelling an edit leaves the previous value untouched', async () => {
    const user = userEvent.setup();
    render(<SlugField name="slug" initialSlug="slug-asli" sourceValue="Nama" />);

    await user.click(screen.getByRole('button', { name: 'Edit URL/Slug' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'draft-yang-dibatalkan');
    await user.click(screen.getByRole('button', { name: 'Batal' }));

    expect(hiddenValue('slug')).toBe('slug-asli');
    expect(screen.getByText('slug-asli')).toBeInTheDocument();
  });
});

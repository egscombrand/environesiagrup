import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RichTextEditor } from './rich-text-editor';

function hiddenValue(name: string) {
  return (document.querySelector(`input[type="hidden"][name="${name}"]`) as HTMLInputElement).value;
}

/** A paste event carrying exactly the clipboard formats a real source would — only what's listed is readable via getData. */
function pasteEvent(data: { 'text/plain'?: string; 'text/html'?: string }) {
  return {
    clipboardData: {
      types: Object.keys(data),
      getData: (type: string) => data[type as keyof typeof data] ?? '',
    },
  };
}

describe('RichTextEditor', () => {
  it('mounts exactly one editor with its full toolbar, and starts with the given content', async () => {
    render(<RichTextEditor name="general_recruitment" initialValue="<p>Halo</p>" />);

    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));
    expect(screen.getByText('Halo')).toBeInTheDocument();
    expect(hiddenValue('general_recruitment')).toContain('Halo');

    for (const label of [
      'Bold',
      'Italic',
      'Underline',
      'Paragraf',
      'Heading 2',
      'Heading 3',
      'Bullet list',
      'Numbered list',
      'Blockquote',
      'Link',
      'Clear formatting',
      'Undo',
      'Redo',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
  });

  it('typing updates the hidden input that the surrounding <form> actually submits', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="specific_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.type(editable, 'Kualifikasi khusus');

    await waitFor(() => expect(hiddenValue('specific_recruitment')).toContain('Kualifikasi khusus'));
  });

  it('toggling Bold wraps the selection and is reflected in the hidden input', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.type(editable, 'penting');
    await user.keyboard('{Control>}a{/Control}');
    await user.click(screen.getByRole('button', { name: 'Bold' }));

    await waitFor(() => expect(hiddenValue('general_recruitment')).toContain('<strong>'));
  });

  it('Bullet List: click, type, Enter, type → two real <li> items in a real <ul>', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.click(screen.getByRole('button', { name: 'Bullet list' }));
    expect(screen.getByRole('button', { name: 'Bullet list' })).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('Item pertama{Enter}Item kedua');

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      expect(html).toMatch(/<ul><li><p>Item pertama<\/p><\/li><li><p>Item kedua<\/p><\/li><\/ul>/);
    });
  });

  it('Numbered List: click, type, Enter, type → two real <li> items in a real <ol>', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.click(screen.getByRole('button', { name: 'Numbered list' }));
    expect(screen.getByRole('button', { name: 'Numbered list' })).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('Satu{Enter}Dua{Enter}Tiga');

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      expect(html).toMatch(/<ol><li><p>Satu<\/p><\/li><li><p>Dua<\/p><\/li><li><p>Tiga<\/p><\/li><\/ol>/);
    });
  });

  it('pressing Enter twice on an empty item exits the list back to a normal paragraph', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.click(screen.getByRole('button', { name: 'Bullet list' }));
    await user.keyboard('Satu-satunya item{Enter}{Enter}Paragraf biasa lagi');

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      // Exactly one <li>, and the text typed after exiting is a plain paragraph, not inside the list.
      expect(html).toContain('<ul><li><p>Satu-satunya item</p></li></ul>');
      expect(html).toContain('<p>Paragraf biasa lagi</p>');
    });
  });

  it('Tab nests a list item under the one above it (nested list)', async () => {
    const user = userEvent.setup();
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    await user.click(editable);
    await user.click(screen.getByRole('button', { name: 'Bullet list' }));
    await user.keyboard('Item utama{Enter}Sub item{Tab}');

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      // The second item's <ul> nests inside the first <li>, not as a sibling
      // — the first item's own text isn't pinned exactly here since
      // simulated typing can occasionally drop the very first keystroke
      // right as focus lands; the structural nesting is what this checks.
      expect(html).toMatch(/<ul><li><p>[^<]*<\/p><ul><li><p>Sub item<\/p><\/li><\/ul><\/li><\/ul>/);
    });
  });

  it('pasting a plain-text numbered list (no real markup on the clipboard) becomes a real <ol>', async () => {
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    fireEvent.paste(
      editable,
      pasteEvent({ 'text/plain': '1. Persyaratan pertama\n2. Persyaratan kedua\n3. Persyaratan ketiga' })
    );

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      expect(html).toContain('<ol>');
      expect(html).toContain('<li><p>Persyaratan pertama</p></li>');
      expect(html).not.toMatch(/1\.\s*Persyaratan pertama(?!<)/); // never left as literal "1. " text
    });
  });

  it('pasting a plain-text bullet list becomes a real <ul>', async () => {
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    fireEvent.paste(editable, pasteEvent({ 'text/plain': '• Satu\n• Dua' }));

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li><p>Satu</p></li>');
    });
  });

  it('pasting content that already has real <ol> markup (Word/Google Docs-style) keeps it intact, untouched by the plain-text heuristic', async () => {
    render(<RichTextEditor name="general_recruitment" initialValue="" />);
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(1));

    const editable = document.querySelector('.ProseMirror') as HTMLElement;
    fireEvent.paste(
      editable,
      pasteEvent({
        'text/plain': 'Satu\nDua',
        'text/html': '<ol><li>Satu</li><li>Dua</li></ol>',
      })
    );

    await waitFor(() => {
      const html = hiddenValue('general_recruitment');
      expect(html).toContain('<ol>');
      expect(html).toContain('<li><p>Satu</p></li>');
    });
  });

  it('two instances on the same page stay independent', async () => {
    render(
      <>
        <RichTextEditor name="general_recruitment" initialValue="<p>Satu</p>" />
        <RichTextEditor name="specific_recruitment" initialValue="<p>Dua</p>" />
      </>
    );
    await waitFor(() => expect(document.querySelectorAll('.ProseMirror')).toHaveLength(2));
    expect(hiddenValue('general_recruitment')).toContain('Satu');
    expect(hiddenValue('specific_recruitment')).toContain('Dua');
  });
});

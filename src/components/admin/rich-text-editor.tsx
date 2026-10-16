'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { useReducer, type ReactNode } from 'react';
import { detectPlainTextList, plainTextListToHtml } from './rich-text-paste';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  RemoveFormatting,
} from 'lucide-react';

const TOOLBAR_BUTTON =
  'inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#64748b] transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#64748b]';
const TOOLBAR_BUTTON_ACTIVE = 'bg-white text-[#2a7793] shadow-[0_1px_2px_rgba(15,23,42,0.08)]';

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`${TOOLBAR_BUTTON} ${active ? TOOLBAR_BUTTON_ACTIVE : ''}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-[#e3e8ee]" aria-hidden="true" />;
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL tautan:', previousUrl ?? 'https://');
    if (url === null) return; // cancelled
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-[#e3e8ee] bg-[#f8fafb] p-1.5">
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Paragraf"
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Link" active={editor.isActive('link')} onClick={setLink}>
        <Link2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Hapus tautan"
        disabled={!editor.isActive('link')}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Unlink className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}

/**
 * Recognizes a bullet/numbered list pasted as plain text (no real `<ul>`/
 * `<ol>` markup of its own on the clipboard) and turns it into a real list
 * node, the same way pasting from Word or Google Docs already works for
 * free — their clipboard HTML already has real list markup, which
 * ProseMirror's own default paste handling parses correctly on its own, so
 * this only needs to step in when that markup isn't there. Returns false to
 * let the editor's normal paste handling run instead.
 */
function handlePlainTextListPaste(view: EditorView, event: ClipboardEvent): boolean {
  const html = event.clipboardData?.getData('text/html') ?? '';
  if (/<(ul|ol|li)[\s>]/i.test(html)) return false; // real list markup already present — let it parse normally

  const text = event.clipboardData?.getData('text/plain') ?? '';
  const detected = detectPlainTextList(text);
  if (!detected) return false;

  const dom = new window.DOMParser().parseFromString(plainTextListToHtml(detected), 'text/html').body;
  const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(dom);
  view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
  return true;
}

/**
 * A WYSIWYG rich text editor (TipTap/ProseMirror), for content long and
 * structured enough that a plain textarea asks too much of whoever writes it
 * (e.g. a job posting's recruitment instructions). Stores its value as HTML
 * in a hidden input under `name`, submitted with the rest of the surrounding
 * native <form> exactly like every other field in this admin — no separate
 * save step. The HTML is sanitized again on the server before it's ever
 * stored (see src/lib/admin/sanitize-html.ts) and again right before it's
 * rendered publicly, so this editor's own output is never trusted blindly.
 */
export function RichTextEditor({ name, initialValue }: { name: string; initialValue: string }) {
  // TipTap's own isActive()/getHTML() reads don't trigger a React re-render
  // by themselves — this forces one on every content or selection change, so
  // the toolbar's active states and the hidden input's value both stay current.
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialValue || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[320px] px-4 py-3 text-body text-ink outline-none [&_a]:text-[#2a7793] [&_a]:underline',
      },
      handlePaste: handlePlainTextListPaste,
    },
    onUpdate: rerender,
    onSelectionUpdate: rerender,
  });

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#e3e8ee] bg-white focus-within:border-[#2a7793]">
      {editor ? <Toolbar editor={editor} /> : null}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={editor?.getHTML() ?? initialValue ?? ''} />
    </div>
  );
}

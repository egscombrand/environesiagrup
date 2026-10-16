'use client';

import { useState } from 'react';
import { slugify } from '@/lib/slug-format';

/**
 * The slug/URL for a content editor, shown as a small inline strip instead of
 * a normal form field. By default the slug is auto-derived from the item's
 * primary field (name/title/…) — live, on every keystroke, via the `sourceValue`
 * prop the parent form updates on the primary field's own onChange. There is
 * no debounce and no wait for blur/submit: this re-slugifies on every render,
 * so the preview changes in lockstep with typing. Once someone uses "Edit
 * URL/Slug" to set a custom value, this stops following the primary field,
 * until they choose "Kembali ke otomatis".
 *
 * The hidden input always submits the slug exactly as currently previewed
 * (never empty, never recomputed again at save) — what was shown live is
 * exactly what gets saved, the server only re-sanitizes and uniquifies it.
 *
 * Whether a saved row is already "custom" is inferred, not stored: if its
 * slug doesn't match what slugifying its current primary-field value would
 * produce, a person must have set it on purpose.
 */
export function SlugField({
  name,
  initialSlug,
  sourceValue,
}: {
  /** Form field name the hidden input submits under — the resource's existing `slug` column. */
  name: string;
  /** The row's current slug, or '' for a new item. */
  initialSlug: string;
  /** The primary field's (name/title/position/…) live current value — recomputed on every keystroke by the parent. */
  sourceValue: string;
}) {
  const autoSlug = slugify(sourceValue);
  const startsCustom = Boolean(initialSlug) && initialSlug !== autoSlug;

  const [mode, setMode] = useState<'auto' | 'custom'>(startsCustom ? 'custom' : 'auto');
  const [customValue, setCustomValue] = useState(initialSlug || autoSlug);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(customValue);

  // In auto mode, this follows `sourceValue` live — on the very same render
  // the primary field's onChange updates it, before any blur/submit.
  const displaySlug = mode === 'custom' ? customValue : autoSlug;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-[10px] border border-[#e3e8ee] bg-[#f4f6f9]/60 px-4 py-2.5 text-small text-[#64748b]">
      <span className="font-medium text-ink">URL/Slug:</span>
      {!editing ? (
        <>
          <span className="truncate font-mono text-small text-ink">{displaySlug || '—'}</span>
          <span className="text-[11px] text-[#94a3b8]">
            {mode === 'auto' ? '(dibuat otomatis)' : '(diatur manual)'}
          </span>
          <button
            type="button"
            onClick={() => {
              setDraft(displaySlug);
              setEditing(true);
            }}
            className="ml-auto text-small font-medium text-[#2a7793] underline-offset-2 hover:underline"
          >
            Edit URL/Slug
          </button>
          {mode === 'custom' ? (
            <button
              type="button"
              onClick={() => setMode('auto')}
              className="text-small text-[#64748b] underline-offset-2 hover:underline"
            >
              Kembali ke otomatis
            </button>
          ) : null}
        </>
      ) : (
        <div className="flex w-full flex-wrap items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            className="min-w-0 flex-1 rounded-[8px] border border-[#e3e8ee] bg-white px-3 py-1.5 font-mono text-small text-ink outline-none focus:border-[#2a7793]"
          />
          <span className="w-full basis-full font-mono text-[11px] text-[#94a3b8]">→ {slugify(draft) || '—'}</span>
          <button
            type="button"
            onClick={() => {
              setCustomValue(slugify(draft));
              setMode('custom');
              setEditing(false);
            }}
            className="text-small font-medium text-[#2a7793] hover:underline"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-small text-[#64748b] hover:underline"
          >
            Batal
          </button>
        </div>
      )}
      {/* Always the exact value previewed above — the server re-sanitizes and uniquifies it, but never regenerates it from scratch. */}
      <input type="hidden" name={name} value={displaySlug} />
    </div>
  );
}

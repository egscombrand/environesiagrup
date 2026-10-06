'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A text input with a filtered suggestion dropdown — but typing a value
 * that isn't in `options` is always accepted. Used where the project wants
 * a standard-options dropdown without ever hard-blocking a new value an
 * admin knows to be real (new client, new location, a new group entity).
 */
export function ComboboxField({
  value,
  options,
  onCommit,
  onDraftChange,
  placeholder,
  ariaLabel,
  className = '',
}: {
  value: string;
  options: string[];
  onCommit: (value: string) => void;
  /** Fires on every keystroke, before commit — for callers that need the live draft (e.g. enabling a separate "Terapkan" button). */
  onDraftChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(draft.trim().toLowerCase()));

  function commit(next: string) {
    setDraft(next);
    onDraftChange?.(next);
    setOpen(false);
    if (next !== value) onCommit(next);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        type="text"
        value={draft}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setDraft(e.target.value);
          onDraftChange?.(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => Math.min(h + 1, filtered.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            commit(open && filtered[highlight] ? filtered[highlight] : draft);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            setDraft(value);
            setOpen(false);
          }
        }}
        className="w-full rounded-[8px] border border-transparent bg-transparent px-2 py-1 text-small text-ink outline-none hover:border-line focus:border-forest focus:bg-paper"
      />
      {open && filtered.length > 0 ? (
        <ul className="absolute left-0 top-full z-20 mt-1 max-h-48 w-max min-w-full overflow-y-auto rounded-[8px] border border-line bg-paper py-1 shadow-[0_8px_24px_rgba(16,34,28,0.12)]">
          {filtered.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(option)}
                className={`block w-full whitespace-nowrap px-3 py-1.5 text-left text-small ${
                  i === highlight ? 'bg-forest/10 text-forest' : 'text-ink hover:bg-stone'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

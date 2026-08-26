'use client';

import { useMemo, useState } from 'react';
import { iconNames } from 'lucide-react/dynamic';
import { ChevronDown, Search, X } from 'lucide-react';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { useClickOutside } from '@/lib/admin/use-click-outside';

// Shown before the admin searches — a relevant starting set for a green
// consulting/certification group, rather than an arbitrary alphabetical
// slice of 2000+ icons.
const CURATED_ICONS = [
  'leaf', 'sprout', 'recycle', 'droplets', 'trees', 'mountain',
  'globe', 'map', 'map-pin', 'building-2', 'factory', 'warehouse',
  'users', 'user-check', 'handshake', 'briefcase-business', 'graduation-cap', 'award',
  'badge-check', 'shield-check', 'flask-conical', 'microscope', 'clipboard-check', 'file-check',
  'bar-chart-3', 'trending-up', 'target', 'star', 'folder-check', 'folder-kanban',
  'calendar-check', 'clock', 'phone', 'mail', 'flag', 'gauge',
];

const RESULT_LIMIT = 60;

function normalize(name: string) {
  return name.replace(/-/g, ' ');
}

export function IconPicker({
  name,
  initialValue,
}: {
  name: string;
  initialValue?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(initialValue ?? '');
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const results = useMemo(() => {
    if (!query.trim()) return CURATED_ICONS;
    const q = query.trim().toLowerCase();
    return iconNames.filter((n) => n.includes(q)).slice(0, RESULT_LIMIT);
  }, [query]);

  function choose(iconName: string) {
    setSelected(iconName);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={selected} />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-[10px] border border-line bg-paper px-4 py-2.5 text-body text-ink outline-none hover:border-slate/40 focus:border-forest"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-stone">
            <DynamicIcon name={selected || undefined} className="h-4 w-4 text-forest" strokeWidth={1.75} />
          </span>
          <span className={selected ? 'text-ink' : 'text-slate'}>{selected || 'No icon selected'}</span>
        </span>
        <span className="flex items-center gap-2">
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                choose('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  choose('');
                }
              }}
              aria-label="Clear icon"
              className="rounded-[6px] p-0.5 text-slate hover:bg-line hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : null}
          <ChevronDown className="h-4 w-4 text-slate" aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <div className="absolute z-40 mt-2 w-full min-w-[320px] rounded-[12px] border border-line bg-paper p-3 shadow-[0_12px_32px_rgba(16,34,28,0.14)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              className="w-full rounded-[8px] border border-line bg-paper py-2 pl-9 pr-3 text-small text-ink outline-none focus:border-forest"
            />
          </div>

          <div className="mt-3 grid max-h-64 grid-cols-4 gap-1 overflow-y-auto sm:grid-cols-5">
            {results.length === 0 ? (
              <p className="col-span-full py-6 text-center text-small text-slate">No icons match &quot;{query}&quot;.</p>
            ) : (
              results.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => choose(iconName)}
                  title={normalize(iconName)}
                  aria-pressed={selected === iconName}
                  className={`flex flex-col items-center gap-1 rounded-[8px] p-2 hover:bg-stone ${
                    selected === iconName ? 'bg-forest/10 ring-1 ring-forest' : ''
                  }`}
                >
                  <DynamicIcon name={iconName} className="h-5 w-5 text-ink" strokeWidth={1.75} />
                  <span className="w-full truncate text-center text-[10px] text-slate">{iconName}</span>
                </button>
              ))
            )}
          </div>
          {!query.trim() ? (
            <p className="mt-2 text-small text-slate">Showing common icons — search for more ({iconNames.length} available).</p>
          ) : results.length === RESULT_LIMIT ? (
            <p className="mt-2 text-small text-slate">Showing first {RESULT_LIMIT} results — refine your search for more.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

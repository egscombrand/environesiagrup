'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, PenLine } from 'lucide-react';
import {
  moveSectionAction,
  toggleSectionAction,
  updateSectionOverrideAction,
} from '@/app/wp-admin/(protected)/site/pages/actions';
import { useToast } from './toast-provider';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (Executive Snapshot)',
  stats: 'Statistics (retired — folded into Hero)',
  entities: 'Our Ecosystem',
  pillars: 'Our Capabilities',
  projects_showcase: 'Featured Projects',
  milestones: 'Achievements & Milestones',
  leadership: 'Leadership',
  map: 'Country / Reach Map (retired)',
  leadership_message: 'Leadership Message (retired — see Leadership)',
  sustainability: 'Sustainability & Impact',
  clients: 'Clients & Partners (mock data — no CMS table yet)',
  documents: 'Corporate Information',
  green_business: 'Green Business / CEO Split (retired)',
  news: 'News & Perspectives',
  cta: 'CTA Kontak',
};

export function SectionRow({
  section,
  pageId,
  isFirst,
  isLast,
}: {
  section: {
    id: string;
    section_key: string;
    status: string;
    title_override: string | null;
    subtitle_override: string | null;
  };
  pageId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const label = SECTION_LABELS[section.section_key] ?? section.section_key;

  return (
    <div className="rounded-[14px] border border-line bg-paper">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={section.status === 'published'}
              disabled={pending}
              onChange={(e) =>
                startTransition(async () => {
                  await toggleSectionAction(section.id, e.target.checked);
                  toast('success', e.target.checked ? `${label} enabled.` : `${label} disabled.`);
                  router.refresh();
                })
              }
              className="peer sr-only"
            />
            <div className="h-5 w-9 rounded-full bg-line peer-checked:bg-success" />
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-paper transition-transform peer-checked:translate-x-4" />
          </label>
          <p className="font-display text-h3 text-ink">{label}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => startTransition(async () => { await moveSectionAction(section.id, 'up', pageId); router.refresh(); })}
            aria-label="Move up"
            className="rounded-[8px] p-1.5 text-slate hover:bg-stone hover:text-ink disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => startTransition(async () => { await moveSectionAction(section.id, 'down', pageId); router.refresh(); })}
            aria-label="Move down"
            className="rounded-[8px] p-1.5 text-slate hover:bg-stone hover:text-ink disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label="Edit title override"
            className={`rounded-[8px] p-1.5 hover:bg-forest/10 hover:text-forest ${expanded ? 'bg-forest/10 text-forest' : 'text-slate'}`}
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {expanded ? (
        <form
          action={async (formData) => {
            await updateSectionOverrideAction(section.id, formData);
            toast('success', 'Title updated.');
            router.refresh();
            setExpanded(false);
          }}
          className="space-y-3 border-t border-line px-4 py-4"
        >
          <div>
            <label className="font-mono text-label uppercase text-slate">Title (override)</label>
            <input
              type="text"
              name="title_override"
              defaultValue={section.title_override ?? ''}
              className="mt-1 w-full rounded-[10px] border border-line bg-paper px-3 py-2 text-body text-ink outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="font-mono text-label uppercase text-slate">Subtitle (override)</label>
            <input
              type="text"
              name="subtitle_override"
              defaultValue={section.subtitle_override ?? ''}
              className="mt-1 w-full rounded-[10px] border border-line bg-paper px-3 py-2 text-body text-ink outline-none focus:border-forest"
            />
          </div>
          <button type="submit" className="rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90">
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}

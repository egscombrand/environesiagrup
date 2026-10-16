'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronUp, ChevronDown, PenLine, ArrowRight } from 'lucide-react';
import {
  moveSectionAction,
  toggleSectionAction,
  updateSectionOverrideAction,
} from '@/app/wp-admin/(protected)/site/pages/actions';
import { useToast } from './toast-provider';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (Executive Snapshot)',
  stats: 'Statistics (retired — folded into Hero)',
  entities: 'Capabilities Grid ("Satu Grup, Beragam Kapabilitas")',
  group_ecosystem: 'Group Ecosystem Banner ("Beragam Keahlian. Satu Ekosistem.")',
  business_projects: 'Business Projects Deck ("Lini Bisnis dan Proyek Berjalan")',
  standards: 'Standards Section ("Standar yang Kami Pegang dan Jalankan")',
  trusted_partners: 'Trusted Partners Section ("Dipercaya oleh Berbagai Mitra")',
  pillars: 'Our Capabilities',
  projects_showcase: 'Featured Projects',
  milestones: 'Our Journey (Milestones)',
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

// Where to go to actually change what's inside a section — shown as a
// direct "Manage Content" link on its row so there's no guessing which
// content page corresponds to which part of the homepage. Sections with no
// entry here (sustainability, cta, and the retired ones) have no dedicated
// CMS list yet — only their title/subtitle can be overridden right here.
const SECTION_CONTENT_LINKS: Record<string, string> = {
  hero: '/wp-admin/content/hero',
  stats: '/wp-admin/content/stats',
  entities: '/wp-admin/content/entities',
  business_projects: '/wp-admin/content/projects',
  pillars: '/wp-admin/content/pillars',
  projects_showcase: '/wp-admin/content/projects',
  milestones: '/wp-admin/content/milestones',
  leadership: '/wp-admin/content/leadership',
  documents: '/wp-admin/content/documents',
  news: '/wp-admin/content/siaran-pers',
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
  const contentHref = SECTION_CONTENT_LINKS[section.section_key];

  return (
    <div className="rounded-[12px] border border-[#e3e8ee] bg-white">
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
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none peer-checked:translate-x-4" />
          </label>
          <p className="font-display text-h3 text-ink">{label}</p>
        </div>
        <div className="flex items-center gap-1">
          {contentHref ? (
            <Link
              href={contentHref}
              className="mr-1 inline-flex shrink-0 items-center gap-1 rounded-[8px] border border-[#e3e8ee] px-2.5 py-1.5 text-small font-medium text-ink hover:bg-[#f4f6f9]"
            >
              Manage Content
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : null}
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => startTransition(async () => { await moveSectionAction(section.id, 'up', pageId); router.refresh(); })}
            aria-label="Move up"
            className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#f4f6f9] hover:text-ink disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => startTransition(async () => { await moveSectionAction(section.id, 'down', pageId); router.refresh(); })}
            aria-label="Move down"
            className="rounded-[8px] p-1.5 text-[#64748b] hover:bg-[#f4f6f9] hover:text-ink disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label="Edit title override"
            className={`rounded-[8px] p-1.5 hover:bg-[#2a7793]/10 hover:text-[#2a7793] ${expanded ? 'bg-[#2a7793]/10 text-[#2a7793]' : 'text-[#64748b]'}`}
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
          className="space-y-3 border-t border-[#e3e8ee] px-4 py-4"
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Title (override)</label>
            <input
              type="text"
              name="title_override"
              defaultValue={section.title_override ?? ''}
              className="mt-1 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-body text-ink outline-none focus:border-[#2a7793]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Subtitle (override)</label>
            <input
              type="text"
              name="subtitle_override"
              defaultValue={section.subtitle_override ?? ''}
              className="mt-1 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2 text-body text-ink outline-none focus:border-[#2a7793]"
            />
          </div>
          <button type="submit" className="rounded-[10px] bg-[#2a7793] px-4 py-2 text-small font-medium text-white hover:opacity-90">
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { listEntitiesForAdmin } from '@/lib/cms/entities';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/status-badge';

export const metadata: Metadata = { title: 'Environesia Group Experience' };

export default async function GroupExperiencePage() {
  await requireProfile();
  const entities = await listEntitiesForAdmin();

  return (
    <div>
      <PageHeader
        eyebrow="Website"
        title="Environesia Group Experience"
        description="Everything shown in Section 02 of the homepage — the opening scene, the transition copy, and each company's interactive story — is managed from here. No part of it is hardcoded."
      />

      <div className="mt-8 space-y-6">
        <section className="rounded-[14px] border border-line bg-paper p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone">
              <Sparkles className="h-5 w-5 text-slate" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-display text-h3 text-ink">Opening, Transition &amp; Closing Copy</p>
              <p className="mt-1 max-w-xl text-small text-slate">
                The cinematic opening lines (&quot;Berikut adalah ENVIROnesia Group.&quot;), the click-through
                transition, and the closing statement after the deck — all editable as text, not code.
              </p>
            </div>
            <Link
              href="/wp-admin/site/settings#company-group-experience"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
            >
              Edit Copy
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="rounded-[14px] border border-line bg-paper p-6">
          <p className="font-display text-h3 text-ink">Company Stories</p>
          <p className="mt-1 max-w-xl text-small text-slate">
            Each company&apos;s multi-scene story — the card visitors expand into after selecting it in the ecosystem deck.
            Add, edit, remove, and drag to reorder scenes per company; no coding required.
          </p>

          <div className="mt-5 divide-y divide-line">
            {entities.map((entity) => (
              <div key={entity.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-ink">{entity.name}</p>
                  <div className="mt-1">
                    <StatusBadge status={entity.status} />
                  </div>
                </div>
                <Link
                  href={`/wp-admin/content/entities/${entity.id}/story`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-line px-3.5 py-2 text-small font-medium text-ink hover:bg-stone"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Manage Story
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

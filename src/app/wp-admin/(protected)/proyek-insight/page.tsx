import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Briefcase, Handshake, Newspaper } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';

export const metadata: Metadata = { title: 'Proyek & Insight' };

async function countRows(
  supabase: Awaited<ReturnType<typeof requireProfile>>['supabase'],
  table: string,
  filters?: Record<string, string>
) {
  let query = supabase.from(table as never).select('*', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(filters ?? {})) {
    query = query.eq(key, value);
  }
  const { count } = await query;
  return count ?? 0;
}

export default async function ProyekInsightPage() {
  const { supabase } = await requireProfile();

  const [publishedProjects, draftProjects, totalPosts] = await Promise.all([
    countRows(supabase, 'projects', { status: 'published' }),
    countRows(supabase, 'projects', { status: 'draft' }),
    countRows(supabase, 'posts'),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Proyek & Insight"
        title="Proyek & Insight"
        description="Kelola konten proyek, portofolio, dan insight Environesia Company Group."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link
          href="/wp-admin/content/projects"
          className="group flex flex-col rounded-[14px] border border-line bg-paper p-6 transition-colors hover:border-forest/30"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-forest/10">
              <Briefcase className="h-5 w-5 text-forest" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <ArrowRight
              className="h-4 w-4 text-slate transition-transform group-hover:translate-x-0.5 group-hover:text-forest"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 font-display text-h3 text-ink">Portofolio Proyek</p>
          <p className="mt-1 text-small text-slate">
            Untuk mengelola data proyek yang akan ditampilkan pada halaman publik Portofolio Proyek.
          </p>
          <p className="mt-4 font-mono text-label uppercase text-slate">
            {publishedProjects} published · {draftProjects} draft
          </p>
        </Link>

        <div className="flex flex-col rounded-[14px] border border-dashed border-line bg-paper/60 p-6">
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-stone">
              <Handshake className="h-5 w-5 text-slate" strokeWidth={1.75} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-4 font-display text-h3 text-ink">Klien & Mitra</p>
          <p className="mt-1 text-small text-slate">Untuk pengelolaan data klien dan mitra di masa mendatang.</p>
          <p className="mt-4 font-mono text-label uppercase text-slate">Belum tersedia</p>
        </div>

        <Link
          href="/wp-admin/content/siaran-pers"
          className="group flex flex-col rounded-[14px] border border-line bg-paper p-6 transition-colors hover:border-forest/30"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-forest/10">
              <Newspaper className="h-5 w-5 text-forest" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <ArrowRight
              className="h-4 w-4 text-slate transition-transform group-hover:translate-x-0.5 group-hover:text-forest"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 font-display text-h3 text-ink">Siaran Pers</p>
          <p className="mt-1 text-small text-slate">
            Berita dan siaran pers — dikelola dari satu menu Siaran Pers.
          </p>
          <p className="mt-4 font-mono text-label uppercase text-slate">{totalPosts} total posts</p>
        </Link>

      </div>
    </div>
  );
}

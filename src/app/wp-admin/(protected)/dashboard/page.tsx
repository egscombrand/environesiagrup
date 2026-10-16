import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Building2, FileText, FolderKanban, House, Newspaper, type LucideIcon } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { getRecentActivity } from '@/lib/admin/activity';

export const metadata: Metadata = { title: 'Dashboard' };

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

// Shortcuts only to editors that exist today, in the same order as the sidebar
// Website tree, so the dashboard and the menu point at the same places.
const SHORTCUTS: { label: string; hint: string; href: string; icon: LucideIcon }[] = [
  { label: 'Homepage', hint: 'Urutan dan isi beranda', href: '/wp-admin/site/pages', icon: House },
  { label: 'Entitas & Kapabilitas', hint: 'Entitas dalam grup', href: '/wp-admin/content/entities', icon: Building2 },
  { label: 'Portofolio Proyek', hint: 'Proyek dan referensi', href: '/wp-admin/content/projects', icon: FolderKanban },
  { label: 'Siaran Pers', hint: 'Berita dan siaran pers', href: '/wp-admin/content/siaran-pers', icon: Newspaper },
  { label: 'Karier', hint: 'Lowongan yang tayang', href: '/wp-admin/content/jobs', icon: Briefcase },
];

// Soft pastel surfaces for the stat tiles, cycled in order.
const KPI_TONES = [
  { surface: 'bg-[#eef6fb]', icon: 'text-[#2a7793]' },
  { surface: 'bg-[#fff6ea]', icon: 'text-[#d97706]' },
  { surface: 'bg-[#e9f9f6]', icon: 'text-[#0d9488]' },
  { surface: 'bg-[#fdf0f0]', icon: 'text-[#dc2626]' },
  { surface: 'bg-[#f2effe]', icon: 'text-[#6d4fd1]' },
];

const ACTION_VERBS: Record<string, string> = {
  create: 'created',
  update: 'updated',
  delete: 'deleted',
  publish: 'published',
  unpublish: 'unpublished',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Good morning';
  if (hour < 15) return 'Good afternoon';
  if (hour < 19) return 'Good evening';
  return 'Good evening';
}

export default async function DashboardPage() {
  const { supabase, profile } = await requireProfile();

  const [
    totalEntities,
    totalProjects,
    totalPosts,
    publishedPosts,
    draftPosts,
    archivedPosts,
    publishedProjects,
    draftProjects,
    activeJobs,
    totalDocuments,
    totalLeadership,
    activity,
  ] = await Promise.all([
    countRows(supabase, 'entities'),
    countRows(supabase, 'projects'),
    countRows(supabase, 'posts'),
    countRows(supabase, 'posts', { status: 'published' }),
    countRows(supabase, 'posts', { status: 'draft' }),
    countRows(supabase, 'posts', { status: 'archived' }),
    countRows(supabase, 'projects', { status: 'published' }),
    countRows(supabase, 'projects', { status: 'draft' }),
    countRows(supabase, 'jobs', { status: 'published' }),
    countRows(supabase, 'documents'),
    countRows(supabase, 'leadership'),
    getRecentActivity(supabase, 8),
  ]);

  const kpis = [
    { label: 'Entities', value: totalEntities, icon: Building2 },
    { label: 'Projects', value: totalProjects, icon: FolderKanban },
    { label: 'Posts', value: totalPosts, icon: Newspaper },
    { label: 'Documents', value: totalDocuments, icon: FileText },
    { label: 'Active Jobs', value: activeJobs, icon: Briefcase },
  ];

  const postStatusTotal = publishedPosts + draftPosts + archivedPosts || 1;
  const contentStatus = [
    { label: 'Published', value: publishedPosts, className: 'bg-success' },
    { label: 'Draft', value: draftPosts, className: 'bg-slate' },
    { label: 'Archived', value: archivedPosts, className: 'bg-danger' },
  ];

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Dashboard</p>
      <h1 className="mt-1 font-display text-h2 text-ink">
        {greeting()}, {profile.username}
      </h1>
      <p className="mt-1 text-body text-[#64748b]">Kelola konten website dan informasi bisnis dari satu tempat.</p>

      <div className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Shortcut</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SHORTCUTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-[12px] border border-[#e3e8ee] bg-white px-4 py-3.5 transition-colors hover:border-[#2a7793]/30 hover:bg-[#2a7793]/[0.03] motion-reduce:transition-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f4f6f9] text-[#2a7793]">
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-small font-medium text-ink">{item.label}</span>
                <span className="block truncate text-label text-[#64748b]">{item.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((kpi, index) => {
          const tone = KPI_TONES[index % KPI_TONES.length];
          return (
            <div key={kpi.label} className={`rounded-[14px] p-5 ${tone.surface}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/80 ${tone.icon}`}>
                <kpi.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-4 text-[13px] font-medium text-[#475569]">{kpi.label}</p>
              <p className="mt-1 font-display text-[28px] font-semibold leading-none text-[#0f172a]">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[12px] border border-[#e3e8ee] bg-white p-5 lg:col-span-2">
          <p className="font-display text-h3 text-ink">Recent Activity</p>
          {activity.length === 0 ? (
            <p className="mt-6 text-small text-[#64748b]">
              No activity recorded yet. Actions you take across wp-admin will show up here.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-line">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <p className="text-small text-ink">
                    <span className="font-medium">{item.actorName}</span>{' '}
                    {ACTION_VERBS[item.action] ?? item.action} {item.resource.toLowerCase()}
                  </p>
                  <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">{timeAgo(item.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[12px] border border-[#e3e8ee] bg-white p-5">
          <p className="font-display text-h3 text-ink">Posts by Status</p>
          <div className="mt-4 space-y-3">
            {contentStatus.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-small">
                  <span className="text-ink">{s.label}</span>
                  <span className="text-[#64748b]">{s.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-[#f4f6f9]">
                  <div
                    className={`h-1.5 rounded-full ${s.className}`}
                    style={{ width: `${(s.value / postStatusTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#e3e8ee] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Projects</p>
            <div className="mt-2 flex items-center justify-between text-small">
              <span className="text-ink">Published</span>
              <span className="text-[#64748b]">{publishedProjects}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-small">
              <span className="text-ink">Draft</span>
              <span className="text-[#64748b]">{draftProjects}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-small">
              <span className="text-ink">Leadership profiles</span>
              <span className="text-[#64748b]">{totalLeadership}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

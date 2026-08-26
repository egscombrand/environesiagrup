import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, FolderKanban, Newspaper, FileText, Briefcase, Plus } from 'lucide-react';
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

const QUICK_ACTIONS = [
  { label: 'New Article', href: '/wp-admin/content/posts/new', icon: Newspaper },
  { label: 'New Project', href: '/wp-admin/content/projects/new', icon: FolderKanban },
  { label: 'New Entity', href: '/wp-admin/content/entities/new', icon: Building2 },
  { label: 'New Job', href: '/wp-admin/content/jobs/new', icon: Briefcase },
  { label: 'Upload Document', href: '/wp-admin/content/documents/new', icon: FileText },
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
      <p className="font-mono text-label uppercase text-slate">Overview</p>
      <h1 className="mt-1 font-display text-h2 text-ink">
        {greeting()}, {profile.username}
      </h1>
      <p className="mt-1 text-body text-slate">Manage your website content and business information from one place.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-paper px-3.5 py-2 text-small text-ink hover:border-forest/30 hover:bg-forest/5"
          >
            <Plus className="h-3.5 w-3.5 text-slate" aria-hidden="true" />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-[14px] border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <p className="font-mono text-label uppercase text-slate">{kpi.label}</p>
              <kpi.icon className="h-4 w-4 shrink-0 text-slate" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-h2 text-ink">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[14px] border border-line bg-paper p-5 lg:col-span-2">
          <p className="font-display text-h3 text-ink">Recent Activity</p>
          {activity.length === 0 ? (
            <p className="mt-6 text-small text-slate">
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
                  <p className="shrink-0 font-mono text-label uppercase text-slate">{timeAgo(item.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[14px] border border-line bg-paper p-5">
          <p className="font-display text-h3 text-ink">Posts by Status</p>
          <div className="mt-4 space-y-3">
            {contentStatus.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-small">
                  <span className="text-ink">{s.label}</span>
                  <span className="text-slate">{s.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-stone">
                  <div
                    className={`h-1.5 rounded-full ${s.className}`}
                    style={{ width: `${(s.value / postStatusTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <p className="font-mono text-label uppercase text-slate">Projects</p>
            <div className="mt-2 flex items-center justify-between text-small">
              <span className="text-ink">Published</span>
              <span className="text-slate">{publishedProjects}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-small">
              <span className="text-ink">Draft</span>
              <span className="text-slate">{draftProjects}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-small">
              <span className="text-ink">Leadership profiles</span>
              <span className="text-slate">{totalLeadership}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

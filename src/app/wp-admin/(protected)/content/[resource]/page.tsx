import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus, FileUp } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { getResource } from '@/lib/admin/resources';
import { listResourceRows } from '@/lib/admin/crud';
import { publicMediaUrl } from '@/lib/cms/media';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable, type TableRow } from '@/components/admin/data-table';
import { ProjectsTableEditor } from '@/components/admin/projects-table-editor';
import type { ProjectEditorRow } from '@/components/admin/projects-table-editor-logic';
import { deleteAction, setStatusAction } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string }>;
}): Promise<Metadata> {
  const { resource: resourceSlug } = await params;
  const resource = getResource(resourceSlug);
  return { title: resource?.title ?? 'Content' };
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: resourceSlug } = await params;
  const resource = getResource(resourceSlug);
  if (!resource) notFound();

  const { supabase, profile } = await requireProfile();
  const rows = await listResourceRows(resource, supabase);

  const canWrite = resource.authorScoped
    ? ['super_admin', 'editor', 'author'].includes(profile.role)
    : ['super_admin', 'editor'].includes(profile.role);

  const imageColumns = resource.columns.filter((c) => c.kind === 'image').map((c) => c.key);

  const tableRows: TableRow[] = rows.map((row) => {
    const values = { ...row };
    for (const key of imageColumns) {
      values[key] = publicMediaUrl(values[key] as string | null);
    }
    return {
      id: row.id as string,
      values,
      editHref: `/wp-admin/content/${resourceSlug}/${row.id}`,
      onDelete: deleteAction.bind(null, resourceSlug, row.id as string),
      onSetStatus: resource.hasStatus ? setStatusAction.bind(null, resourceSlug, row.id as string) : undefined,
    };
  });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title={resource.title}
        description={resource.description ?? `Manage all ${resource.title.toLowerCase()} shown on the website.`}
        action={
          canWrite ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/wp-admin/content/${resourceSlug}/new`}
                className="inline-flex items-center gap-1.5 rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add {resource.singular}
              </Link>
              {/* Projects-specific: lets an admin extract many projects at once from a
                  real portfolio PDF instead of typing each one in by hand. Nothing else
                  about this shared list page changes for other resources. */}
              {resourceSlug === 'projects' ? (
                <Link
                  href="/wp-admin/content/projects/import"
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-paper px-4 py-2 text-small font-medium text-ink hover:border-forest/30"
                >
                  <FileUp className="h-4 w-4" aria-hidden="true" />
                  Import PDF
                </Link>
              ) : null}
            </div>
          ) : undefined
        }
      />

      <div className="mt-6">
        {resourceSlug === 'projects' ? (
          <ProjectsTableEditor rows={rows.map(toProjectEditorRow)} canWrite={canWrite} />
        ) : (
          <DataTable
            columns={resource.columns}
            rows={tableRows}
            titleField={resource.titleField}
            singular={resource.singular}
            hasStatusFilter={resource.hasStatus}
            searchPlaceholder={resource.searchPlaceholder ?? `Search ${resource.title.toLowerCase()}…`}
            filters={resource.listFilters}
          />
        )}
      </div>
    </div>
  );
}

function toProjectEditorRow(row: Record<string, unknown>): ProjectEditorRow {
  return {
    id: row.id as string,
    title: String(row.title ?? ''),
    client: (row.client as string) ?? null,
    sector: (row.sector as string) ?? null,
    city: (row.city as string) ?? null,
    year: (row.year as number) ?? null,
    services: (row.services as string) ?? null,
    company: (row.company as string) ?? null,
    status: String(row.status ?? 'draft'),
  };
}

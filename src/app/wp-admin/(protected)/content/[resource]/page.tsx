import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { getResource } from '@/lib/admin/resources';
import { listResourceRows } from '@/lib/admin/crud';
import { publicMediaUrl } from '@/lib/cms/media';
import { PageHeader } from '@/components/admin/page-header';
import { DataTable, type TableRow } from '@/components/admin/data-table';
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
        description={`Manage all ${resource.title.toLowerCase()} shown on the website.`}
        action={
          canWrite ? (
            <Link
              href={`/wp-admin/content/${resourceSlug}/new`}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add {resource.singular}
            </Link>
          ) : undefined
        }
      />

      <div className="mt-6">
        <DataTable
          columns={resource.columns}
          rows={tableRows}
          titleField={resource.titleField}
          singular={resource.singular}
          hasStatusFilter={resource.hasStatus}
          searchPlaceholder={`Search ${resource.title.toLowerCase()}…`}
        />
      </div>
    </div>
  );
}

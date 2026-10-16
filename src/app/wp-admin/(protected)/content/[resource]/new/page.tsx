import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getResource } from '@/lib/admin/resources';
import { PageHeader } from '@/components/admin/page-header';
import { ResourceForm } from '@/components/admin/resource-form';
import { createAction } from '../actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string }>;
}): Promise<Metadata> {
  const { resource: resourceSlug } = await params;
  const resource = getResource(resourceSlug);
  return { title: resource ? `Tambah ${resource.singular}` : 'Content' };
}

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: resourceSlug } = await params;
  const resource = getResource(resourceSlug);
  if (!resource) notFound();

  const { supabase, profile } = await requireProfile();
  const canWrite = resource.authorScoped
    ? ['super_admin', 'editor', 'author'].includes(profile.role)
    : ['super_admin', 'editor'].includes(profile.role);
  if (!canWrite) redirect('/wp-admin/unauthorized');

  const needsEntities = resource.fields.some((f) => f.type === 'entity-select' || f.type === 'entity-multiselect');
  const entities = needsEntities
    ? ((await supabase.from('entities').select('id, name').is('deleted_at', null).order('sort_order')).data ?? [])
    : [];

  return (
    // h-full + flex-col: PageHeader never scrolls, ResourceForm gets a real
    // bounded height to scroll its own content within (see EditorFrame in
    // editor-layout.tsx and admin-shell.tsx for where that h-full comes from).
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader eyebrow={`Content / ${resource.title}`} title={`Add ${resource.singular}`} />
      </div>

      <div className="mt-8 min-h-0 flex-1">
        <ResourceForm
          fields={resource.fields}
          initialValues={resource.hasStatus ? { status: 'draft' } : {}}
          entities={entities}
          slugSource={resource.slugSource}
          action={createAction.bind(null, resourceSlug)}
          cancelHref={`/wp-admin/content/${resourceSlug}`}
        />
      </div>
    </div>
  );
}

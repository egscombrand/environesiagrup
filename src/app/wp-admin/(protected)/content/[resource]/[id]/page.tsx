import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getResource } from '@/lib/admin/resources';
import { getResourceRow } from '@/lib/admin/crud';
import { PageHeader } from '@/components/admin/page-header';
import { ResourceForm } from '@/components/admin/resource-form';
import { ProjectGallery } from '@/components/admin/project-gallery';
import { updateAction } from '../actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resource: string }>;
}): Promise<Metadata> {
  const { resource: resourceSlug } = await params;
  const resource = getResource(resourceSlug);
  return { title: resource ? `Edit ${resource.singular}` : 'Content' };
}

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: resourceSlug, id } = await params;
  const resource = getResource(resourceSlug);
  if (!resource) notFound();

  const { supabase, profile } = await requireProfile();
  const canWrite = resource.authorScoped
    ? ['super_admin', 'editor', 'author'].includes(profile.role)
    : ['super_admin', 'editor'].includes(profile.role);
  if (!canWrite) redirect('/wp-admin/unauthorized');

  const row = await getResourceRow(resource, id, supabase);
  if (!row) notFound();

  const needsEntities = resource.fields.some((f) => f.type === 'entity-select' || f.type === 'entity-multiselect');
  const entities = needsEntities
    ? ((await supabase.from('entities').select('id, name').is('deleted_at', null).order('sort_order')).data ?? [])
    : [];

  const galleryImages =
    resourceSlug === 'projects'
      ? ((await supabase.from('project_images').select('id, image_path, alt_text').eq('project_id', id).order('sort_order'))
          .data ?? [])
      : null;

  return (
    <div>
      <PageHeader eyebrow={`Content / ${resource.title}`} title={`Edit ${resource.singular}`} />

      <div className="mt-8">
        <ResourceForm
          fields={resource.fields}
          initialValues={row}
          entities={entities}
          action={updateAction.bind(null, resourceSlug, id)}
          cancelHref={`/wp-admin/content/${resourceSlug}`}
          successMessage="Changes saved successfully."
        />
      </div>

      {galleryImages ? <ProjectGallery projectId={id} images={galleryImages} /> : null}
    </div>
  );
}

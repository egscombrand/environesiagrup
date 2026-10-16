import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
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

  // h-full + flex-col: PageHeader never scrolls, ResourceForm gets a real
  // bounded height to scroll its own content within (see EditorFrame in
  // editor-layout.tsx and admin-shell.tsx for where that h-full comes from).
  // Projects is the one resource with extra page content below the form
  // (ProjectGallery) — there, the form gets a fixed viewport-relative height
  // instead of "all remaining space", so the gallery still has room to flow
  // normally underneath it, with the page (not the form) scrolling to reach it.
  return (
    <div className={galleryImages ? 'flex min-h-0 flex-col' : 'flex h-full min-h-0 flex-col'}>
      <div className="shrink-0">
        <PageHeader
          eyebrow={`Content / ${resource.title}`}
          title={`Edit ${resource.singular}`}
          action={
            resourceSlug === 'entities' ? (
              <Link
                href={`/wp-admin/content/entities/${id}/story`}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#e3e8ee] px-4 py-2 text-small font-medium text-ink hover:bg-[#f4f6f9]"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Kelola Galeri Perusahaan
              </Link>
            ) : undefined
          }
        />
      </div>

      <div className={galleryImages ? 'mt-8 h-[70vh] min-h-0 shrink-0' : 'mt-8 min-h-0 flex-1'}>
        <ResourceForm
          fields={resource.fields}
          initialValues={row}
          entities={entities}
          slugSource={resource.slugSource}
          action={updateAction.bind(null, resourceSlug, id)}
          cancelHref={`/wp-admin/content/${resourceSlug}`}
        />
      </div>

      {galleryImages ? (
        <div className="mt-8 shrink-0">
          <ProjectGallery projectId={id} images={galleryImages} />
        </div>
      ) : null}
    </div>
  );
}

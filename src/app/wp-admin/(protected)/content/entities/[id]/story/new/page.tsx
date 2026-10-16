import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getEntityByIdForAdmin } from '@/lib/cms/entities';
import { storySceneFields } from '@/lib/admin/resources/story-scenes';
import { PageHeader } from '@/components/admin/page-header';
import { ResourceForm } from '@/components/admin/resource-form';
import { createStorySceneAction } from '../actions';

export const metadata: Metadata = { title: 'Tambah Foto Galeri' };

export default async function NewStoryScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();

  const entity = await getEntityByIdForAdmin(id);
  if (!entity) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader eyebrow={`Content / Entities / ${entity.name} / Galeri`} title="Tambah Foto Galeri" />
      </div>

      <div className="mt-8 min-h-0 flex-1">
        <ResourceForm
          fields={storySceneFields}
          initialValues={{ status: 'published' }}
          action={createStorySceneAction.bind(null, id)}
          cancelHref={`/wp-admin/content/entities/${id}/story`}
        />
      </div>
    </div>
  );
}

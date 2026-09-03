import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getEntityByIdForAdmin } from '@/lib/cms/entities';
import { storySceneFields } from '@/lib/admin/resources/story-scenes';
import { PageHeader } from '@/components/admin/page-header';
import { ResourceForm } from '@/components/admin/resource-form';
import { createStorySceneAction } from '../actions';

export const metadata: Metadata = { title: 'Add Scene' };

export default async function NewStoryScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();

  const entity = await getEntityByIdForAdmin(id);
  if (!entity) notFound();

  return (
    <div>
      <PageHeader eyebrow={`Content / Entities / ${entity.name} / Story`} title="Add Scene" />

      <div className="mt-8">
        <ResourceForm
          fields={storySceneFields}
          initialValues={{ status: 'published' }}
          action={createStorySceneAction.bind(null, id)}
          cancelHref={`/wp-admin/content/entities/${id}/story`}
          successMessage="Scene added."
        />
      </div>
    </div>
  );
}

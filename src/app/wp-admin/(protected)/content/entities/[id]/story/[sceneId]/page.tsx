import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { getEntityByIdForAdmin } from '@/lib/cms/entities';
import { getStorySceneByIdForAdmin } from '@/lib/cms/story-scenes';
import { storySceneFields } from '@/lib/admin/resources/story-scenes';
import { PageHeader } from '@/components/admin/page-header';
import { ResourceForm } from '@/components/admin/resource-form';
import { updateStorySceneAction } from '../actions';

export const metadata: Metadata = { title: 'Edit Scene' };

export default async function EditStoryScenePage({
  params,
}: {
  params: Promise<{ id: string; sceneId: string }>;
}) {
  const { id, sceneId } = await params;
  await requireProfile();

  const entity = await getEntityByIdForAdmin(id);
  if (!entity) notFound();

  const scene = await getStorySceneByIdForAdmin(sceneId);
  if (!scene || scene.entity_id !== id) notFound();

  return (
    <div>
      <PageHeader eyebrow={`Content / Entities / ${entity.name} / Story`} title="Edit Scene" />

      <div className="mt-8">
        <ResourceForm
          fields={storySceneFields}
          initialValues={scene}
          action={updateStorySceneAction.bind(null, id, sceneId)}
          cancelHref={`/wp-admin/content/entities/${id}/story`}
          successMessage="Scene updated."
        />
      </div>
    </div>
  );
}

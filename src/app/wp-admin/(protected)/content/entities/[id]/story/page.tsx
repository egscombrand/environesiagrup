import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus, BookOpen } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { getEntityByIdForAdmin } from '@/lib/cms/entities';
import { listStoryScenesForAdmin } from '@/lib/cms/story-scenes';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { StorySceneList } from '@/components/admin/story-scene-list';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entity = await getEntityByIdForAdmin(id);
  return { title: entity ? `Company Story — ${entity.name}` : 'Company Story' };
}

export default async function CompanyStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();

  const entity = await getEntityByIdForAdmin(id);
  if (!entity) notFound();

  const scenes = await listStoryScenesForAdmin(id);

  return (
    <div>
      <PageHeader
        eyebrow={`Content / Entities / ${entity.name}`}
        title="Company Story"
        description="The ordered scenes shown when a visitor opens this company's story on the homepage. Drag to reorder."
        action={
          <Link
            href={`/wp-admin/content/entities/${id}/story/new`}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-forest px-4 py-2 text-small font-medium text-paper hover:opacity-90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Scene
          </Link>
        }
      />

      <div className="mt-6">
        {scenes.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No scenes yet"
            description="This company's story is empty — the homepage falls back to its short description until at least one scene is added."
          />
        ) : (
          <StorySceneList entityId={id} scenes={scenes} />
        )}
      </div>
    </div>
  );
}

import { getPublishedEntities } from '@/lib/cms/entities';
import { getPublishedStoryScenesByEntity } from '@/lib/cms/story-scenes';
import { getBisnisLayanan } from '@/lib/cms/bisnis-layanan';
import { BrandTabs } from '@/components/bisnis-layanan/brand-tabs';

export async function BrandTabsSection() {
  const entities = await getPublishedEntities();

  if (entities.length === 0) return null;

  // Real photo carousel per brand (see ecosystem-exhibition.tsx) — only
  // rendered for a brand that actually has published scenes; never a
  // fabricated/placeholder gallery for the rest.
  const [scenesByEntity, { groupPhoto }] = await Promise.all([
    getPublishedStoryScenesByEntity(entities.map((entity) => entity.id)),
    getBisnisLayanan(),
  ]);

  return <BrandTabs entities={entities} scenesByEntity={scenesByEntity} groupPhoto={groupPhoto} />;
}

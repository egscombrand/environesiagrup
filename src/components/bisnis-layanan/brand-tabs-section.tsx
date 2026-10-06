import { getPublishedEntities } from '@/lib/cms/entities';
import { BrandTabs } from '@/components/bisnis-layanan/brand-tabs';

export async function BrandTabsSection() {
  const entities = await getPublishedEntities();

  if (entities.length === 0) return null;

  return <BrandTabs entities={entities} />;
}

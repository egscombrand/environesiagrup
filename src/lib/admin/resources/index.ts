import { entitiesResource } from './entities';
import { pillarsResource } from './pillars';
import { heroResource } from './hero';
import { statsResource } from './stats';
import { projectsResource } from './projects';
import { siaranPersResource } from './siaran-pers';
import { beritaPerusahaanResource } from './berita-perusahaan';
import { leadershipResource } from './leadership';
import { milestonesResource } from './milestones';
import { documentsResource } from './documents';
import { jobsResource } from './jobs';
import { clientsResource } from './clients';
import type { ResourceConfig } from './types';

export const RESOURCES = {
  entities: entitiesResource,
  pillars: pillarsResource,
  hero: heroResource,
  stats: statsResource,
  projects: projectsResource,
  'siaran-pers': siaranPersResource,
  'berita-perusahaan': beritaPerusahaanResource,
  leadership: leadershipResource,
  milestones: milestonesResource,
  documents: documentsResource,
  jobs: jobsResource,
  clients: clientsResource,
} satisfies Record<string, ResourceConfig>;

export type ResourceSlug = keyof typeof RESOURCES;

export function getResource(slug: string): ResourceConfig | undefined {
  return RESOURCES[slug as ResourceSlug];
}

export * from './types';

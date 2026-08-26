import { entitiesResource } from './entities';
import { pillarsResource } from './pillars';
import { heroResource } from './hero';
import { statsResource } from './stats';
import { projectsResource } from './projects';
import { postsResource } from './posts';
import { leadershipResource } from './leadership';
import { milestonesResource } from './milestones';
import { documentsResource } from './documents';
import { jobsResource } from './jobs';
import type { ResourceConfig } from './types';

export const RESOURCES = {
  entities: entitiesResource,
  pillars: pillarsResource,
  hero: heroResource,
  stats: statsResource,
  projects: projectsResource,
  posts: postsResource,
  leadership: leadershipResource,
  milestones: milestonesResource,
  documents: documentsResource,
  jobs: jobsResource,
} satisfies Record<string, ResourceConfig>;

export type ResourceSlug = keyof typeof RESOURCES;

export function getResource(slug: string): ResourceConfig | undefined {
  return RESOURCES[slug as ResourceSlug];
}

export * from './types';

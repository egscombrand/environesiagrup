import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectImageRow = Database['public']['Tables']['project_images']['Row'];

export type ProjectImage = ProjectImageRow & { url?: string };

export type Project = ProjectRow & {
  featuredImageUrl?: string;
  entityIds: string[];
  images: ProjectImage[];
};

export type ProjectPin = {
  id: string;
  title: string;
  slug: string;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
};

function mapProject(row: ProjectRow, entityIds: string[], images: ProjectImageRow[]): Project {
  return {
    ...row,
    featuredImageUrl: publicMediaUrl(row.featured_image_path),
    entityIds,
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({ ...image, url: publicMediaUrl(image.image_path) })),
  };
}

async function attachRelations(
  supabase: SupabaseClient<Database>,
  rows: ProjectRow[]
): Promise<Project[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);

  const [{ data: relations, error: relationsError }, { data: images, error: imagesError }] = await Promise.all([
    supabase.from('project_entities').select('project_id, entity_id').in('project_id', ids),
    supabase.from('project_images').select('*').in('project_id', ids),
  ]);

  if (relationsError) throw new Error(`Failed to load project entities: ${relationsError.message}`);
  if (imagesError) throw new Error(`Failed to load project images: ${imagesError.message}`);

  const entitiesByProject = new Map<string, string[]>();
  for (const relation of relations ?? []) {
    const list = entitiesByProject.get(relation.project_id) ?? [];
    list.push(relation.entity_id);
    entitiesByProject.set(relation.project_id, list);
  }

  const imagesByProject = new Map<string, ProjectImageRow[]>();
  for (const image of images ?? []) {
    const list = imagesByProject.get(image.project_id) ?? [];
    list.push(image);
    imagesByProject.set(image.project_id, list);
  }

  return rows.map((row) =>
    mapProject(row, entitiesByProject.get(row.id) ?? [], imagesByProject.get(row.id) ?? [])
  );
}

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return attachRelations(supabase, data ?? []);
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw new Error(`Failed to load project "${slug}": ${error.message}`);
  if (!data) return null;
  const [project] = await attachRelations(supabase, [data]);
  return project;
}

export async function getPublishedProjectSlugs(): Promise<string[]> {
  const projects = await getPublishedProjects();
  return projects.map((project) => project.slug);
}

/** Lightweight rows for the world-map pins — published projects with coordinates only. */
export async function getPublishedProjectPins(): Promise<ProjectPin[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, slug, country, city, latitude, longitude')
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) throw new Error(`Failed to load project pins: ${error.message}`);
  return data ?? [];
}

export async function listProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return attachRelations(supabase, data ?? []);
}

export async function getProjectByIdForAdmin(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load project: ${error.message}`);
  if (!data) return null;
  const [project] = await attachRelations(supabase, [data]);
  return project;
}

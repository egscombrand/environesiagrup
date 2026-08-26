'use server';

import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

export async function addProjectImageAction(projectId: string, imagePath: string, altText: string) {
  const { supabase } = await requireRole(['super_admin', 'editor']);

  const { count } = await supabase
    .from('project_images')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  const { error } = await supabase.from('project_images').insert({
    project_id: projectId,
    image_path: imagePath,
    alt_text: altText || null,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };
  revalidatePublicSite();
  return {};
}

export async function removeProjectImageAction(imageId: string) {
  const { supabase } = await requireRole(['super_admin', 'editor']);
  const { error } = await supabase.from('project_images').delete().eq('id', imageId);
  if (error) return { error: error.message };
  revalidatePublicSite();
  return {};
}

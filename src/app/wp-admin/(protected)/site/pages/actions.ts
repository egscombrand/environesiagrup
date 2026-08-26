'use server';

import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

export async function toggleSectionAction(sectionId: string, enabled: boolean) {
  const { supabase } = await requireRole(['super_admin']);
  const { error } = await supabase
    .from('page_sections')
    .update({ status: enabled ? 'published' : 'draft' })
    .eq('id', sectionId);
  if (error) return { error: error.message };
  revalidatePublicSite();
  return {};
}

export async function moveSectionAction(sectionId: string, direction: 'up' | 'down', pageId: string) {
  const { supabase } = await requireRole(['super_admin']);
  const { data: sections } = await supabase
    .from('page_sections')
    .select('id, sort_order')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true });

  if (!sections) return {};
  const index = sections.findIndex((s) => s.id === sectionId);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sections.length) return {};

  const a = sections[index];
  const b = sections[swapIndex];
  await supabase.from('page_sections').update({ sort_order: b.sort_order }).eq('id', a.id);
  await supabase.from('page_sections').update({ sort_order: a.sort_order }).eq('id', b.id);

  revalidatePublicSite();
  return {};
}

export async function updateSectionOverrideAction(sectionId: string, formData: FormData) {
  const { supabase } = await requireRole(['super_admin']);
  const title_override = String(formData.get('title_override') ?? '') || null;
  const subtitle_override = String(formData.get('subtitle_override') ?? '') || null;

  const { error } = await supabase
    .from('page_sections')
    .update({ title_override, subtitle_override })
    .eq('id', sectionId);
  if (error) return { error: error.message };
  revalidatePublicSite();
  return {};
}

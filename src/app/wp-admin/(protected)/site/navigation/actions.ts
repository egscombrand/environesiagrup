'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

const schema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  parent_id: z.string().uuid().optional().or(z.literal('')),
  menu: z.enum(['header', 'footer']),
  status: z.enum(['draft', 'published', 'archived']),
  open_new_tab: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

function parse(formData: FormData) {
  return schema.safeParse({
    label: formData.get('label'),
    url: formData.get('url'),
    parent_id: formData.get('parent_id') || undefined,
    menu: formData.get('menu'),
    status: formData.get('status'),
    open_new_tab: formData.has('open_new_tab'),
    sort_order: formData.get('sort_order') || 0,
  });
}

export async function createNavigationAction(formData: FormData) {
  const { supabase } = await requireRole(['super_admin']);
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const { parent_id, ...rest } = parsed.data;
  const { error } = await supabase.from('navigation_items').insert({ ...rest, parent_id: parent_id || null });
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function updateNavigationAction(id: string, formData: FormData) {
  const { supabase } = await requireRole(['super_admin']);
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const { parent_id, ...rest } = parsed.data;
  const { error } = await supabase
    .from('navigation_items')
    .update({ ...rest, parent_id: parent_id || null })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function deleteNavigationAction(id: string) {
  const { supabase } = await requireRole(['super_admin']);
  const { error } = await supabase.from('navigation_items').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePublicSite();
  return {};
}

export async function moveNavigationAction(id: string, direction: 'up' | 'down', menu: string) {
  const { supabase } = await requireRole(['super_admin']);
  const { data: items } = await supabase
    .from('navigation_items')
    .select('id, sort_order')
    .eq('menu', menu)
    .order('sort_order', { ascending: true });

  if (!items) return {};
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return {};

  const a = items[index];
  const b = items[swapIndex];
  await supabase.from('navigation_items').update({ sort_order: b.sort_order }).eq('id', a.id);
  await supabase.from('navigation_items').update({ sort_order: a.sort_order }).eq('id', b.id);

  revalidatePublicSite();
  return {};
}

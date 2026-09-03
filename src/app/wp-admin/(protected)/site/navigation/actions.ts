'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { validateReorderScope } from '@/lib/admin/navigation-reorder';

const schema = z.object({
  label: z.string().min(1),
  label_en: z.string().optional(),
  label_zh: z.string().optional(),
  url: z.string().min(1),
  slug: z.string().optional(),
  parent_id: z.string().uuid().optional().or(z.literal('')),
  menu: z.enum(['header', 'footer']),
  status: z.enum(['draft', 'published', 'archived']),
  open_new_tab: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

function parse(formData: FormData) {
  return schema.safeParse({
    label: formData.get('label'),
    label_en: formData.get('label_en') || undefined,
    label_zh: formData.get('label_zh') || undefined,
    url: formData.get('url'),
    slug: formData.get('slug') || undefined,
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

  const { parent_id, label_en, label_zh, slug, ...rest } = parsed.data;
  const { error } = await supabase.from('navigation_items').insert({
    ...rest,
    parent_id: parent_id || null,
    label_en: label_en || null,
    label_zh: label_zh || null,
    slug: slug || null,
  });
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

export async function updateNavigationAction(id: string, formData: FormData) {
  const { supabase } = await requireRole(['super_admin']);
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const { parent_id, label_en, label_zh, slug, ...rest } = parsed.data;
  const { error } = await supabase
    .from('navigation_items')
    .update({
      ...rest,
      parent_id: parent_id || null,
      label_en: label_en || null,
      label_zh: label_zh || null,
      slug: slug || null,
    })
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

const reorderSchema = z.object({
  menu: z.enum(['header', 'footer']),
  parentId: z.string().uuid().nullable(),
  orderedIds: z.array(z.string().uuid()).min(1),
});

export async function reorderNavigationAction(menu: 'header' | 'footer', parentId: string | null, orderedIds: string[]) {
  const { supabase } = await requireRole(['super_admin']);

  const parsed = reorderSchema.safeParse({ menu, parentId, orderedIds });
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const baseQuery = supabase.from('navigation_items').select('id').eq('menu', parsed.data.menu);
  const { data: rows, error: fetchError } = await (parsed.data.parentId
    ? baseQuery.eq('parent_id', parsed.data.parentId)
    : baseQuery.is('parent_id', null));
  if (fetchError) return { error: fetchError.message };

  const existingIds = (rows ?? []).map((row) => row.id);
  if (!validateReorderScope(existingIds, parsed.data.orderedIds)) {
    return { error: 'Item order is out of date. Refresh and try again.' };
  }

  const results = await Promise.all(
    parsed.data.orderedIds.map((id, index) =>
      supabase.from('navigation_items').update({ sort_order: index }).eq('id', id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePublicSite();
  return {};
}

const reparentSchema = z.object({
  menu: z.enum(['header', 'footer']),
  itemId: z.string().uuid(),
  newParentId: z.string().uuid(),
});

// Drag-to-nest: makes a top-level item a child of another top-level item.
// Only that direction is supported (matches the 2-level cap enforced
// elsewhere) — un-nesting an item stays a job for the "Parent Menu" select
// in the edit form, which can set it back to top-level.
export async function reparentNavigationAction(menu: 'header' | 'footer', itemId: string, newParentId: string) {
  const { supabase } = await requireRole(['super_admin']);

  const parsed = reparentSchema.safeParse({ menu, itemId, newParentId });
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };
  if (parsed.data.itemId === parsed.data.newParentId) return { error: 'An item cannot be its own parent.' };

  const { data: rows, error: fetchError } = await supabase
    .from('navigation_items')
    .select('id, parent_id')
    .eq('menu', parsed.data.menu)
    .in('id', [parsed.data.itemId, parsed.data.newParentId]);
  if (fetchError) return { error: fetchError.message };

  const item = rows?.find((row) => row.id === parsed.data.itemId);
  const target = rows?.find((row) => row.id === parsed.data.newParentId);
  if (!item || !target) return { error: 'Item not found in this menu.' };
  if (item.parent_id !== null) return { error: 'Only top-level items can be nested this way.' };
  if (target.parent_id !== null) return { error: 'Can only nest under a top-level item.' };

  const { count: childCount, error: childCountError } = await supabase
    .from('navigation_items')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', parsed.data.itemId);
  if (childCountError) return { error: childCountError.message };
  if ((childCount ?? 0) > 0) {
    return { error: 'This item already has its own submenu and can’t be nested under another item.' };
  }

  const { count: destinationCount, error: destinationCountError } = await supabase
    .from('navigation_items')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', parsed.data.newParentId);
  if (destinationCountError) return { error: destinationCountError.message };

  const { error } = await supabase
    .from('navigation_items')
    .update({ parent_id: parsed.data.newParentId, sort_order: destinationCount ?? 0 })
    .eq('id', parsed.data.itemId);
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

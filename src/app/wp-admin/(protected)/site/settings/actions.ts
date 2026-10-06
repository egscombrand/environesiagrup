'use server';

import { z } from 'zod';
import { requireRole } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

const schema = z.object({
  site_name: z.string().min(1),
  tagline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  map_url: z.string().optional(),
  google_maps_url: z.string().optional(),
  social_instagram: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_facebook: z.string().optional(),
  social_youtube: z.string().optional(),
  social_tiktok: z.string().optional(),
  social_twitter: z.string().optional(),
  seo_default_title: z.string().optional(),
  seo_default_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_robots: z.string().optional(),
  footer_copyright: z.string().optional(),
  footer_description: z.string().optional(),
  logo_path: z.string().optional(),
  favicon_path: z.string().optional(),
  seo_default_og_image: z.string().optional(),
  milestones_eyebrow: z.string().optional(),
  milestones_intro: z.string().optional(),
  capabilities_subtext: z.string().optional(),
});

export type SettingsFormState = { error?: string; success?: boolean };

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const { supabase, user } = await requireRole(['super_admin']);

  const raw = Object.fromEntries(schema.keyof().options.map((key) => [key, String(formData.get(key) ?? '') || undefined]));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(', ') };

  const { error } = await supabase
    .from('site_settings')
    .update({ ...parsed.data, updated_by: user.id })
    .eq('id', 1);

  if (error) return { error: error.message };
  revalidatePublicSite();
  return { success: true };
}

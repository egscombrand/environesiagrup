import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

export type SiteSettings = SiteSettingsRow & {
  logoUrl?: string;
  faviconUrl?: string;
};

function mapSettings(row: SiteSettingsRow): SiteSettings {
  return {
    ...row,
    logoUrl: publicMediaUrl(row.logo_path),
    faviconUrl: publicMediaUrl(row.favicon_path),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  if (error) throw new Error(`Failed to load site settings: ${error.message}`);
  return mapSettings(data);
}

import { createPublicClient } from '@/lib/supabase/public';
import { publicMediaUrl } from '@/lib/cms/media';

export type ClientLogo = {
  id: string;
  name: string;
  logoUrl?: string;
  order: number;
};

/**
 * Active clients and partners, in the order set in wp-admin (migration 0028).
 * If the table is missing or the read fails, this returns an empty list, and the
 * section shows its own empty state. No client is ever invented.
 */
export async function getClientsAndPartners(): Promise<ClientLogo[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('clients')
      .select('id, client_name, logo_path, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      name: row.client_name,
      logoUrl: publicMediaUrl(row.logo_path),
      order: row.sort_order,
    }));
  } catch {
    return [];
  }
}

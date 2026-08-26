import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type DocumentRow = Database['public']['Tables']['documents']['Row'];

export type CmsDocument = DocumentRow & { fileUrl?: string };

function mapDocument(row: DocumentRow): CmsDocument {
  return { ...row, fileUrl: row.file_url ?? publicMediaUrl(row.file_path) };
}

export async function getPublishedDocuments(category?: string): Promise<CmsDocument[]> {
  const supabase = createPublicClient();
  let query = supabase.from('documents').select('*').eq('status', 'published').is('deleted_at', null);
  if (category) query = query.eq('category', category);
  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load documents: ${error.message}`);
  return (data ?? []).map(mapDocument);
}

export async function listDocumentsForAdmin(): Promise<CmsDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load documents: ${error.message}`);
  return (data ?? []).map(mapDocument);
}

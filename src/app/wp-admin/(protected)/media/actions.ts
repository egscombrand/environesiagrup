'use server';

import { requireProfile } from '@/lib/admin/auth';
import { revalidatePublicSite } from '@/lib/admin/revalidate';

export async function registerMediaAction(input: {
  path: string;
  folder: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  altText?: string;
}) {
  const { supabase, user } = await requireProfile();

  const { error } = await supabase.from('media').insert({
    bucket: 'media',
    path: input.path,
    folder: input.folder,
    file_name: input.fileName,
    file_type: input.fileType,
    file_size: input.fileSize,
    alt_text: input.altText || null,
    uploaded_by: user.id,
  });

  if (error) return { error: error.message };
  return {};
}

export async function deleteMediaAction(id: string, storagePath: string) {
  const { supabase } = await requireProfile();

  await supabase.storage.from('media').remove([storagePath]);
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePublicSite();
  return {};
}

import type { Metadata } from 'next';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { MediaLibrary } from '@/components/admin/media-library';

export const metadata: Metadata = { title: 'Media Library' };

export default async function MediaLibraryPage() {
  const { supabase } = await requireProfile();
  const { data } = await supabase
    .from('media')
    .select('id, path, folder, file_name, file_type, file_size')
    .order('created_at', { ascending: false });

  return (
    <div>
      <PageHeader eyebrow="Media" title="Media Library" description="Upload and manage images and documents used across the site." />
      <div className="mt-8">
        <MediaLibrary items={data ?? []} />
      </div>
    </div>
  );
}

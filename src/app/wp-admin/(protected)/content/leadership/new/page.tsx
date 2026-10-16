import type { Metadata } from 'next';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { LeadershipForm } from '@/components/admin/leadership-form';
import { emptyLeadershipValue } from '../lead-form-value';

export const metadata: Metadata = { title: 'Tambah Kepemimpinan' };

export default async function NewLeadershipPage() {
  const { supabase, profile } = await requireProfile();
  const { data: entities } = await supabase.from('entities').select('id, name').order('sort_order', { ascending: true });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader eyebrow="Tentang Kami · Direktur Utama & Dewan Direksi" title="Tambah Kepemimpinan" />
      </div>
      <div className="mt-6 min-h-0 flex-1">
        <LeadershipForm id={null} initial={emptyLeadershipValue()} entities={entities ?? []} canWrite={['super_admin', 'editor'].includes(profile.role)} />
      </div>
    </div>
  );
}

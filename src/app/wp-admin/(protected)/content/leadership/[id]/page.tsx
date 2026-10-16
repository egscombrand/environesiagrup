import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { LeadershipForm } from '@/components/admin/leadership-form';
import { leadershipValueFromRow } from '../lead-form-value';

export const metadata: Metadata = { title: 'Kepemimpinan' };

export default async function LeadershipEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();

  const [{ data: row }, { data: entities }] = await Promise.all([
    supabase.from('leadership').select('*').eq('id', id).maybeSingle(),
    supabase.from('entities').select('id, name').order('sort_order', { ascending: true }),
  ]);
  if (!row) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader
          eyebrow="Tentang Kami · Direktur Utama & Dewan Direksi"
          title={row.name}
          description="Profil ini ditampilkan di halaman Direktur Utama & Dewan Direksi. Pendidikan, pengalaman, statistik, kontribusi, dan mengajar hanya tampil jika diisi."
        />
      </div>
      <div className="mt-6 min-h-0 flex-1">
        <LeadershipForm
          id={id}
          initial={leadershipValueFromRow(row as unknown as Record<string, unknown>)}
          entities={entities ?? []}
          canWrite={['super_admin', 'editor'].includes(profile.role)}
        />
      </div>
    </div>
  );
}

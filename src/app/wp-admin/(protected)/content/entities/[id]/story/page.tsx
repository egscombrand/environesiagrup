import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus, BookOpen } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { getEntityByIdForAdmin } from '@/lib/cms/entities';
import { listStoryScenesForAdmin } from '@/lib/cms/story-scenes';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { StorySceneList } from '@/components/admin/story-scene-list';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entity = await getEntityByIdForAdmin(id);
  return { title: entity ? `Galeri Perusahaan — ${entity.name}` : 'Galeri Perusahaan' };
}

export default async function CompanyStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireProfile();

  const entity = await getEntityByIdForAdmin(id);
  if (!entity) notFound();

  const scenes = await listStoryScenesForAdmin(id);
  const countLabel = scenes.length === 1 ? '1 foto tersimpan' : `${scenes.length} foto tersimpan`;

  return (
    <div>
      <PageHeader
        eyebrow={`Content / Entities / ${entity.name}`}
        title="Galeri Perusahaan"
        description={`Foto galeri yang tampil pada kartu perusahaan ini di section "Environesia". Terpisah dari Logo dan Foto Showcase. ${countLabel} — drag untuk mengatur urutan.`}
        action={
          <Link
            href={`/wp-admin/content/entities/${id}/story/new`}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#2a7793] px-4 py-2 text-small font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Foto
          </Link>
        }
      />

      <div className="mt-6">
        {scenes.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Belum ada foto galeri"
            description="Galeri perusahaan ini masih kosong — Front End menampilkan placeholder bermerek sampai setidaknya satu foto ditambahkan di sini."
          />
        ) : (
          <StorySceneList entityId={id} scenes={scenes} />
        )}
      </div>
    </div>
  );
}

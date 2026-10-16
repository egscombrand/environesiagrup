import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/admin/auth';
import { formatFieldLines } from '@/lib/admin/legal-fields';
import { PageHeader } from '@/components/admin/page-header';
import { LegalCardForm, type LegalCardFormValue } from '@/components/admin/legal-card-form';

export const metadata: Metadata = { title: 'Kartu Legalitas' };

export default async function LegalCardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();

  const { data: card } = await supabase.from('legal_cards').select('*').eq('id', id).maybeSingle();
  if (!card) notFound();

  const [{ data: entity }, { data: documents }] = await Promise.all([
    supabase.from('legal_entities').select('name').eq('id', card.entity_id).maybeSingle(),
    supabase.from('legal_documents').select('*').eq('card_id', id).order('sort_order', { ascending: true }),
  ]);

  const value: LegalCardFormValue = {
    category: card.category,
    logo: card.logo ?? '',
    logo_alt: card.logo_alt,
    title: card.title,
    subtitle: card.subtitle ?? '',
    introText: formatFieldLines(Array.isArray(card.intro) ? (card.intro as { label: string; value: string }[]) : []),
    documents: (documents ?? []).map((doc) => ({
      id: doc.id,
      title: doc.title,
      issuer: doc.issuer ?? '',
      description: doc.description ?? '',
      fieldsText: formatFieldLines(Array.isArray(doc.fields) ? (doc.fields as { label: string; value: string }[]) : []),
      external_url: doc.external_url ?? '',
      cta_label: doc.cta_label ?? '',
    })),
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader
          eyebrow={entity?.name ?? 'Legalitas'}
          title={card.title}
          description="Kartu ini memuat dokumen-dokumen yang tampil di halaman Legalitas. Isi kolom Nomor, Tanggal, dan lainnya dalam format Label: nilai, satu baris per isian."
        />
      </div>
      <div className="mt-6 min-h-0 flex-1">
        <LegalCardForm cardId={id} initial={value} canWrite={['super_admin', 'editor'].includes(profile.role)} />
      </div>
    </div>
  );
}

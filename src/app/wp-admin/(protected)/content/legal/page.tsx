import type { Metadata } from 'next';
import Link from 'next/link';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { createCardAction, updateEntityAction } from './actions';

export const metadata: Metadata = { title: 'Legalitas & Sertifikasi' };

export default async function LegalOverviewPage() {
  const { supabase } = await requireProfile();
  const [{ data: entities }, { data: cards }, { data: documents }] = await Promise.all([
    supabase.from('legal_entities').select('*').order('sort_order', { ascending: true }),
    supabase.from('legal_cards').select('*').order('sort_order', { ascending: true }),
    supabase.from('legal_documents').select('card_id'),
  ]);

  const docCount = new Map<string, number>();
  for (const d of documents ?? []) docCount.set(d.card_id, (docCount.get(d.card_id) ?? 0) + 1);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tentang Kami"
        title="Legalitas & Sertifikasi"
        description="Dokumen legal, perizinan, sertifikasi, dan akreditasi, dikelompokkan per entitas. Perubahan di sini langsung tampil di halaman Legalitas."
      />

      {(entities ?? []).length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[#e3e8ee] bg-white px-6 py-10 text-center text-small text-[#64748b]">
          Belum ada data legalitas. Pastikan migration 0027 sudah dijalankan.
        </p>
      ) : null}

      {(entities ?? []).map((entity) => {
        const entityCards = (cards ?? []).filter((c) => c.entity_id === entity.id);
        return (
          <section key={entity.id} className="rounded-[12px] border border-[#e3e8ee] bg-white">
            <form
              action={updateEntityAction.bind(null, entity.id)}
              className="grid gap-4 border-b border-[#e3e8ee] p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end md:p-6"
            >
              <label className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Nama entitas</span>
                <input name="name" required defaultValue={entity.name} className="mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink focus:border-[#2a7793] focus:outline-none focus:ring-2 focus:ring-[#2a7793]/15" />
              </label>
              <label className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Nama singkat</span>
                <input name="short_name" required defaultValue={entity.short_name} className="mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink focus:border-[#2a7793] focus:outline-none focus:ring-2 focus:ring-[#2a7793]/15" />
              </label>
              <label className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Nama badan hukum (opsional)</span>
                <input name="legal_name" defaultValue={entity.legal_name ?? ''} className="mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink focus:border-[#2a7793] focus:outline-none focus:ring-2 focus:ring-[#2a7793]/15" />
              </label>
              <button type="submit" className="rounded-[10px] bg-[#2a7793] px-4 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90">
                Simpan entitas
              </button>
            </form>

            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-h3 text-ink">Kartu dokumen</p>
                <form action={createCardAction.bind(null, entity.id)}>
                  <button type="submit" className="rounded-[10px] border border-[#e3e8ee] px-3.5 py-2 text-small text-ink transition-colors hover:border-[#2a7793]/40 hover:bg-[#2a7793]/[0.04]">
                    Tambah kartu
                  </button>
                </form>
              </div>

              {entityCards.length === 0 ? (
                <p className="mt-5 text-small text-[#64748b]">Belum ada kartu untuk entitas ini.</p>
              ) : (
                <ul className="mt-5 divide-y divide-line">
                  {entityCards.map((card) => (
                    <li key={card.id} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-small font-medium text-ink">{card.title}</p>
                        <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                          {card.category} · {docCount.get(card.id) ?? 0} dokumen
                        </p>
                      </div>
                      <Link
                        href={`/wp-admin/content/legal/cards/${card.id}`}
                        className="shrink-0 rounded-[10px] border border-[#e3e8ee] px-3 py-2 text-small text-ink transition-colors hover:border-[#2a7793]/40 hover:bg-[#2a7793]/[0.04]"
                      >
                        Kelola
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

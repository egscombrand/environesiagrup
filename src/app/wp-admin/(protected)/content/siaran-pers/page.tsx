import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Inbox, PenLine } from 'lucide-react';
import { requireProfile } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/page-header';
import { SiaranPersTabs } from '@/components/admin/siaran-pers-tabs';
import { StatusBadge } from '@/components/admin/status-badge';
import { StatusSelect } from '@/components/admin/status-select';
import { DeleteButton } from '@/components/admin/delete-button';
import { ThumbnailBatchButton, ThumbnailRetryButton } from '@/components/admin/thumbnail-controls';

const THUMBNAIL_REASON_LABEL: Record<string, string> = {
  page_blocked: 'situs memblokir akses',
  page_not_found: 'halaman artikel tidak ada',
  page_unreachable: 'halaman tidak dapat diakses',
  no_image_found: 'tidak ada foto utama',
  image_not_accessible: 'foto tidak dapat diunduh',
  image_type_invalid: 'format foto tidak didukung',
};
import { EmptyState } from '@/components/admin/empty-state';
import { deleteAction, setStatusAction } from '@/app/wp-admin/(protected)/content/[resource]/actions';

export const metadata: Metadata = { title: 'Siaran Pers' };

const PAGE_SIZE = 25;

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function isExternal(url: string | null): url is string {
  return !!url && /^https?:\/\//i.test(url);
}

export default async function BeritaPerusahaanListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { supabase } = await requireProfile();
  const params = await searchParams;
  const q = one(params.q).replace(/[%_]/g, '');
  const owner = one(params.owner);
  const media = one(params.media);
  const year = one(params.year);
  const page = Math.max(1, Number(one(params.page)) || 1);

  // Filter options come from the rows themselves, so a brand or outlet that
  // only exists in an import shows up without any hard-coded list.
  const { data: facets } = await supabase.from('posts').select('owner, media, published_at').is('deleted_at', null);
  const owners = [...new Set((facets ?? []).map((r) => r.owner).filter((v): v is string => !!v))].sort();
  const medias = [...new Set((facets ?? []).map((r) => r.media).filter((v): v is string => !!v))].sort();
  const years = [
    ...new Set((facets ?? []).map((r) => r.published_at?.slice(0, 4)).filter((v): v is string => !!v)),
  ].sort((a, b) => b.localeCompare(a));

  let query = supabase
    .from('posts')
    .select('id, title, owner, media, published_at, source_url, status, needs_review, thumbnail_status, thumbnail_error_reason', { count: 'exact' })
    .is('deleted_at', null)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (q) query = query.ilike('title', `%${q}%`);
  if (owner) query = query.eq('owner', owner);
  if (media) query = query.eq('media', media);
  if (year) query = query.gte('published_at', `${year}-01-01`).lt('published_at', `${Number(year) + 1}-01-01`);

  const { data: rows, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const baseParams = new URLSearchParams({ ...(q && { q }), ...(owner && { owner }), ...(media && { media }), ...(year && { year }) });
  const pageHref = (p: number) => {
    const next = new URLSearchParams(baseParams);
    next.set('page', String(p));
    return `/wp-admin/content/berita-perusahaan?${next.toString()}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Siaran Pers"
        description="Seluruh berita dan siaran pers Environesia Company Group: kabar, kegiatan, pencapaian, dan informasi resmi."
      />
      <SiaranPersTabs active="list" />

      <form method="get" className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari judul berita…"
          className="w-full max-w-xs rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink outline-none focus:border-forest"
        />
        <select name="owner" defaultValue={owner} className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink">
          <option value="">Semua Owner</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select name="media" defaultValue={media} className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink">
          <option value="">Semua Media</option>
          {medias.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select name="year" defaultValue={year} className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink">
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-[10px] border border-line px-3.5 py-2 text-small text-ink hover:border-forest/40">
          Terapkan
        </button>
      </form>

      <ThumbnailBatchButton />

      {!rows || rows.length === 0 ? (
        <EmptyState icon={Inbox} title="Belum ada berita" description="Import dari Excel / CSV atau tambah berita baru." />
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-line bg-paper">
          <table className="w-full min-w-[960px] text-left text-small">
            <thead>
              <tr className="border-b border-line font-mono text-label uppercase text-slate">
                <th className="px-4 py-3">Thumbnail</th>
                <th className="px-4 py-3">Judul Press Release</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Media</th>
                <th className="px-4 py-3">Tanggal Rilis</th>
                <th className="px-4 py-3">Link Berita</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0 align-top hover:bg-stone/40">
                  <td className="max-w-[220px] px-4 py-3 text-label text-slate" title={row.thumbnail_error_reason ?? undefined}>
                    {row.thumbnail_status === 'found'
                      ? 'Ada'
                      : row.thumbnail_status === 'not_found'
                        ? `Tidak ditemukan${row.thumbnail_error_reason ? ` · ${THUMBNAIL_REASON_LABEL[row.thumbnail_error_reason] ?? row.thumbnail_error_reason}` : ''}`
                        : 'Belum'}
                  </td>
                  <td className="max-w-[360px] px-4 py-3 text-ink">
                    {row.title}
                    {row.needs_review ? (
                      <span className="ml-2 inline-block rounded-full border border-amber-500/40 px-2 py-0.5 text-label text-amber-700">
                        Need Review
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-ink">{row.owner ?? <span className="text-slate">—</span>}</td>
                  <td className="px-4 py-3 text-ink">{row.media ?? <span className="text-slate">—</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink">{formatDate(row.published_at)}</td>
                  <td className="px-4 py-3">
                    {isExternal(row.source_url) ? (
                      <a
                        href={row.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-forest hover:underline"
                      >
                        Lihat Berita
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-slate">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <StatusSelect
                        status={row.status}
                        onChange={setStatusAction.bind(null, 'posts', row.id)}
                      />
                      <Link
                        href={`/wp-admin/content/posts/${row.id}`}
                        aria-label={`Edit ${row.title}`}
                        title="Edit"
                        className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest"
                      >
                        <PenLine className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <DeleteButton action={deleteAction.bind(null, 'posts', row.id)} itemLabel={row.title} iconOnly />
                      {row.source_url ? <ThumbnailRetryButton postId={row.id} /> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <nav aria-label="Navigasi halaman" className="flex items-center justify-between text-small">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="text-ink hover:underline">
              ← Sebelumnya
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate">
            Halaman {page} dari {totalPages} · {total} berita
          </span>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className="text-ink hover:underline">
              Berikutnya →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

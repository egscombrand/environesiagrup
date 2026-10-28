'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

/**
 * Catches any unhandled exception from a protected admin page (dashboard,
 * every content resource list/form, site settings, users) — there was no
 * error boundary anywhere under /wp-admin before this, so a failed query
 * (RLS denial, a dropped Supabase connection, anything) fell through to
 * Next.js's bare default error page: no retry, no way back, and in
 * production no indication of what failed or where. This never shows
 * `error.message`/stack — Next.js already redacts those for Server
 * Component errors in production, and `error.digest` (not the message) is
 * the one safe-to-display value, since it's a correlation id for Vercel's
 * Runtime Logs, not the error content itself.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[wp-admin] unhandled page error', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e3e8ee] px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-5 w-5 text-danger" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-4 font-display text-h3 text-ink">Gagal memuat halaman ini</p>
      <p className="mt-1 max-w-sm text-small text-[#64748b]">
        Terjadi kesalahan saat memuat data. Coba muat ulang; jika masih gagal, hubungi admin teknis dengan kode
        referensi di bawah.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-[#94a3b8]">Ref: {error.digest}</p>
      ) : null}
      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-[10px] bg-[#2a7793] px-4 py-2 text-small font-medium text-white hover:opacity-90"
        >
          Coba Lagi
        </button>
        <Link
          href="/wp-admin/dashboard"
          className="rounded-[10px] border border-[#e3e8ee] px-4 py-2 text-small text-ink hover:bg-[#f4f6f9]"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

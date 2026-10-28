'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Catches errors one level above (protected)/error.tsx — specifically the
 * protected layout's own render (requireProfile + getRecentActivity), which
 * runs before AdminShell mounts, so that error.tsx boundary never gets a
 * chance to catch it. Also the safety net for /wp-admin/login itself. Same
 * "never show the raw message/stack, only the digest" rule as the inner
 * boundary — see its comment for why.
 */
export default function WpAdminRootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[wp-admin] unhandled root error', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-6 w-6 text-danger" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-4 text-body font-semibold text-ink">Terjadi kesalahan</p>
      <p className="mt-1 max-w-sm text-small text-[#64748b]">
        wp-admin gagal dimuat. Coba muat ulang; jika masih gagal, hubungi admin teknis dengan kode referensi di
        bawah.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-[#94a3b8]">Ref: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-[10px] bg-[#2a7793] px-4 py-2 text-small font-medium text-white hover:opacity-90"
      >
        Coba Lagi
      </button>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { refreshPostThumbnailAction } from '@/app/wp-admin/(protected)/content/siaran-pers/thumbnails/actions';
import { runThumbnailBatch } from './thumbnail-batch';
import { useToast } from './toast-provider';

/** "Ambil Ulang Thumbnail" for one article. No upload: the lookup reads the article's own link. */
export function ThumbnailRetryButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await refreshPostThumbnailAction(postId);
          if (!result.ok) toast('error', result.error);
          else if (result.status === 'found') toast('success', 'Thumbnail berhasil diambil dari artikel asli.');
          else toast('error', `Thumbnail tidak ditemukan: ${result.reason}`);
          router.refresh();
        })
      }
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#e3e8ee] px-2.5 py-1.5 text-label text-ink hover:border-[#2a7793]/40 disabled:opacity-40"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
      Ambil Ulang Thumbnail
    </button>
  );
}

/** Runs the batch for every article still waiting on a thumbnail lookup. */
export function ThumbnailBatchButton() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={running}
        onClick={async () => {
          setRunning(true);
          setProgress('Mengambil thumbnail…');
          try {
            const result = await runThumbnailBatch((p) =>
              setProgress(`Mengambil thumbnail… ${p.found} ditemukan, ${p.remaining} tersisa`)
            );
            toast(
              'success',
              `${result.processed} artikel diproses · ${result.found} thumbnail ditemukan · ${result.unavailable} masih tidak tersedia · ${result.failed} gagal`
            );
          } catch (error) {
            toast('error', error instanceof Error ? error.message : 'Gagal mengambil thumbnail.');
          } finally {
            setRunning(false);
            setProgress(null);
            router.refresh();
          }
        }}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#e3e8ee] px-3.5 py-2 text-small text-ink hover:border-[#2a7793]/40 disabled:opacity-40"
      >
        {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Ambil Thumbnail yang Tertunda
      </button>
      {progress ? <span className="text-small text-[#64748b]">{progress}</span> : null}
    </div>
  );
}

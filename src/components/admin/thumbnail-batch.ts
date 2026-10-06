import { processPendingThumbnailsAction } from '@/app/wp-admin/(protected)/content/siaran-pers/thumbnails/actions';

export type ThumbnailProgress = { processed: number; found: number; unavailable: number; failed: number; remaining: number };

/**
 * Runs the thumbnail lookup in small batches until nothing is left to check.
 * Each batch is a separate server call, so progress is real and a long run
 * never depends on one request staying open.
 */
export async function runThumbnailBatch(onProgress: (progress: ThumbnailProgress) => void): Promise<ThumbnailProgress> {
  const totals = { processed: 0, found: 0, unavailable: 0, failed: 0 };
  let remaining = 1;
  while (remaining > 0) {
    const result = await processPendingThumbnailsAction(8);
    if (!result.ok) throw new Error(result.error);
    totals.processed += result.processed;
    totals.found += result.found;
    totals.unavailable += result.unavailable;
    totals.failed += result.failed;
    remaining = result.remaining;
    onProgress({ ...totals, remaining });
    if (result.processed === 0) break;
  }
  return { ...totals, remaining };
}

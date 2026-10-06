'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import { requireRole } from '@/lib/admin/auth';
import { writeAuditLog } from '@/lib/admin/audit';
import { revalidatePublicSite } from '@/lib/admin/revalidate';
import { findArticleThumbnail } from '@/lib/admin/news-thumbnail';
import { THUMBNAIL_EXTRACTOR_VERSION } from '@/lib/admin/news-thumbnail-parse';
import type { Database } from '@/lib/supabase/database.types';

// Same roles that can edit posts.
const ALLOWED_ROLES = ['super_admin', 'editor', 'author'] as const;

export type ThumbnailRefreshResult =
  | { ok: true; status: 'found' }
  | { ok: true; status: 'not_found'; code: string; reason: string }
  | { ok: false; error: string };

export type ThumbnailBatchResult =
  | { ok: true; processed: number; found: number; unavailable: number; failed: number; remaining: number }
  | { ok: false; error: string };

// Failures where the article is fine but the image couldn't be reached
// ("gagal"), as opposed to articles that simply have no usable lead image.
const FAILED_CODES = new Set(['page_blocked', 'page_not_found', 'page_unreachable', 'image_not_accessible']);

type Supabase = SupabaseClient<Database>;

function isHttpLink(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Fetches the article's lead image and stores it in the media bucket. The
 * image is the one the media article itself declares; the admin never
 * uploads anything. A failed lookup is recorded as not_found and never fails
 * the article.
 */
type RefreshOutcome = { status: 'found' } | { status: 'not_found'; code: string; reason: string };

async function refreshThumbnail(supabase: Supabase, post: { id: string; source_url: string | null }): Promise<RefreshOutcome> {
  // Removes any stored copy from an earlier successful lookup, so a failed
  // retry never leaves an orphaned file behind.
  const clear = async (code: string) => {
    await supabase.storage
      .from('media')
      .remove(['jpg', 'png', 'webp'].map((ext) => `news-thumbnails/${post.id}.${ext}`));
    return supabase
      .from('posts')
      .update({
        thumbnail_status: 'not_found',
        thumbnail_error_reason: code,
        thumbnail_url: null,
        thumbnail_source_url: null,
        thumbnail_source: null,
        thumbnail_detection_method: null,
        thumbnail_extractor_version: THUMBNAIL_EXTRACTOR_VERSION,
      })
      .eq('id', post.id);
  };

  if (!isHttpLink(post.source_url)) {
    await clear('page_unreachable');
    return { status: 'not_found', code: 'page_unreachable', reason: 'Link berita kosong atau tidak valid.' };
  }

  const result = await findArticleThumbnail(post.source_url);
  // TEMPORARY debug logging — remove once thumbnails are verified end to end.
  console.info(`[thumbnail] post=${post.id}\n  ${result.trace.join('\n  ')}`);
  if (result.status === 'not_found') {
    console.info(`[thumbnail] post=${post.id} thumbnail_status=not_found code=${result.code} reason="${result.reason}"`);
    await clear(result.code);
    return { status: 'not_found', code: result.code, reason: result.reason };
  }

  const path = `news-thumbnails/${post.id}.${result.extension}`;
  const { error: uploadError } = await supabase.storage.from('media').upload(path, result.bytes, {
    contentType: result.contentType,
    upsert: true,
  });
  console.info(`[thumbnail] post=${post.id} storage upload ${path}: ${uploadError ? `FAILED ${uploadError.message}` : 'ok'}`);
  if (uploadError) {
    await clear('image_not_accessible');
    return { status: 'not_found', code: 'image_not_accessible', reason: `Gagal menyimpan thumbnail: ${uploadError.message}` };
  }

  const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(path);
  const { error: updateError } = await supabase
    .from('posts')
    .update({
      thumbnail_url: publicUrl.publicUrl,
      thumbnail_source_url: result.imageUrl,
      thumbnail_source: 'external_media',
      thumbnail_status: 'found',
      thumbnail_detection_method: result.detection,
      thumbnail_error_reason: null,
      thumbnail_extractor_version: THUMBNAIL_EXTRACTOR_VERSION,
    })
    .eq('id', post.id);
  console.info(`[thumbnail] post=${post.id} thumbnail_url=${publicUrl.publicUrl} thumbnail_status=found db=${updateError ? `FAILED ${updateError.message}` : 'ok'}`);
  return { status: 'found' };
}

/** Admin action: retries the thumbnail for one article ("Ambil Ulang Thumbnail"). */
export async function refreshPostThumbnailAction(postId: string): Promise<ThumbnailRefreshResult> {
  const { supabase, user } = await requireRole([...ALLOWED_ROLES]);

  const { data: post, error } = await supabase
    .from('posts')
    .select('id, source_url')
    .eq('id', postId)
    .is('deleted_at', null)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!post) return { ok: false, error: 'Berita tidak ditemukan.' };

  const outcome = await refreshThumbnail(supabase, post);
  await writeAuditLog(supabase, {
    userId: user.id,
    action: 'update',
    resource: 'posts',
    resourceId: postId,
    newData: { thumbnail_status: outcome.status },
  });
  revalidatePublicSite();
  return outcome.status === 'found'
    ? { ok: true, status: 'found' }
    : { ok: true, status: 'not_found', code: outcome.code, reason: outcome.reason };
}

/**
 * Processes a small batch of articles that haven't been checked by the current
 * extractor. Called repeatedly by the admin UI until nothing remains. Each
 * article is marked with the current version as it's processed, so the batch
 * always reaches zero remaining.
 */
export async function processPendingThumbnailsAction(limit = 8): Promise<ThumbnailBatchResult> {
  const { supabase } = await requireRole([...ALLOWED_ROLES]);
  const size = Math.min(Math.max(1, limit), 20);
  const pending = `thumbnail_extractor_version.is.null,thumbnail_extractor_version.lt.${THUMBNAIL_EXTRACTOR_VERSION}`;

  const { data: batch, error } = await supabase
    .from('posts')
    .select('id, source_url')
    .is('deleted_at', null)
    .not('source_url', 'is', null)
    .or(pending)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(size);
  if (error) return { ok: false, error: error.message };

  let found = 0;
  let unavailable = 0;
  let failed = 0;
  for (const post of batch ?? []) {
    const outcome = await refreshThumbnail(supabase, post);
    if (outcome.status === 'found') found++;
    else if (FAILED_CODES.has(outcome.code)) failed++;
    else unavailable++;
  }

  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .is('deleted_at', null)
    .not('source_url', 'is', null)
    .or(pending);

  revalidatePublicSite();
  return { ok: true, processed: batch?.length ?? 0, found, unavailable, failed, remaining: count ?? 0 };
}

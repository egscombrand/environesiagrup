import { SUPABASE_URL } from '@/lib/supabase/env';

const MEDIA_BUCKET = 'media';

/** Turns a Storage object path (as stored in *_path columns) into a public URL. */
export function publicMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path.replace(/^\/+/, '')}`;
}

export { MEDIA_BUCKET };

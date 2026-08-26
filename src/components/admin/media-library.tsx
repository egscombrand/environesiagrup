'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Copy, Images, Search, UploadCloud } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { publicMediaUrl } from '@/lib/cms/media';
import { registerMediaAction, deleteMediaAction } from '@/app/wp-admin/(protected)/media/actions';
import { EmptyState } from './empty-state';
import { DeleteButton } from './delete-button';
import { useToast } from './toast-provider';

const FOLDERS = ['logos', 'hero', 'entities', 'projects', 'leadership', 'posts', 'documents', 'general'];
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/avif'];

export type MediaItem = {
  id: string;
  path: string;
  folder: string | null;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
};

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [folder, setFolder] = useState('general');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter !== 'all' && item.folder !== filter) return false;
      if (search && !item.file_name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, search]);

  async function handleFile(file: File) {
    if (file.size > 25 * 1024 * 1024) {
      toast('error', 'File size must be under 25 MB.');
      return;
    }

    setUploading(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const storagePath = `${folder}/${Date.now()}-${safeName}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from('media').upload(storagePath, file, {
      contentType: file.type,
    });

    if (uploadError) {
      setUploading(false);
      toast('error', `Upload failed: ${uploadError.message}`);
      return;
    }

    const result = await registerMediaAction({
      path: storagePath,
      folder,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    setUploading(false);
    if (result?.error) {
      toast('error', result.error);
      return;
    }
    if (inputRef.current) inputRef.current.value = '';
    toast('success', 'File uploaded successfully.');
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-dashed border-line bg-paper p-4">
        <UploadCloud className="h-5 w-5 shrink-0 text-slate" aria-hidden="true" />
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink"
        >
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              Upload to: {f}/
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="text-small text-ink file:mr-3 file:rounded-[8px] file:border file:border-line file:bg-paper file:px-3 file:py-1.5 file:text-small"
        />
        {uploading ? <span className="text-small text-slate">Uploading…</span> : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[10px] border border-line bg-paper py-2 pl-9 pr-3 text-small text-ink"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-[10px] border border-line bg-paper px-3 py-2 text-small text-ink"
        >
          <option value="all">All folders</option>
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f}/
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Images}
            title={items.length === 0 ? 'No media yet' : 'No files match your search'}
            description={items.length === 0 ? 'Files you upload will appear here.' : undefined}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {filtered.map((item) => {
            const url = publicMediaUrl(item.path) ?? '';
            const isImage = IMAGE_TYPES.includes(item.file_type ?? '');
            return (
              <div key={item.id} className="rounded-[14px] border border-line bg-paper p-2">
                {isImage ? (
                  <Image src={url} alt="" width={160} height={120} className="h-24 w-full rounded-[8px] object-cover" />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-[8px] bg-stone text-small text-slate">
                    {item.file_type?.split('/')[1] ?? 'file'}
                  </div>
                )}
                <p className="mt-2 truncate text-small text-ink" title={item.file_name}>
                  {item.file_name}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      toast('success', 'URL copied to clipboard.');
                    }}
                    aria-label="Copy URL"
                    title="Copy URL"
                    className="rounded-[8px] p-1.5 text-slate hover:bg-forest/10 hover:text-forest"
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <DeleteButton
                    action={deleteMediaAction.bind(null, item.id, item.path)}
                    itemLabel={item.file_name}
                    successMessage="File deleted."
                    iconOnly
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

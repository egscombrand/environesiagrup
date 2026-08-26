'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { publicMediaUrl } from '@/lib/cms/media';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/avif'];
const DOCUMENT_TYPES = [...IMAGE_TYPES, 'application/pdf', 'video/mp4'];

export function ImageUploadField({
  name,
  label,
  folder,
  initialPath,
  accept = 'image',
}: {
  name: string;
  label: string;
  folder: string;
  initialPath?: string | null;
  accept?: 'image' | 'file';
}) {
  const [path, setPath] = useState(initialPath ?? '');
  const [previewUrl, setPreviewUrl] = useState(publicMediaUrl(initialPath ?? undefined) ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = accept === 'image' ? IMAGE_TYPES : DOCUMENT_TYPES;

  async function handleFile(file: File) {
    setError(null);

    if (!allowedTypes.includes(file.type)) {
      setError('Tipe file tidak didukung.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file maksimal 25 MB.');
      return;
    }

    setUploading(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const storagePath = `${folder}/${Date.now()}-${safeName}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from('media').upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    setUploading(false);

    if (uploadError) {
      setError(`Gagal mengunggah: ${uploadError.message}`);
      return;
    }

    setPath(storagePath);
    setPreviewUrl(publicMediaUrl(storagePath) ?? '');
  }

  return (
    <div>
      <label className="font-mono text-label uppercase text-slate">{label}</label>
      <input type="hidden" name={name} value={path} />
      <div className="mt-2 flex items-center gap-4">
        {previewUrl && accept === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase Storage URL, not statically known
          <img src={previewUrl} alt="" className="h-16 w-16 rounded-[10px] border border-line object-cover" />
        ) : path ? (
          <span className="text-small text-slate">{path.split('/').pop()}</span>
        ) : null}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={accept === 'image' ? 'image/*' : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-small text-ink file:mr-3 file:rounded-[8px] file:border file:border-line file:bg-paper file:px-3 file:py-1.5 file:text-small"
          />
          {uploading ? <p className="mt-1 text-small text-slate">Mengunggah…</p> : null}
          {error ? <p className="mt-1 text-small text-danger">{error}</p> : null}
          {path ? (
            <button
              type="button"
              onClick={() => {
                setPath('');
                setPreviewUrl('');
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="mt-1 block text-small text-slate hover:text-ink"
            >
              Hapus
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { publicMediaUrl } from '@/lib/cms/media';
import { AdminModal } from './editor-layout';

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileName = path.split('/').pop() ?? '';

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
      <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">{label}</label>
      <input type="hidden" name={name} value={path} />
      <div className="mt-2 flex items-center gap-4">
        {previewUrl && accept === 'image' ? (
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            aria-label="Lihat detail foto"
            className="shrink-0 overflow-hidden rounded-[10px] border border-[#e3e8ee] transition-opacity hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase Storage URL, not statically known */}
            <img src={previewUrl} alt="" className="h-16 w-16 object-cover" />
          </button>
        ) : path ? (
          <span className="text-small text-[#64748b]">{fileName}</span>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            id={`${name}-file`}
            type="file"
            accept={accept === 'image' ? 'image/*' : undefined}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="sr-only"
          />
          {path ? (
            <button
              type="button"
              onClick={() => (accept === 'image' ? setViewerOpen(true) : window.open(previewUrl, '_blank', 'noopener'))}
              className="inline-flex items-center rounded-[8px] border border-[#e3e8ee] bg-white px-3 py-1.5 text-small font-medium text-[#1f6478] transition-colors hover:bg-[#e6f3f6]"
            >
              Lihat
            </button>
          ) : null}
          <label
            htmlFor={`${name}-file`}
            className="inline-flex cursor-pointer items-center rounded-[8px] border border-[#e3e8ee] bg-white px-3 py-1.5 text-small font-medium text-[#1f6478] transition-colors hover:bg-[#e6f3f6]"
          >
            {path ? 'Ganti Foto' : 'Unggah Foto'}
          </label>
          {path ? (
            <button
              type="button"
              onClick={() => {
                setPath('');
                setPreviewUrl('');
                setViewerOpen(false);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="rounded-[8px] px-3 py-1.5 text-small text-[#64748b] transition-colors hover:bg-white hover:text-danger"
            >
              Hapus Foto
            </button>
          ) : null}
          {uploading ? <p className="w-full text-small text-[#64748b]">Mengunggah…</p> : null}
          {error ? <p className="w-full text-small text-danger">{error}</p> : null}
          {!path ? <p className="w-full text-small text-[#64748b]">Belum ada foto. Website memakai foto bawaan.</p> : null}
        </div>
      </div>

      {accept === 'image' ? (
        <AdminModal open={viewerOpen} title={label} description={fileName || undefined} onClose={() => setViewerOpen(false)} width="lg">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase Storage URL, not statically known
            <img src={previewUrl} alt="" className="mx-auto max-h-[70vh] w-auto max-w-full rounded-[8px] object-contain" />
          ) : null}
        </AdminModal>
      ) : null}
    </div>
  );
}

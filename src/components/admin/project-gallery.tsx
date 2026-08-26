'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { publicMediaUrl } from '@/lib/cms/media';
import { addProjectImageAction, removeProjectImageAction } from '@/app/wp-admin/(protected)/content/projects/gallery-actions';

export type GalleryImage = { id: string; image_path: string; alt_text: string | null };

export function ProjectGallery({ projectId, images }: { projectId: string; images: GalleryImage[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const storagePath = `projects/${Date.now()}-${safeName}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) {
      setUploading(false);
      setError(`Gagal mengunggah: ${uploadError.message}`);
      return;
    }

    const result = await addProjectImageAction(projectId, storagePath, file.name);
    setUploading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (inputRef.current) inputRef.current.value = '';
    router.refresh();
  }

  return (
    <div className="mt-10 max-w-2xl">
      <p className="font-mono text-label uppercase text-slate">Galeri Proyek</p>

      {images.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <Image
                src={publicMediaUrl(image.image_path) ?? ''}
                alt={image.alt_text ?? ''}
                width={160}
                height={120}
                className="h-24 w-full rounded-[10px] border border-line object-cover"
              />
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await removeProjectImageAction(image.id);
                    router.refresh();
                  })
                }
                className="absolute right-1 top-1 rounded-full bg-danger px-2 py-0.5 text-small text-paper disabled:opacity-60"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-small text-slate">Belum ada foto galeri.</p>
      )}

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="text-small text-ink file:mr-3 file:rounded-[8px] file:border file:border-line file:bg-paper file:px-3 file:py-1.5 file:text-small"
        />
        {uploading ? <p className="mt-1 text-small text-slate">Mengunggah…</p> : null}
        {error ? <p className="mt-1 text-small text-danger">{error}</p> : null}
      </div>
    </div>
  );
}

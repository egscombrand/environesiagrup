'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { LEGALITAS_CATEGORIES } from '@/lib/legalitas-data';
import { parseFieldLines } from '@/lib/admin/legal-fields';
import { deleteCardAction, saveCardAction } from '@/app/wp-admin/(protected)/content/legal/actions';
import { ConfirmDialog } from './confirm-dialog';
import { EditorFrameContent, EditorFrameFooter } from './editor-layout';
import { ImageUploadField } from './image-upload-field';
import { useRequiredFieldsValidation } from './use-required-fields';
import { ValidationModal } from './validation-modal';
import { useToast } from './toast-provider';

const REQUIRED_FIELDS = [
  { name: 'logo_alt', label: 'Teks alt logo' },
  { name: 'title', label: 'Judul kartu' },
];

export type LegalDocumentFormValue = {
  id?: string;
  title: string;
  issuer: string;
  description: string;
  fieldsText: string;
  external_url: string;
  cta_label: string;
};

export type LegalCardFormValue = {
  category: string;
  logo: string;
  logo_alt: string;
  title: string;
  subtitle: string;
  introText: string;
  documents: LegalDocumentFormValue[];
};

const FIELD =
  'mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink outline-none transition-colors focus:border-[#2a7793] focus:ring-2 focus:ring-[#2a7793]/15 disabled:bg-[#f4f6f9] disabled:text-[#64748b]';
const LABEL = 'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]';

const EMPTY_DOCUMENT: LegalDocumentFormValue = {
  title: '',
  issuer: '',
  description: '',
  fieldsText: '',
  external_url: '',
  cta_label: '',
};

/**
 * Editor for one legal card and its documents. Documents are an ordered list,
 * saved as one set. Field lists are typed as "Label: nilai" lines, which
 * parseFieldLines turns into the stored list before the request is sent.
 */
export function LegalCardForm({
  cardId,
  initial,
  canWrite,
}: {
  cardId: string;
  initial: LegalCardFormValue;
  canWrite: boolean;
}) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [docs, setDocs] = useState(initial.documents);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { formRef, errors, missing, modalOpen, validate, closeModal, goToField, handleFieldActivity } =
    useRequiredFieldsValidation(REQUIRED_FIELDS);

  function updateDoc(index: number, patch: Partial<LegalDocumentFormValue>) {
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function moveDoc(index: number, delta: -1 | 1) {
    setDocs((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save(formData: FormData) {
    formData.set('intro', JSON.stringify(parseFieldLines(String(formData.get('intro_text') ?? ''))));
    formData.set(
      'documents',
      JSON.stringify(
        docs.map((d) => ({
          id: d.id,
          title: d.title,
          issuer: d.issuer,
          description: d.description,
          fields: parseFieldLines(d.fieldsText),
          external_url: d.external_url,
          cta_label: d.cta_label,
        }))
      )
    );
    startTransition(async () => {
      const result = await saveCardAction(cardId, formData);
      if (result.error) toast('error', result.error);
      else toast('success', 'Data berhasil disimpan.');
    });
  }

  function remove() {
    setConfirmDeleteOpen(false);
    startTransition(async () => {
      await deleteCardAction(cardId);
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      action={save}
      onSubmit={(e) => {
        if (!validate()) {
          e.preventDefault();
          toast('error', 'Mohon lengkapi field yang wajib diisi.');
        }
      }}
      onInput={handleFieldActivity}
      onChange={handleFieldActivity}
      className="flex h-full min-h-0 flex-col"
    >
      <fieldset disabled={!canWrite || pending} className="flex h-full min-h-0 flex-col">
      {/* The ONLY scrolling region in this form — see EditorFrameContent in editor-layout.tsx. */}
      <EditorFrameContent className="space-y-6 pb-6">
        <section className="rounded-[12px] border border-[#e3e8ee] bg-white p-5 md:p-6">
          <p className="font-display text-h3 text-ink">Kartu</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={LABEL}>Kategori</span>
              <select name="category" defaultValue={initial.category} className={FIELD}>
                {LEGALITAS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <ImageUploadField name="logo" label="Logo (opsional)" folder="legalitas" initialPath={initial.logo || null} />
            <label className="block">
              <span className={LABEL}>
                Teks alt logo<span className="text-danger"> *</span>
              </span>
              <input
                name="logo_alt"
                defaultValue={initial.logo_alt}
                className={errors.has('logo_alt') ? `${FIELD} border-danger focus:border-danger` : FIELD}
              />
              {errors.has('logo_alt') ? <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p> : null}
            </label>
            <label className="block">
              <span className={LABEL}>Subjudul (opsional)</span>
              <input name="subtitle" defaultValue={initial.subtitle} className={FIELD} />
            </label>
            <label className="block md:col-span-2">
              <span className={LABEL}>
                Judul kartu<span className="text-danger"> *</span>
              </span>
              <input
                name="title"
                defaultValue={initial.title}
                className={errors.has('title') ? `${FIELD} border-danger focus:border-danger` : FIELD}
              />
              {errors.has('title') ? <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p> : null}
            </label>
            <label className="block md:col-span-2">
              <span className={LABEL}>Informasi umum (opsional, satu baris per isian: Label: nilai)</span>
              <textarea name="intro_text" rows={3} defaultValue={initial.introText} className={FIELD} />
            </label>
          </div>
        </section>

        <section className="rounded-[12px] border border-[#e3e8ee] bg-white p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-h3 text-ink">Dokumen</p>
              <p className="mt-1 text-small text-[#64748b]">Urutannya sama dengan urutan di halaman Legalitas.</p>
            </div>
            <button
              type="button"
              onClick={() => setDocs((prev) => [...prev, { ...EMPTY_DOCUMENT }])}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#2a7793] px-3.5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah dokumen
            </button>
          </div>

          {docs.length === 0 ? (
            <p className="mt-6 rounded-[10px] border border-dashed border-[#e3e8ee] px-4 py-6 text-center text-small text-[#64748b]">
              Belum ada dokumen di kartu ini.
            </p>
          ) : (
            <ol className="mt-5 space-y-4">
              {docs.map((doc, index) => (
                <li key={doc.id ?? `new-${index}`} className="rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Dokumen {String(index + 1).padStart(2, '0')}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveDoc(index, -1)} aria-label="Naikkan urutan" className="rounded-[8px] p-2 text-[#64748b] transition-colors hover:bg-white hover:text-ink">
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => moveDoc(index, 1)} aria-label="Turunkan urutan" className="rounded-[8px] p-2 text-[#64748b] transition-colors hover:bg-white hover:text-ink">
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocs((prev) => prev.filter((_, i) => i !== index))}
                        aria-label="Hapus dokumen"
                        className="rounded-[8px] p-2 text-[#64748b] transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className={LABEL}>Judul dokumen</span>
                      <input value={doc.title} onChange={(e) => updateDoc(index, { title: e.target.value })} className={FIELD} />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Penerbit (opsional)</span>
                      <input value={doc.issuer} onChange={(e) => updateDoc(index, { issuer: e.target.value })} className={FIELD} />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Tautan verifikasi (opsional)</span>
                      <input value={doc.external_url} onChange={(e) => updateDoc(index, { external_url: e.target.value })} placeholder="https://…" className={FIELD} />
                    </label>
                    <label className="block md:col-span-2">
                      <span className={LABEL}>Isian (satu baris per isian: Label: nilai)</span>
                      <textarea rows={3} value={doc.fieldsText} onChange={(e) => updateDoc(index, { fieldsText: e.target.value })} className={FIELD} />
                    </label>
                    <label className="block md:col-span-2">
                      <span className={LABEL}>Keterangan (opsional)</span>
                      <textarea rows={2} value={doc.description} onChange={(e) => updateDoc(index, { description: e.target.value })} className={FIELD} />
                    </label>
                    <label className="block">
                      <span className={LABEL}>Label tombol (opsional)</span>
                      <input value={doc.cta_label} onChange={(e) => updateDoc(index, { cta_label: e.target.value })} className={FIELD} />
                    </label>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

      </EditorFrameContent>

      {canWrite ? (
        <EditorFrameFooter className="flex-wrap justify-between">
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="rounded-[10px] border border-danger/30 px-4 py-2.5 text-small text-danger transition-colors hover:bg-danger/5"
          >
            Hapus kartu
          </button>
          <button type="submit" className="rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90">
            {pending ? 'Menyimpan…' : 'Simpan kartu'}
          </button>
        </EditorFrameFooter>
      ) : null}
      </fieldset>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Hapus Data?"
        description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        pending={pending}
        onConfirm={remove}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <ValidationModal open={modalOpen} missing={missing} onSelectField={goToField} onClose={closeModal} />
    </form>
  );
}

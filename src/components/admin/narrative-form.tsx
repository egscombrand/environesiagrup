'use client';

import { useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { saveNarrativeAction } from '@/app/wp-admin/(protected)/content/narasi/[slug]/actions';
import type { NarrativeFormValue, NarrativeLang, NarrativeLocale, NarrativePage } from '@/lib/admin/narrative-pages';
import { ImageUploadField } from './image-upload-field';
import { useToast } from './toast-provider';

type Item = NarrativeLocale['items'][number];
type Step = NarrativeLocale['steps'][number];

const FIELD =
  'mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink outline-none transition-colors focus:border-[#2a7793] focus:ring-2 focus:ring-[#2a7793]/15 disabled:bg-[#f4f6f9] disabled:text-[#64748b]';
const LABEL = 'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]';
const CARD = 'rounded-[16px] border border-[#e3e8ee] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]';
const ICON_BUTTON = 'rounded-[8px] p-2 text-[#64748b] transition-colors hover:bg-white hover:text-ink';

const LANGUAGES: { id: NarrativeLang; label: string }[] = [
  { id: 'id', label: 'Indonesia' },
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
];

/**
 * The editor for one narrative page. Each language is a complete copy of the
 * page's text. Only the pages marked as localized show the language tabs and the
 * SEO fields, because only those pages read the translations. The lists (items,
 * steps, tags) and the text are held in state and sent to the server as one JSON
 * payload, so every field is validated in one place.
 */
export function NarrativeForm({
  page,
  initial,
  canWrite,
}: {
  page: NarrativePage;
  initial: NarrativeFormValue;
  canWrite: boolean;
}) {
  const toast = useToast();
  const [locales, setLocales] = useState(initial.locales);
  const [lang, setLang] = useState<NarrativeLang>('id');
  const [pending, startTransition] = useTransition();
  const has = (block: NarrativePage['blocks'][number]) => page.blocks.includes(block);

  function patch(next: Partial<NarrativeLocale>) {
    setLocales((prev) => ({ ...prev, [lang]: { ...prev[lang], ...next } }));
  }

  function save(formData: FormData) {
    formData.set('payload', JSON.stringify({ locales }));
    startTransition(async () => {
      const result = await saveNarrativeAction(page.slug, formData);
      if (result.error) toast('error', result.error);
      else toast('success', 'Perubahan disimpan.');
    });
  }

  const current = locales[lang];
  const fallback = locales.id;
  const isDefault = lang === 'id';

  return (
    <form action={save} className="space-y-6">
      <fieldset disabled={!canWrite || pending} className="space-y-6">
        <section className={CARD}>
          <label className="block max-w-[320px]">
            <span className={LABEL}>Status</span>
            <select name="status" defaultValue={initial.status} className={FIELD}>
              <option value="draft">Draft (belum tayang)</option>
              <option value="published">Tayang di website</option>
            </select>
          </label>
        </section>

        {has('images') ? (
          <section className={CARD}>
            <p className="font-display text-h3 text-ink">Foto</p>
            <p className="mt-1 text-small text-[#64748b]">
              Unggah foto dari laptop. Foto yang sudah ada di website ditampilkan di sini. Hapus Foto mengembalikan foto bawaan.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {(page.imageSlots ?? []).map((slot) => (
                <div key={slot.key} className="space-y-4">
                  <ImageUploadField
                    name={`image_${slot.key}`}
                    label={slot.label}
                    folder={page.slug}
                    initialPath={initial.images[slot.key] || null}
                  />
                  {slot.withAlt ? (
                    <label className="block">
                      <span className={LABEL}>Teks alternatif (untuk pembaca layar)</span>
                      <input name={`image_${slot.key}_alt`} defaultValue={initial.imageAlts[slot.key] ?? ''} className={FIELD} />
                    </label>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {has('image') ? (
          <section className={CARD}>
            <p className="font-display text-h3 text-ink">Foto</p>
            <p className="mt-1 text-small text-[#64748b]">
              Unggah foto dari laptop. Tanpa foto, website memakai foto bawaan.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ImageUploadField
                name="image_path"
                label="Foto desktop"
                folder="tata-kelola"
                initialPath={initial.imagePath || null}
              />
              <ImageUploadField
                name="image_mobile_path"
                label="Foto mobile"
                folder="tata-kelola"
                initialPath={initial.imageMobilePath || null}
              />
            </div>
          </section>
        ) : null}

        <section className={CARD}>
          {page.localized ? (
            <div className="mb-6 inline-flex rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9] p-1" role="tablist" aria-label="Bahasa">
              {LANGUAGES.map((option) => {
                const active = option.id === lang;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLang(option.id)}
                    className={`rounded-[9px] px-4 py-2 text-small transition-colors ${
                      active ? 'bg-white font-semibold text-[#1f6478] shadow-sm' : 'text-[#64748b] hover:text-ink'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {!isDefault ? (
            <p className="mb-5 text-small text-[#64748b]">
              Kolom yang dikosongkan memakai teks Bahasa Indonesia. Teks Indonesia ditampilkan sebagai contoh di kolom kosong.
            </p>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {page.usesEyebrow === false ? null : (
              <TextField
                label="Eyebrow"
                value={current.eyebrow}
                placeholder={isDefault ? 'Mis. TATA KELOLA & KEBERLANJUTAN' : fallback.eyebrow}
                onChange={(eyebrow) => patch({ eyebrow })}
              />
            )}
            <TextField
              label="Judul"
              required={isDefault}
              value={current.title}
              placeholder={isDefault ? undefined : fallback.title}
              onChange={(title) => patch({ title })}
              className="md:col-span-2"
            />
            {page.usesDescription === false ? null : (
              <TextField
                label="Deskripsi"
                multiline
                value={current.description}
                placeholder={isDefault ? undefined : fallback.description}
                onChange={(description) => patch({ description })}
                className="md:col-span-2"
              />
            )}
          </div>

          {has('extra') ? (
            <div className="mt-6 grid gap-5 border-t border-[#e3e8ee] pt-6 md:grid-cols-2">
              <TextField
                label="Label blok tambahan (opsional)"
                value={current.extraLabel}
                placeholder={isDefault ? 'Mis. KOMITMEN ETIKA' : fallback.extraLabel}
                onChange={(extraLabel) => patch({ extraLabel })}
              />
              <TextField
                label="Teks blok tambahan (opsional)"
                multiline
                value={current.extraText}
                placeholder={isDefault ? undefined : fallback.extraText}
                onChange={(extraText) => patch({ extraText })}
                className="md:col-span-2"
              />
            </div>
          ) : null}
          {has('extraLabel') && !has('extra') ? (
            <div className="mt-6 border-t border-[#e3e8ee] pt-6">
              <TextField
                label="Judul bagian (opsional)"
                value={current.extraLabel}
                placeholder={isDefault ? undefined : fallback.extraLabel}
                onChange={(extraLabel) => patch({ extraLabel })}
              />
            </div>
          ) : null}

          {has('tags') ? (
            <div className="mt-6 border-t border-[#e3e8ee] pt-6">
              <TextField
                label="Daftar kategori (satu per baris)"
                multiline
                rows={6}
                value={current.tags.join('\n')}
                placeholder={isDefault ? undefined : fallback.tags.join('\n')}
                onChange={(text) => patch({ tags: text.split('\n') })}
              />
            </div>
          ) : null}
        </section>

        {has('items') ? (
          <section className={CARD}>
            <ItemsEditor
              items={current.items}
              onChange={(items) => patch({ items })}
              showLabel={page.blocks.includes('extra') || page.itemLabels === true}
              showTitle={page.itemTitles !== false}
            />
          </section>
        ) : null}

        {has('steps') ? (
          <section className={CARD}>
            <StepsEditor steps={current.steps} onChange={(steps) => patch({ steps })} />
          </section>
        ) : null}

        {page.localized || page.showSeo ? (
          <section className={CARD}>
            <p className="font-display text-h3 text-ink">SEO</p>
            <p className="mt-1 text-small text-[#64748b]">Judul dan deskripsi di hasil pencarian dan tautan yang dibagikan.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <TextField
                label="Judul SEO"
                value={current.metaTitle}
                placeholder={isDefault ? undefined : fallback.metaTitle}
                onChange={(metaTitle) => patch({ metaTitle })}
              />
              <TextField
                label="Deskripsi SEO"
                multiline
                rows={3}
                value={current.metaDescription}
                placeholder={isDefault ? undefined : fallback.metaDescription}
                onChange={(metaDescription) => patch({ metaDescription })}
              />
            </div>
          </section>
        ) : null}

        {canWrite ? (
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90"
            >
              {pending ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
          </div>
        ) : (
          <p className="text-small text-[#64748b]">Hanya Super Admin dan Editor yang dapat mengubah halaman ini.</p>
        )}
      </fieldset>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  required = false,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={LABEL}>{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={FIELD}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={FIELD}
        />
      )}
    </label>
  );
}

/** Moves an entry up or down. Returns the same array when the move is out of range. */
function moved<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function OrderButtons({ index, count, onMove, onRemove, noun }: {
  index: number;
  count: number;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
  noun: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Naikkan ${noun}`} className={`${ICON_BUTTON} disabled:opacity-40`}>
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label={`Turunkan ${noun}`}
        className={`${ICON_BUTTON} disabled:opacity-40`}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onRemove} aria-label={`Hapus ${noun}`} className={`${ICON_BUTTON} hover:bg-danger/10 hover:text-danger`}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function ItemsEditor({
  items,
  onChange,
  showLabel,
  showTitle,
}: {
  items: Item[];
  onChange: (items: Item[]) => void;
  showLabel: boolean;
  showTitle: boolean;
}) {
  function update(index: number, patch: Partial<Item>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-h3 text-ink">Item</p>
          <p className="mt-1 text-small text-[#64748b]">Urutannya sama dengan urutan di website.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, { label: '', title: '', description: '' }])}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#2a7793] px-3.5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-[10px] border border-dashed border-[#e3e8ee] px-4 py-6 text-center text-small text-[#64748b]">
          Belum ada item. Tambahkan item pertama.
        </p>
      ) : (
        <ol className="mt-5 space-y-4">
          {items.map((item, index) => (
            <li key={index} className="rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                  Item {String(index + 1).padStart(2, '0')}
                </span>
                <OrderButtons
                  index={index}
                  count={items.length}
                  noun="item"
                  onMove={(delta) => onChange(moved(items, index, delta))}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              {showTitle ? (
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div className="space-y-5">
                    {showLabel ? (
                      <TextField label="Label kecil (opsional)" value={item.label} onChange={(label) => update(index, { label })} />
                    ) : null}
                    <TextField label="Judul item" value={item.title} onChange={(title) => update(index, { title })} />
                  </div>
                  <TextField label="Deskripsi" multiline rows={4} value={item.description} onChange={(description) => update(index, { description })} />
                </div>
              ) : (
                <div className="mt-4">
                  <TextField
                    label={`Teks blok ${index + 1}`}
                    multiline
                    rows={12}
                    value={item.description}
                    onChange={(description) => update(index, { description })}
                  />
                  <p className="mt-2 text-small text-[#64748b]">
                    Pisahkan paragraf dengan satu baris kosong. Tulis teks di antara <code>**</code> untuk huruf tebal.
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function StepsEditor({ steps, onChange }: { steps: Step[]; onChange: (steps: Step[]) => void }) {
  function update(index: number, patch: Partial<Step>) {
    onChange(steps.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-h3 text-ink">Langkah</p>
          <p className="mt-1 text-small text-[#64748b]">Langkah yang berurutan. Deskripsi boleh dikosongkan.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...steps, { label: '', description: '' }])}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#2a7793] px-3.5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah langkah
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="mt-6 rounded-[10px] border border-dashed border-[#e3e8ee] px-4 py-6 text-center text-small text-[#64748b]">
          Belum ada langkah. Tambahkan langkah pertama.
        </p>
      ) : (
        <ol className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                  Langkah {String(index + 1).padStart(2, '0')}
                </span>
                <OrderButtons
                  index={index}
                  count={steps.length}
                  noun="langkah"
                  onMove={(delta) => onChange(moved(steps, index, delta))}
                  onRemove={() => onChange(steps.filter((_, i) => i !== index))}
                />
              </div>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <TextField label="Label" value={step.label} onChange={(label) => update(index, { label })} />
                <TextField label="Deskripsi (opsional)" multiline rows={3} value={step.description} onChange={(description) => update(index, { description })} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

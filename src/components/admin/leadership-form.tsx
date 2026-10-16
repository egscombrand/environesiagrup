'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { saveLeadershipAction } from '@/app/wp-admin/(protected)/content/leadership/actions';
import { ImageUploadField } from './image-upload-field';
import { EditorFrameContent, EditorFrameFooter, EditorSection, FIELD_WIDE, FieldGrid } from './editor-layout';
import { SlugField } from './slug-field';
import { useRequiredFieldsValidation } from './use-required-fields';
import { ValidationModal } from './validation-modal';
import { useToast } from './toast-provider';

const REQUIRED_FIELDS = [
  { name: 'name', label: 'Nama' },
  { name: 'position', label: 'Jabatan' },
];

export type LeadershipFormValue = {
  name: string;
  slug: string;
  position: string;
  role: string;
  status: string;
  sort_order: number;
  bio: string;
  photo_path: string;
  entity_id: string;
  profile: {
    descriptor: string;
    photo: { width: number; height: number };
    education: { key: string; level: string; institution: string; degree: string; scholarship: string; note: string; logoPath: string }[];
    experience: string[];
    stats: { value: string; label: string }[];
    contributionLabel: string;
    contribution: string[];
    teaching: { key: string; institution: string; program: string; description: string; logoPath: string }[];
    linkedinUrl: string;
    instagramUrl: string;
    email: string;
  };
};

const ROLE_OPTIONS = [
  { value: 'direktur_utama', label: 'Direktur Utama' },
  { value: 'direksi', label: 'Dewan Direksi' },
  { value: 'entitas_grup', label: 'Pimpinan Entitas Grup' },
  { value: 'komisaris', label: 'Komisaris' },
  { value: 'lainnya', label: 'Lainnya' },
];
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const FIELD =
  'mt-1.5 w-full rounded-[10px] border border-[#e3e8ee] bg-white px-3 py-2.5 text-small text-ink outline-none transition-colors focus:border-[#2a7793] focus:ring-2 focus:ring-[#2a7793]/15 disabled:bg-[#f4f6f9] disabled:text-[#64748b]';
const LABEL = 'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]';
const ICON_BUTTON = 'rounded-[8px] p-2 text-[#64748b] transition-colors hover:bg-white hover:text-ink';
const ADD_BUTTON =
  'inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#2a7793] px-3.5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90';

function Input({ label, name, defaultValue, required, type = 'text', className = '', error = false, onChange }: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
  className?: string;
  error?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={LABEL}>
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={error ? `${FIELD} border-danger focus:border-danger` : FIELD}
      />
      {error ? <p className="mt-1 text-small text-danger">Field ini wajib diisi.</p> : null}
    </label>
  );
}

function Area({ label, value, onChange, rows = 3, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={FIELD} />
    </label>
  );
}

/** The logo is sent as its own form field, so the JSON payload drops it. */
function withoutLogo<T extends { logoPath: string }>(item: T): Omit<T, 'logoPath'> {
  const copy: Partial<T> = { ...item };
  delete copy.logoPath;
  return copy as Omit<T, 'logoPath'>;
}

function moved<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** The up, down, and remove buttons shared by every list. */
function ItemControls({ index, count, noun, onMove, onRemove }: {
  index: number;
  count: number;
  noun: string;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Naikkan ${noun}`} className={`${ICON_BUTTON} disabled:opacity-40`}>
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Turunkan ${noun}`} className={`${ICON_BUTTON} disabled:opacity-40`}>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onRemove} aria-label={`Hapus ${noun}`} className={`${ICON_BUTTON} hover:bg-danger/10 hover:text-danger`}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function LeadershipForm({
  id,
  initial,
  entities,
  canWrite,
}: {
  id: string | null;
  initial: LeadershipFormValue;
  entities: { id: string; name: string }[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [photoSize, setPhotoSize] = useState(initial.profile.photo);
  const [education, setEducation] = useState(initial.profile.education);
  const [teaching, setTeaching] = useState(initial.profile.teaching);
  const [experience, setExperience] = useState(initial.profile.experience);
  const [stats, setStats] = useState(initial.profile.stats);
  const [contribution, setContribution] = useState(initial.profile.contribution);
  const [descriptor, setDescriptor] = useState(initial.profile.descriptor);
  const [contributionLabel, setContributionLabel] = useState(initial.profile.contributionLabel);
  const [linkedinUrl, setLinkedinUrl] = useState(initial.profile.linkedinUrl);
  const [instagramUrl, setInstagramUrl] = useState(initial.profile.instagramUrl);
  const [email, setEmail] = useState(initial.profile.email);
  const [bio, setBio] = useState(initial.bio);
  const [nameLive, setNameLive] = useState(initial.name);
  const counter = useRef(0);
  const nextKey = () => `n${++counter.current}-${Date.now()}`;
  const { formRef, errors, missing, modalOpen, validate, closeModal, goToField, handleFieldActivity } =
    useRequiredFieldsValidation(REQUIRED_FIELDS);

  function save(formData: FormData) {
    const payload = {
      descriptor,
      photo: photoSize,
      education: education.map(withoutLogo),
      experience,
      stats,
      contributionLabel,
      contribution,
      teaching: teaching.map(withoutLogo),
      linkedinUrl,
      instagramUrl,
      email,
    };
    formData.set('profile', JSON.stringify(payload));
    formData.set('bio', bio);
    startTransition(async () => {
      const result = await saveLeadershipAction(id, formData);
      if ('error' in result && result.error) {
        toast('error', result.error);
        return;
      }
      toast('success', 'Data berhasil disimpan.');
      if (!id) router.push('/wp-admin/content/leadership');
      else router.refresh();
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
      className="flex h-full min-h-0 w-full flex-col"
    >
      <fieldset disabled={!canWrite || pending} className="flex h-full min-h-0 flex-col">
      {/* The ONLY scrolling region in this form — see EditorFrameContent in editor-layout.tsx. */}
      <EditorFrameContent className="space-y-6 pb-6">
        <EditorSection title="Identitas" description="Nama, jabatan, dan peran di halaman Direktur Utama & Dewan Direksi.">
          <div className="mb-5">
            <SlugField name="slug" initialSlug={initial.slug} sourceValue={nameLive} />
          </div>
          <FieldGrid>
            <Input label="Nama" name="name" defaultValue={initial.name} required error={errors.has('name')} onChange={setNameLive} />
            <Input
              label="Jabatan"
              name="position"
              defaultValue={initial.position}
              required
              error={errors.has('position')}
              className={FIELD_WIDE}
            />
            <label className="block">
              <span className={LABEL}>Peran di halaman</span>
              <select name="role" defaultValue={initial.role} className={FIELD}>
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={LABEL}>Entitas (untuk pimpinan entitas grup)</span>
              <select name="entity_id" defaultValue={initial.entity_id} className={FIELD}>
                <option value="">Tidak ada</option>
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={LABEL}>Status</span>
              <select name="status" defaultValue={initial.status} className={FIELD}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <Input label="Urutan" name="sort_order" type="number" defaultValue={initial.sort_order} />
          </FieldGrid>
        </EditorSection>

        <EditorSection title="Foto" description="Foto potret. Tanpa foto, orang ini tidak ditampilkan dengan gambar.">
          <FieldGrid>
            <ImageUploadField name="photo_path" label="Foto potret" folder="leadership" initialPath={initial.photo_path || null} />
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className={LABEL}>Lebar foto (px)</span>
                <input type="number" min={1} value={photoSize.width} onChange={(e) => setPhotoSize({ ...photoSize, width: Number(e.target.value) })} className={FIELD} />
              </label>
              <label className="block">
                <span className={LABEL}>Tinggi foto (px)</span>
                <input type="number" min={1} value={photoSize.height} onChange={(e) => setPhotoSize({ ...photoSize, height: Number(e.target.value) })} className={FIELD} />
              </label>
            </div>
          </FieldGrid>
        </EditorSection>

        <EditorSection title="Biografi" description="Teks biografi di bawah nama. Kosongkan jika belum ada.">
          <FieldGrid>
            <div className={FIELD_WIDE}>
              <Area label="Bio" value={bio} onChange={setBio} rows={5} />
            </div>
            <label className="block">
              <span className={LABEL}>Deskriptor (di bawah nama)</span>
              <input value={descriptor} onChange={(e) => setDescriptor(e.target.value)} className={FIELD} />
            </label>
          </FieldGrid>
        </EditorSection>

        <EditorSection
          title="Pendidikan"
          description="Setiap pendidikan dengan logo institusinya."
          action={
            <button type="button" className={ADD_BUTTON} onClick={() => setEducation([...education, { key: nextKey(), level: '', institution: '', degree: '', scholarship: '', note: '', logoPath: '' }])}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Tambah pendidikan
            </button>
          }
        >
          {education.length === 0 ? <p className="text-small text-[#64748b]">Belum ada pendidikan.</p> : null}
          <ol className="space-y-4">
            {education.map((item, i) => (
              <li key={item.key} className="rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Pendidikan {i + 1}</span>
                  <ItemControls index={i} count={education.length} noun="pendidikan" onMove={(d) => setEducation(moved(education, i, d))} onRemove={() => setEducation(education.filter((x) => x.key !== item.key))} />
                </div>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div className="space-y-5">
                    <Area label="Jenjang" value={item.level} onChange={(v) => setEducation(education.map((x) => (x.key === item.key ? { ...x, level: v } : x)))} rows={1} />
                    <Area label="Institusi" value={item.institution} onChange={(v) => setEducation(education.map((x) => (x.key === item.key ? { ...x, institution: v } : x)))} rows={1} />
                    <Area label="Gelar" value={item.degree} onChange={(v) => setEducation(education.map((x) => (x.key === item.key ? { ...x, degree: v } : x)))} rows={1} />
                    <Area label="Beasiswa (opsional)" value={item.scholarship} onChange={(v) => setEducation(education.map((x) => (x.key === item.key ? { ...x, scholarship: v } : x)))} rows={1} />
                  </div>
                  <div className="space-y-5">
                    <Area label="Catatan (opsional, mis. program yang sedang ditempuh)" value={item.note} onChange={(v) => setEducation(education.map((x) => (x.key === item.key ? { ...x, note: v } : x)))} rows={4} />
                    <ImageUploadField name={`logo_${item.key}`} label="Logo institusi" folder="leadership" initialPath={item.logoPath || null} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </EditorSection>

        <EditorSection title="Pengalaman" description="Satu paragraf per entri.">
          <ListOfText items={experience} onChange={setExperience} addLabel="Tambah paragraf" noun="paragraf" />
        </EditorSection>

        <EditorSection
          title="Statistik"
          description="Angka singkat yang ditampilkan di profil, mis. 1.000+ Proyek."
          action={
            <button type="button" className={ADD_BUTTON} onClick={() => setStats([...stats, { value: '', label: '' }])}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Tambah statistik
            </button>
          }
        >
          <ol className="grid gap-4 md:grid-cols-2">
            {stats.map((item, i) => (
              <li key={i} className="flex items-end gap-3 rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
                <label className="block flex-1">
                  <span className={LABEL}>Nilai</span>
                  <input value={item.value} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className={FIELD} />
                </label>
                <label className="block flex-1">
                  <span className={LABEL}>Label</span>
                  <input value={item.label} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className={FIELD} />
                </label>
                <ItemControls index={i} count={stats.length} noun="statistik" onMove={(d) => setStats(moved(stats, i, d))} onRemove={() => setStats(stats.filter((_, j) => j !== i))} />
              </li>
            ))}
          </ol>
        </EditorSection>

        <EditorSection title="Kontribusi" description="Judul bagian dan paragraf kontribusi.">
          <FieldGrid>
            <label className={`block ${FIELD_WIDE}`}>
              <span className={LABEL}>Judul bagian</span>
              <input value={contributionLabel} onChange={(e) => setContributionLabel(e.target.value)} className={FIELD} />
            </label>
          </FieldGrid>
          <div className="mt-5">
            <ListOfText items={contribution} onChange={setContribution} addLabel="Tambah paragraf" noun="paragraf" />
          </div>
        </EditorSection>

        <EditorSection
          title="Mengajar"
          description="Institusi tempat mengajar, dengan logonya."
          action={
            <button type="button" className={ADD_BUTTON} onClick={() => setTeaching([...teaching, { key: nextKey(), institution: '', program: '', description: '', logoPath: '' }])}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Tambah pengajaran
            </button>
          }
        >
          {teaching.length === 0 ? <p className="text-small text-[#64748b]">Belum ada kegiatan mengajar.</p> : null}
          <ol className="space-y-4">
            {teaching.map((item, i) => (
              <li key={item.key} className="rounded-[12px] border border-[#e3e8ee] bg-[#f4f6f9]/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Mengajar {i + 1}</span>
                  <ItemControls index={i} count={teaching.length} noun="pengajaran" onMove={(d) => setTeaching(moved(teaching, i, d))} onRemove={() => setTeaching(teaching.filter((x) => x.key !== item.key))} />
                </div>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div className="space-y-5">
                    <Area label="Institusi" value={item.institution} onChange={(v) => setTeaching(teaching.map((x) => (x.key === item.key ? { ...x, institution: v } : x)))} rows={1} />
                    <Area label="Program" value={item.program} onChange={(v) => setTeaching(teaching.map((x) => (x.key === item.key ? { ...x, program: v } : x)))} rows={1} />
                  </div>
                  <div className="space-y-5">
                    <Area label="Deskripsi" value={item.description} onChange={(v) => setTeaching(teaching.map((x) => (x.key === item.key ? { ...x, description: v } : x)))} rows={3} />
                    <ImageUploadField name={`logo_${item.key}`} label="Logo institusi" folder="leadership" initialPath={item.logoPath || null} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </EditorSection>

        <EditorSection
          title="Tautan Profesional"
          description="LinkedIn, Instagram, dan email — ditampilkan sebagai ikon di bagian paling bawah modal profil. Hanya ikon dengan data yang diisi yang akan tampil."
        >
          <FieldGrid>
            <label className="block">
              <span className={LABEL}>LinkedIn (URL)</span>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/…"
                className={FIELD}
              />
            </label>
            <label className="block">
              <span className={LABEL}>Instagram (URL)</span>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/…"
                className={FIELD}
              />
            </label>
            <label className="block">
              <span className={LABEL}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@environesia.co.id"
                className={FIELD}
              />
            </label>
          </FieldGrid>
        </EditorSection>

        {!canWrite ? (
          <p className="text-small text-[#64748b]">Hanya Super Admin dan Editor yang dapat mengubah data ini.</p>
        ) : null}
      </EditorFrameContent>

      {canWrite ? (
        <EditorFrameFooter>
          <button type="submit" className="inline-flex items-center rounded-[10px] bg-[#2a7793] px-5 py-2.5 text-small font-medium text-white transition-opacity hover:opacity-90">
            {pending ? 'Menyimpan…' : 'Simpan perubahan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/wp-admin/content/leadership')}
            className="rounded-[10px] border border-[#e3e8ee] px-5 py-2.5 text-small text-ink hover:bg-[#f4f6f9]"
          >
            Batal
          </button>
        </EditorFrameFooter>
      ) : null}
      </fieldset>
      <ValidationModal open={modalOpen} missing={missing} onSelectField={goToField} onClose={closeModal} />
    </form>
  );
}

/** A list of paragraphs, each one textarea, with add, reorder, and remove. */
function ListOfText({ items, onChange, addLabel, noun }: { items: string[]; onChange: (items: string[]) => void; addLabel: string; noun: string }) {
  return (
    <div className="space-y-4">
      <button type="button" className={ADD_BUTTON} onClick={() => onChange([...items, ''])}>
        <Plus className="h-4 w-4" aria-hidden="true" /> {addLabel}
      </button>
      <ol className="space-y-3">
        {items.map((text, i) => (
          <li key={i} className="flex items-start gap-3">
            <textarea
              rows={3}
              value={text}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className={`${FIELD} mt-0`}
              aria-label={`${noun} ${i + 1}`}
            />
            <ItemControls index={i} count={items.length} noun={noun} onMove={(d) => onChange(moved(items, i, d))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ol>
    </div>
  );
}

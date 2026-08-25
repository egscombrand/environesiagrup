# Fase 6 — Template Konten Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the client a practical, non-technical way to supply the content every page is waiting on — an authoring guide plus a copy-paste template beside each collection — without any template ever being mistaken for, or rendered as, real content.

**Architecture:** Templates live inside the collection directory they belong to, named `_TEMPLATE.md`. Fase 1's `getCollection` filters on `.endsWith('.mdx')`, so a `.md` file sitting in the same folder is structurally invisible to it — the author finds the example exactly where the real file goes, and the site cannot render it. A regression test locks that guarantee in, because it depends on an implementation detail a future refactor could silently break. A single `content/PANDUAN.md` explains, per collection, which page the data feeds and which fields matter.

**Tech Stack:** Unchanged. No code changes to any page or component; this phase adds documentation, inert template files, and one guard test.

**Spec:** `/home/doly/company-profile-egc/project.md` — §7 (content model, the field list every template mirrors), §10 (what is still pending, i.e. everything these templates unblock).

## Global Constraints

- **No template may contain a real-looking fact.** Every example value must be self-evidently a placeholder — the entity/pillar templates are the exception and only because those collections are already populated with real records; their templates document the empty `layanan` field, not new entries.
- **Templates must never be read by `getCollection`.** They are `.md`, not `.mdx`, and Task 1 adds a test proving that holds.
- **Do not modify any existing content file.** The five entities, four pillars, two stats, and two hero slides are real and reviewed. Adding `layanan` values to them would be inventing services; the template documents the field's shape instead.
- Creating a previously-absent collection directory (e.g. `content/leadership/`) must not change any page's behavior. `getCollection` returns `[]` for both a missing directory and a directory holding no `.mdx` files, so the honest empty states must stay exactly as they are — Task 1's test covers this explicitly.
- The guide is written for a non-technical reader in Indonesian. It explains what to write, not how MDX parsing works.

---

### Task 1: Templates, authoring guide, and the leak guard

**Files:**
- Create: `content/PANDUAN.md`
- Create: `content/leadership/_TEMPLATE.md`
- Create: `content/milestones/_TEMPLATE.md`
- Create: `content/projects/_TEMPLATE.md`
- Create: `content/posts/_TEMPLATE.md`
- Create: `content/jobs/_TEMPLATE.md`
- Create: `content/documents/_TEMPLATE.md`
- Create: `content/entities/_TEMPLATE.md`
- Test: `src/lib/content-templates.test.ts`

**Interfaces:**
- Consumes: `getCollection` from `@/lib/content`
- Produces: authoring templates and a guard test; **no runtime behavior change**

The templates mirror project.md §7's field lists exactly. Each one is a working example the author can copy, rename to `<slug>.mdx`, and edit.

- [ ] **Step 1: Write the failing guard test**

This test is the load-bearing part of the task. It proves that adding template files — and, for four collections, creating the directory for the first time — leaves every page's empty state untouched.

```ts
// src/lib/content-templates.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from './content';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const TEMPLATED_COLLECTIONS = [
  'leadership',
  'milestones',
  'projects',
  'posts',
  'jobs',
  'documents',
  'entities',
];

describe('content templates', () => {
  it('ships a template for every collection that still needs authoring', () => {
    for (const collection of TEMPLATED_COLLECTIONS) {
      const templatePath = path.join(CONTENT_DIR, collection, '_TEMPLATE.md');
      expect(fs.existsSync(templatePath), `missing template for ${collection}`).toBe(true);
    }
  });

  it('never surfaces a template through getCollection', () => {
    for (const collection of TEMPLATED_COLLECTIONS) {
      const slugs = getCollection(collection).map((entry) => entry.slug);
      expect(slugs, `template leaked into ${collection}`).not.toContain('_TEMPLATE');
    }
  });

  it('leaves the still-unauthored collections empty', () => {
    for (const collection of ['leadership', 'milestones', 'projects', 'posts', 'jobs', 'documents']) {
      expect(getCollection(collection), `${collection} should still be empty`).toEqual([]);
    }
  });

  it('leaves the already-authored collections untouched', () => {
    expect(getCollection('entities')).toHaveLength(5);
    expect(getCollection('pillars')).toHaveLength(4);
    expect(getCollection('stats')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/content-templates.test.ts`
Expected: FAIL — the first assertion fails because no template files exist yet. (The third and fourth assertions already pass; that is fine and expected — they are there to catch a regression, not to drive new code.)

- [ ] **Step 3: Write the leadership template**

```md
<!-- content/leadership/_TEMPLATE.md -->
# Template: Profil Pimpinan

Salin isi blok di bawah ke file baru bernama `nama-orang.mdx` di folder ini
(huruf kecil semua, spasi diganti tanda hubung). Contoh: `budi-santoso.mdx`.

File `_TEMPLATE.md` ini sendiri tidak pernah tampil di website — hanya file
berekstensi `.mdx` yang dibaca.

Halaman yang menampilkan data ini: `/pimpinan/direksi` dan `/pimpinan/komisaris`.

---

    ---
    nama: Nama Lengkap
    jabatan: Direktur Utama
    entitas: environesia
    foto: /pimpinan/nama-file-foto.jpg
    bio: Satu sampai tiga kalimat tentang latar belakang dan peran.
    tipe: direksi
    urutan: 1
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `nama` | ya | Nama lengkap, apa adanya. |
| `jabatan` | ya | Contoh: Direktur Utama, Direktur Operasional. |
| `entitas` | tidak | Slug entitas kalau jabatannya melekat pada satu entitas: `environesia`, `greenlab`, `greenskill`, `lsp-praktisi-lingkungan`, `bikin-indonesia-berdaya`. Kosongkan kalau jabatannya di tingkat grup. |
| `foto` | tidak | Letakkan file di `public/pimpinan/`, lalu tulis path-nya di sini. Boleh dikosongkan — halaman tetap tampil rapi tanpa foto. |
| `bio` | tidak | Boleh dikosongkan dulu. |
| `tipe` | ya | Isi `direksi` atau `komisaris`. Menentukan halaman mana yang menampilkannya. |
| `urutan` | ya | Angka. Menentukan urutan tampil; 1 tampil paling awal. |
```

- [ ] **Step 4: Write the milestones template**

```md
<!-- content/milestones/_TEMPLATE.md -->
# Template: Milestone Sejarah

Salin isi blok di bawah ke file baru bernama `tahun-peristiwa.mdx` di folder ini.
Contoh: `2016-pendirian.mdx`.

Halaman yang menampilkan data ini: `/tentang-kami/sejarah`.

---

    ---
    tahun: 2016
    judul: Judul singkat peristiwa
    deskripsi: Satu sampai tiga kalimat menjelaskan apa yang terjadi dan mengapa penting.
    gambar: /sejarah/nama-file.jpg
    urutan: 1
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `tahun` | ya | Angka tahun saja, tanpa tanda kutip. |
| `judul` | ya | Singkat — akan tampil sebagai judul di timeline. |
| `deskripsi` | ya | Penjelasan peristiwanya. |
| `gambar` | tidak | Letakkan file di `public/sejarah/`. Boleh dikosongkan. |
| `urutan` | ya | Angka. Biasanya urut dari peristiwa terlama ke terbaru. |
```

- [ ] **Step 5: Write the projects template**

```md
<!-- content/projects/_TEMPLATE.md -->
# Template: Proyek

Salin isi blok di bawah ke file baru bernama `nama-proyek.mdx` di folder ini.

Halaman yang menampilkan data ini: `/proyek`, dan pin di peta beranda.

---

    ---
    judul: Nama atau deskripsi singkat proyek
    negara: Indonesia
    kota: Balikpapan
    koordinat: [116.8, -1.2]
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Kalau nama klien tidak boleh disebut, tulis deskriptor saja — misalnya "Perusahaan tambang batubara, Kalimantan Timur". |
| `negara` | ya | Nama negara. |
| `kota` | tidak | Kota atau lokasi proyek. |
| `koordinat` | ya | Dua angka dalam kurung siku: **bujur dulu, lalu lintang** (`[bujur, lintang]`). Ini yang menentukan posisi pin di peta. Bisa diambil dari Google Maps — klik kanan pada lokasi, angka pertama yang muncul adalah lintang dan kedua bujur, jadi **urutannya perlu dibalik** saat ditulis di sini. |
```

- [ ] **Step 6: Write the posts template**

```md
<!-- content/posts/_TEMPLATE.md -->
# Template: Berita & Insight

Salin isi blok di bawah ke file baru bernama `judul-artikel.mdx` di folder ini.

Halaman yang menampilkan data ini: `/berita`, dan tiga kartu terbaru di beranda.

---

    ---
    judul: Judul artikel
    slug: judul-artikel
    kategori: Berita
    tanggal: 2026-01-15
    penulis: Nama penulis
    cover: /berita/nama-file.jpg
    ringkasan: Satu sampai dua kalimat yang tampil di kartu daftar berita.
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Judul lengkap artikel. |
| `slug` | ya | Sama dengan nama file tanpa `.mdx`. Huruf kecil, tanda hubung sebagai pemisah. |
| `kategori` | tidak | Contoh: Berita, Insight, Siaran Pers. |
| `tanggal` | ya | Format `YYYY-MM-DD`. |
| `penulis` | tidak | Boleh dikosongkan. |
| `cover` | tidak | Letakkan file di `public/berita/`. |
| `ringkasan` | ya | Muncul di kartu; usahakan ringkas. |
```

- [ ] **Step 7: Write the jobs template**

```md
<!-- content/jobs/_TEMPLATE.md -->
# Template: Lowongan Karier

Salin isi blok di bawah ke file baru bernama `nama-posisi.mdx` di folder ini.

Halaman yang menampilkan data ini: `/karier`.

---

    ---
    posisi: Nama posisi
    entitas: greenlab
    lokasi: Sleman, Yogyakarta
    tipe: Penuh waktu
    deskripsi: Ringkasan tanggung jawab dan kualifikasi utama.
    batasLamaran: 2026-03-31
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `posisi` | ya | Nama jabatan yang dibuka. |
| `entitas` | tidak | Slug entitas yang membuka lowongan. Kosongkan kalau di tingkat grup. |
| `lokasi` | ya | Kota penempatan. |
| `tipe` | ya | Contoh: Penuh waktu, Kontrak, Magang. |
| `deskripsi` | ya | Ringkasan pekerjaan. |
| `batasLamaran` | tidak | Format `YYYY-MM-DD`. Kosongkan kalau dibuka sampai terisi. |
```

- [ ] **Step 8: Write the documents template**

```md
<!-- content/documents/_TEMPLATE.md -->
# Template: Dokumen Unduhan

Salin isi blok di bawah ke file baru bernama `nama-dokumen.mdx` di folder ini.

Halaman yang menampilkan data ini: `/unduhan`.

---

    ---
    judul: Nama dokumen
    tipe: Company Profile
    file: /unduhan/nama-file.pdf
    tanggalTerbit: 2026-01-01
    ---

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Nama dokumen sebagaimana akan ditampilkan. |
| `tipe` | ya | Contoh: Company Profile, Sertifikat, Legalitas. |
| `file` | ya | Letakkan file PDF di `public/unduhan/`, lalu tulis path-nya di sini. |
| `tanggalTerbit` | tidak | Format `YYYY-MM-DD`. |

> Sebelum mengunggah dokumen legalitas, pastikan tidak ada data yang tidak boleh
> dipublikasikan — dokumen di folder ini dapat diunduh siapa saja.
```

- [ ] **Step 9: Write the entities template**

This one differs: `content/entities/` already holds five real, reviewed records. The template documents how to fill the currently-empty `layanan` field on those existing files, and must say plainly that no new entity file should be created.

```md
<!-- content/entities/_TEMPLATE.md -->
# Template: Entitas

**Folder ini sudah berisi lima entitas yang datanya sudah benar.** Jangan
menambah file entitas baru kecuali grup memang menambah badan usaha.

Yang masih perlu diisi adalah field `layanan` — saat ini kosong (`layanan: []`)
di kelima file, sehingga halaman entitas menampilkan "Rincian layanan akan
segera hadir."

## Cara mengisi daftar layanan

Buka file entitas yang ingin diisi, misalnya `greenlab.mdx`. Ubah baris

    layanan: []

menjadi daftar seperti ini:

    layanan:
      - Nama layanan pertama
      - Nama layanan kedua
      - Nama layanan ketiga

Setiap baris diawali dua spasi, lalu tanda hubung, lalu spasi. Urutannya bebas —
akan tampil sesuai urutan yang ditulis.

## Field lain

| Field | Keterangan |
|---|---|
| `legalitas` | Daftar legalitas dan akreditasi, formatnya sama dengan `layanan`. Nomor akreditasi KAN untuk GreenLab dan nomor lisensi BNSP untuk LSP PLI masih menunggu — begitu tersedia, ganti teks "(nomor menyusul)" dengan nomor sebenarnya. |
| `website` | Alamat website entitas, tanpa `https://`. Kosongkan kalau belum ada. |
| `tagline` | Kalimat pendek. Boleh dikosongkan. |
| `logo` | Letakkan file di `public/logo/`, lalu tulis path-nya. Menunggu aset logo vektor. |
| `warnaAksen`, `lini`, `urutan`, `slug`, `nama`, `deskripsi` | Sudah terisi benar. Jangan diubah tanpa alasan. |
```

- [ ] **Step 10: Write the authoring guide**

```md
<!-- content/PANDUAN.md -->
# Panduan Pengisian Konten

Website ini mengambil isinya dari folder `content/`. Setiap subfolder adalah satu
jenis konten, dan setiap file `.mdx` di dalamnya adalah satu entri — satu orang,
satu proyek, satu artikel, dan seterusnya.

Halaman yang datanya belum ada akan menampilkan pesan "sedang disiapkan". Begitu
file pertama ditambahkan, halaman langsung menampilkannya tanpa perlu perubahan
kode.

## Cara menambah satu entri

1. Buka subfolder yang sesuai (lihat tabel di bawah).
2. Buka file `_TEMPLATE.md` di dalamnya — isinya contoh lengkap beserta penjelasan tiap field.
3. Buat file baru berekstensi `.mdx`, namanya huruf kecil dengan tanda hubung sebagai pemisah kata.
4. Salin blok contoh dari template, lalu ganti isinya.
5. Simpan.

File `_TEMPLATE.md` tidak pernah tampil di website karena bukan berekstensi
`.mdx`. Biarkan saja di tempatnya sebagai rujukan.

## Daftar folder

| Folder | Isinya | Tampil di halaman | Status |
|---|---|---|---|
| `entities/` | Lima entitas grup | `/entitas` dan halaman tiap entitas | Sudah terisi; `layanan` masih kosong |
| `pillars/` | Empat pilar layanan | `/bisnis` dan halaman tiap pilar | Sudah terisi; `layanan` masih kosong |
| `stats/` | Angka kunci beranda | Beranda | Sudah terisi |
| `hero/` | Slide hero beranda | Beranda | Terisi dengan gambar sementara |
| `leadership/` | Profil direksi dan komisaris | `/pimpinan/direksi`, `/pimpinan/komisaris` | Kosong |
| `milestones/` | Peristiwa penting per tahun | `/tentang-kami/sejarah` | Kosong |
| `projects/` | Proyek dan lokasinya | `/proyek` dan peta beranda | Kosong |
| `posts/` | Berita dan artikel | `/berita` dan beranda | Kosong |
| `jobs/` | Lowongan kerja | `/karier` | Kosong |
| `documents/` | Dokumen untuk diunduh | `/unduhan` | Kosong |

## Aturan penulisan yang perlu dijaga

Ada satu aturan editorial dari dokumen perencanaan yang tidak boleh dilanggar:

**Bikin Indonesia Berdaya adalah unit penunjang, bukan bagian dari rantai empat
entitas lingkungan.** Jangan menulis narasi yang menempatkannya sejajar dengan
Environesia, GreenLab, GreenSkill, dan LSP PLI, atau yang memasukkannya ke dalam
alur konsultasi → pengujian → pelatihan → sertifikasi. Di halamannya sendiri ia
berdiri penuh sebagai bisnis konveksi.

## Konten yang masih ditunggu

Beberapa halaman menunggu materi yang hanya bisa datang dari internal:

- Nama legal dan bentuk badan hukum tiap entitas
- Nomor akreditasi KAN (GreenLab) dan nomor lisensi BNSP (LSP PLI)
- Daftar sepuluh negara tempat proyek berjalan
- Naskah visi dan misi
- Filosofi logo grup
- Naskah manifesto Green Business dan pesan CEO
- Foto dan video hero (saat ini memakai gambar gradien sementara)
- File logo vektor tiap entitas
- Naskah kebijakan privasi dari tim legal — ini yang menahan formulir kontak

Halaman untuk semuanya sudah siap; yang kurang hanya isinya.
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npx vitest run src/lib/content-templates.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 12: Verify no page behavior changed**

```bash
npm run test
npm run build
```

Expected: the full suite passes with every earlier suite still green, and the build still produces the same page count as before this task. Creating four new collection directories must not alter a single rendered page.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "docs: add content templates and authoring guide"
```

---

## Fase 6 exit criteria

- `npm run test` and `npm run build` pass, with no change to any rendered page.
- Every collection that still needs authoring has a `_TEMPLATE.md` beside it, mirroring project.md §7's field list.
- `content/PANDUAN.md` explains, in plain Indonesian, how to add an entry, which folder feeds which page, and what is still outstanding.
- The guard test proves templates never surface through `getCollection`, and that the six unauthored collections still read as empty.
- No template contains a fact that could be mistaken for real company data.
- The entities template states plainly that no new entity file should be created, and documents only the `layanan` and `legalitas` fields the client still needs to fill.

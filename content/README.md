# Content collections

MDX-in-repo. Each collection is a folder under `content/<collection>/`,
one `.mdx` file per entry, read at build time via `getCollection` in
`src/lib/content.ts`. No external CMS service.

## entities
nama, slug, tagline, lini (inti | penunjang), warna aksen, deskripsi, layanan[], legalitas[], website, logo, urutan

## projects
judul, slug, entitas[], sektor, negara, kota, tahun, klien (opsional), clientAnonymous (opsional), ringkasan, isi, galeri[], koordinat

## leadership
nama, jabatan, entitas, foto, bio, urutan, tipe (direksi | komisaris)

## posts
judul, slug, kategori, tanggal, penulis, cover, ringkasan, isi

## milestones
tahun, judul, deskripsi, gambar

## pillars
nama, slug, ikon, deskripsi, layanan[], entitas terkait[]

## stats
label, nilai, satuan, urutan

## documents
judul, tipe, file, tanggal terbit

## jobs
posisi, entitas, lokasi, tipe, deskripsi, batas lamaran

Collections are populated starting Fase 2 (`stats`, `entities`) and
Fase 3/5 (`projects`, `leadership`, `posts`, `milestones`, `pillars`,
`jobs`, `documents`). Fase 1 only wires the reader (`getCollection`)
and this convention — no collection folders are created yet.

## Locale convention (decided, not yet implemented)

Routes are locale-prefixed (`/id/...`, `/en/...`) from Fase 1, but
`getCollection` itself is currently locale-blind — it just reads
`content/<collection>/*.mdx`. When English content starts landing (Fase 6+),
the convention is: `content/<collection>/<slug>.<locale>.mdx` (e.g.
`content/entities/greenlab.id.mdx`, `content/entities/greenlab.en.mdx`), with
`id` as the fallback when a locale-specific file is missing. `getCollection`
will need a locale parameter and fallback logic at that point — not needed
until real English content exists.

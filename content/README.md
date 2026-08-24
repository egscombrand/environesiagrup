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

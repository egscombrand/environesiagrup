# Template: Profil Pimpinan

Salin isi blok di bawah ke file baru bernama `nama-orang.mdx` di folder ini
(huruf kecil semua, spasi diganti tanda hubung). Contoh: `budi-santoso.mdx`.

File `_TEMPLATE.md` ini sendiri tidak pernah tampil di website — hanya file
berekstensi `.mdx` yang dibaca.

Halaman yang menampilkan data ini: `/pimpinan/direksi` dan `/pimpinan/komisaris`.

---

```yaml
---
nama: Nama Lengkap
jabatan: Direktur Utama
entitas: environesia
foto: /pimpinan/nama-file-foto.jpg
bio: Satu sampai tiga kalimat tentang latar belakang dan peran.
tipe: direksi
urutan: 1
---
```

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

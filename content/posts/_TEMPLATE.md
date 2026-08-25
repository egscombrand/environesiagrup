# Template: Berita & Insight

Salin isi blok di bawah ke file baru bernama `judul-artikel.mdx` di folder ini.

Halaman yang menampilkan data ini: `/berita`, dan tiga kartu terbaru di beranda.

---

```yaml
---
judul: Judul artikel
slug: judul-artikel
kategori: Berita
tanggal: 2026-01-15
penulis: Nama penulis
cover: /berita/nama-file.jpg
ringkasan: Satu sampai dua kalimat yang tampil di kartu daftar berita.
---
```

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

# Template: Berita & Insight

Salin isi blok di bawah ke file baru bernama `judul-artikel.mdx` di folder ini.

Halaman yang menampilkan data ini: `/berita`, dan tiga kartu terbaru di beranda.

---

```yaml
---
judul: Judul artikel
slug: judul-artikel
tanggal: 2026-01-15
ringkasan: Satu sampai dua kalimat yang tampil di kartu daftar berita.
---
```

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Judul lengkap artikel. |
| `slug` | ya | Sama dengan nama file tanpa `.mdx`. Huruf kecil, tanda hubung sebagai pemisah. |
| `tanggal` | ya | Format `YYYY-MM-DD`. |
| `ringkasan` | ya | Muncul di kartu; usahakan ringkas. |

Field lain seperti `kategori`, `penulis`, dan `cover` sudah direncanakan di
`project.md` tapi belum ditampilkan di halaman manapun — isi hanya empat
field di atas untuk sekarang.

# Template: Dokumen Unduhan

Salin isi blok di bawah ke file baru bernama `nama-dokumen.mdx` di folder ini.

Halaman yang menampilkan data ini: `/unduhan`.

---

```yaml
---
judul: Nama dokumen
tipe: Company Profile
file: /unduhan/nama-file.pdf
tanggalTerbit: 2026-01-01
---
```

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Nama dokumen sebagaimana akan ditampilkan. |
| `tipe` | ya | Contoh: Company Profile, Sertifikat, Legalitas. |
| `file` | ya | Letakkan file PDF di `public/unduhan/`, lalu tulis path-nya di sini. |
| `tanggalTerbit` | tidak | Format `YYYY-MM-DD`. |

> Sebelum mengunggah dokumen legalitas, pastikan tidak ada data yang tidak boleh
> dipublikasikan — dokumen di folder ini dapat diunduh siapa saja.

# Template: Milestone Sejarah

Salin isi blok di bawah ke file baru bernama `tahun-peristiwa.mdx` di folder ini.
Contoh: `2016-pendirian.mdx`.

Halaman yang menampilkan data ini: `/tentang-kami/sejarah`.

---

```yaml
---
tahun: 2016
judul: Judul singkat peristiwa
deskripsi: Satu sampai tiga kalimat menjelaskan apa yang terjadi dan mengapa penting.
gambar: /sejarah/nama-file.jpg
urutan: 1
---
```

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `tahun` | ya | Angka tahun saja, tanpa tanda kutip. |
| `judul` | ya | Singkat — akan tampil sebagai judul di timeline. |
| `deskripsi` | ya | Penjelasan peristiwanya. |
| `gambar` | tidak | Letakkan file di `public/sejarah/`. Boleh dikosongkan. |
| `urutan` | ya | Angka. Biasanya urut dari peristiwa terlama ke terbaru. |

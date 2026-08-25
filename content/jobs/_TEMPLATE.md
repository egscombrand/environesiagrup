# Template: Lowongan Karier

Salin isi blok di bawah ke file baru bernama `nama-posisi.mdx` di folder ini.

Halaman yang menampilkan data ini: `/karier`.

---

```yaml
---
posisi: Nama posisi
entitas: greenlab
lokasi: Sleman, Yogyakarta
tipe: Penuh waktu
deskripsi: Ringkasan tanggung jawab dan kualifikasi utama.
batasLamaran: 2026-03-31
---
```

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `posisi` | ya | Nama jabatan yang dibuka. |
| `entitas` | tidak | Slug entitas yang membuka lowongan. Kosongkan kalau di tingkat grup. |
| `lokasi` | ya | Kota penempatan. |
| `tipe` | ya | Contoh: Penuh waktu, Kontrak, Magang. |
| `deskripsi` | ya | Ringkasan pekerjaan. |
| `batasLamaran` | tidak | Format `YYYY-MM-DD`. Kosongkan kalau dibuka sampai terisi. |

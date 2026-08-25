# Template: Proyek

Salin isi blok di bawah ke file baru bernama `nama-proyek.mdx` di folder ini.

Halaman yang menampilkan data ini: `/proyek`, dan pin di peta beranda.

---

```yaml
---
judul: Nama atau deskripsi singkat proyek
negara: Indonesia
kota: Balikpapan
koordinat: [116.8, -1.2]
---
```

## Penjelasan field

| Field | Wajib | Keterangan |
|---|---|---|
| `judul` | ya | Kalau nama klien tidak boleh disebut, tulis deskriptor saja — misalnya "Perusahaan tambang batubara, Kalimantan Timur". |
| `negara` | ya | Nama negara. |
| `kota` | tidak | Kota atau lokasi proyek. |
| `koordinat` | ya | Dua angka dalam kurung siku: **bujur dulu, lalu lintang** (`[bujur, lintang]`). Ini yang menentukan posisi pin di peta. Bisa diambil dari Google Maps — klik kanan pada lokasi, angka pertama yang muncul adalah lintang dan kedua bujur, jadi **urutannya perlu dibalik** saat ditulis di sini. |

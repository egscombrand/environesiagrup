# Template: Entitas

**Folder ini sudah berisi lima entitas yang datanya sudah benar.** Jangan
menambah file entitas baru kecuali grup memang menambah badan usaha.

Yang masih perlu diisi adalah field `layanan` — saat ini kosong (`layanan: []`)
di kelima file, sehingga halaman entitas menampilkan "Rincian layanan akan
segera hadir."

## Cara mengisi daftar layanan

Buka file entitas yang ingin diisi, misalnya `greenlab.mdx`. Ubah baris

```yaml
layanan: []
```

menjadi daftar seperti ini:

```yaml
layanan:
  - Nama layanan pertama
  - Nama layanan kedua
  - Nama layanan ketiga
```

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

## Logo

Field `logo` menunjuk ke berkas di `public/brand/`, satu per entitas:
`/brand/entitas-<slug>.png`.

Kelima berkas itu dibuat dari artwork resmi dengan cara yang sama: konten
di-trim rapat, lalu diletakkan di kanvas seragam 640x200 dan ditengahkan.
Kanvas seragam itu penting — rasio artwork aslinya berbeda-beda (2,66
sampai 4,04), jadi kalau dipakai apa adanya, satu logo bisa tampil jauh
lebih besar dari tetangganya dalam satu baris kartu.

Kalau ada artwork baru, ikuti cara yang sama supaya ukurannya tetap
seragam. Jangan memotong bagian mana pun dari logo (termasuk baris
"member of environesia") — itu bagian dari identitas resmi.

# Template: Pilar Bisnis

**Folder ini sudah berisi empat pilar yang datanya sudah benar.** Jangan
menambah file pilar baru kecuali grup memang menambah lini bisnis.

Yang masih perlu diisi adalah field `layanan` — saat ini kosong (`layanan: []`)
di keempat file, sama seperti di `content/entities/`.

## Cara mengisi daftar layanan

Buka file pilar yang ingin diisi, misalnya `pengujian-sampling.mdx`. Ubah baris

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
| `entitasTerkait` | Daftar slug entitas yang menjalankan pilar ini. Sudah terisi benar — jangan diubah tanpa alasan. |
| `ikon` | Nama ikon yang dipakai di kartu pilar. Sudah terisi benar — jangan diubah tanpa alasan. |
| `nama`, `slug`, `deskripsi`, `urutan` | Sudah terisi benar. Jangan diubah tanpa alasan. |

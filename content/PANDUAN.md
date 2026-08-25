# Panduan Pengisian Konten

Website ini mengambil isinya dari folder `content/`. Setiap subfolder adalah satu
jenis konten, dan setiap file `.mdx` di dalamnya adalah satu entri — satu orang,
satu proyek, satu artikel, dan seterusnya.

Halaman yang datanya belum ada akan menampilkan pesan "sedang disiapkan". Begitu
file pertama ditambahkan, halaman langsung menampilkannya tanpa perlu perubahan
kode.

## Cara menambah satu entri

1. Buka subfolder yang sesuai (lihat tabel di bawah).
2. Buka file `_TEMPLATE.md` di dalamnya — isinya contoh lengkap beserta penjelasan tiap field.
3. Buat file baru berekstensi `.mdx`, namanya huruf kecil dengan tanda hubung sebagai pemisah kata.
4. Salin blok contoh dari template, lalu ganti isinya.
5. Simpan.

File `_TEMPLATE.md` tidak pernah tampil di website karena bukan berekstensi
`.mdx`. Biarkan saja di tempatnya sebagai rujukan.

Untuk sekarang, semua file memakai nama polos `<slug>.mdx` (bahasa Indonesia).
Begitu versi Inggris mulai dikerjakan, namanya berubah jadi
`<slug>.id.mdx` / `<slug>.en.mdx` — belum perlu dipikirkan sampai konten
Inggris benar-benar ada.

## Daftar folder

| Folder | Isinya | Tampil di halaman | Status |
|---|---|---|---|
| `entities/` | Lima entitas grup | `/entitas` dan halaman tiap entitas | Sudah terisi; `layanan` masih kosong |
| `pillars/` | Empat pilar layanan | `/bisnis` dan halaman tiap pilar | Sudah terisi; `layanan` masih kosong |
| `stats/` | Angka kunci beranda | Beranda | Sudah terisi |
| `hero/` | Slide hero beranda | Beranda | Terisi dengan gambar sementara |
| `leadership/` | Profil direksi dan komisaris | `/pimpinan/direksi`, `/pimpinan/komisaris` | Kosong |
| `milestones/` | Peristiwa penting per tahun | `/tentang-kami/sejarah` | Kosong |
| `projects/` | Proyek dan lokasinya | `/proyek` dan peta beranda | Kosong |
| `posts/` | Berita dan artikel | `/berita` dan beranda | Kosong |
| `jobs/` | Lowongan kerja | `/karier` | Kosong |
| `documents/` | Dokumen untuk diunduh | `/unduhan` | Kosong |

## Aturan penulisan yang perlu dijaga

Ada satu aturan editorial dari dokumen perencanaan yang tidak boleh dilanggar:

**Bikin Indonesia Berdaya adalah unit penunjang, bukan bagian dari rantai empat
entitas lingkungan.** Jangan menulis narasi yang menempatkannya sejajar dengan
Environesia, GreenLab, GreenSkill, dan LSP PLI, atau yang memasukkannya ke dalam
alur konsultasi → pengujian → pelatihan → sertifikasi. Di halamannya sendiri ia
berdiri penuh sebagai bisnis konveksi.

## Konten yang masih ditunggu

Beberapa halaman menunggu materi yang hanya bisa datang dari internal:

- Nama legal dan bentuk badan hukum tiap entitas
- Nomor akreditasi KAN (GreenLab) dan nomor lisensi BNSP (LSP PLI)
- Daftar sepuluh negara tempat proyek berjalan
- Naskah visi dan misi
- Filosofi logo grup
- Naskah manifesto Green Business dan pesan CEO
- Foto dan video hero (saat ini memakai gambar gradien sementara)
- File logo vektor tiap entitas
- Naskah kebijakan privasi dari tim legal — ini yang menahan formulir kontak

Halaman untuk semuanya sudah siap; yang kurang hanya isinya.

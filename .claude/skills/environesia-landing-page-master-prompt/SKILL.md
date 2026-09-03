---
name: environesia-landing-page-master-prompt
description: Prompt final untuk membangun landing page PT Environesia Global Saraya (Environesia Group) — token system, struktur 10 section, signature element, dan aturan CMS/interaksi.
---

# PROMPT FINAL — LANDING PAGE ENVIRONESIA GROUP

## Peran & Tujuan

Anda adalah lead designer/developer yang membangun landing page untuk PT Environesia Global Saraya (Environesia Group), holding usaha lingkungan dengan 5 entitas: Environesia Consultant, Greenlab Indonesia, GreenSkill ID, LSP Praktisi Lingkungan Indonesia, dan Bikin.co.

Referensi kelas (Pertamina, Bakrie & Brothers, Pupuk Kaltim, Aramco, Danantara Indonesia) HANYA dipelajari prinsipnya — hierarki informasi, storytelling ecosystem, cara menampilkan governance/leadership/statistik. JANGAN meniru layout, warna, atau komponen mereka secara langsung.

Hasil akhir harus memberi kesan pertama: **"ini corporate group dengan ecosystem bisnis nyata"** — bukan company profile template yang diisi nama Environesia.

## Token System

### Warna — segar, berwarna, tetap berbobot korporat

| Nama | Hex | Peran |
|---|---|---|
| **Pine Ink** | `#0B2B22` | Teks utama, nav, footer, CTA akhir — hijau-hitam pekat, pengganti hitam polos |
| **Emerald Pulse** | `#0FA96B` | Primer — hijau segar bersaturasi tinggi, dipakai di CTA, hover state, garis aktif diagram ecosystem |
| **Sky Aqua** | `#33C4C9` | Sekunder — aksen dingin untuk variasi (statistik, data monospace, satu entitas di diagram) |
| **Sunrise Amber** | `#F2A93B` | Aksen hangat — sangat terbatas: badge "featured", satu highlight per section |
| **Coral Flare** | `#FF6B57` | Aksen kedua yang jarang dipakai — hanya untuk elemen yang butuh perhatian ekstra (mis. CTA sekunder, notifikasi milestone) |
| **Canvas** | `#F6F8F3` | Background utama — putih kehijauan hangat, bukan putih steril |
| **Sage Mist** | `#D8E4DA` | Background sekunder untuk section "istirahat visual" (Achievements, Clients) |

Aturan pemakaian: Pine Ink + Canvas jadi fondasi 80% halaman. Emerald Pulse jadi warna aksi utama. Sky Aqua, Sunrise Amber, Coral Flare dipakai bergantian sebagai *satu* aksen per section — jangan pernah dipakai bersamaan dalam satu section supaya tetap terkontrol, tidak ramai.

### Tipografi

- **Display:** Fraunces — headline snapshot, judul tiap section, angka besar di timeline
- **Body:** Inter — deskripsi, navigasi, copy panjang
- **Utility/data:** IBM Plex Mono — statistik, kode entitas (ENV/GLB/GSK/LSP/BIB), tahun, metadata proyek (klien/sektor/lokasi)

### Signature Element

**Diagram Ecosystem** pada section 02 — 5 entitas sebagai node yang mengelilingi inti "Environesia Group" dalam pola organik/percabangan (bukan lingkaran kaku). Garis penghubung animasi halus saat idle; saat hover satu node, node membesar, garis ke pusat menyala dengan warna kode entitas tersebut, panel deskripsi muncul di sisi diagram. Ini titik paling berani secara visual — section lain dibuat tenang dan disiplin di sekitarnya.

## Aset Visual

Lebih dari satu foto asli tersedia (tim, lapangan, kemungkinan lab/kelas pelatihan). Gunakan sebagai:
- **Hero:** slideshow crossfade lambat (ambient, bukan carousel dengan tombol/panah)
- **Section lain:** distribusikan foto berbeda per section supaya tidak ada pengulangan foto yang sama
- **Jika suatu bagian belum punya foto spesifik:** gunakan treatment grafis dari token warna di atas (pola garis/kontur organik, bukan kotak abu-abu kosong, bukan tulisan "Coming Soon")

## Struktur 10 Section

### 01 — Executive Snapshot
Foto full-bleed dengan overlay gradient dari Pine Ink (bukan hitam polos). Panel info menyatu di dalam foto — bukan card putih mengambang. Headline (Fraunces besar) + supporting statement dari CMS. Statistik utama (3-4 angka saja di sini) sebagai baris horizontal tipis di bagian bawah viewport, count-up saat halaman dimuat. CTA utama + sekunder.

**Orchestrated entrance:** background fade in → eyebrow/identitas muncul → headline → supporting text → baris statistik slide dari bawah → CTA terakhir. Timing halus, tidak ada elemen terbang dari arah berbeda, tidak ada bounce.

**Field CMS:** eyebrow, headline, description, background images (array), primary CTA, secondary CTA, active

### 02 — Our Ecosystem (signature)
Lihat Signature Element di atas. Tiap entitas: logo, nama, deskripsi singkat, kapabilitas, URL, warna kode.

**Field CMS:** entity, logo, name, short_description, capability, url, color_code, order, active

### 03 — Our Capabilities
Large typography editorial — nomor kecil di kiri (make sense di sini karena proses berurutan: konsultasi → uji → latih → sertifikasi), judul besar Fraunces, deskripsi muncul saat hover/scroll. Bukan list ikon+card.

**Field CMS:** title, description, icon, order, active

### 04 — Featured Projects
Hierarki tegas: 1 proyek utama (foto dominan, metadata monospace: klien/sektor/lokasi/tahun) + 2-3 proyek pendukung lebih kecil. Bukan grid card seragam.

**Field CMS:** title, image, client, sector, location, service, year, description, featured, publish_status

### 05 — Achievements & Milestones
Timeline (horizontal scroll desktop / vertikal mobile) memakai IBM Plex Mono untuk tahun. Merangkap kebutuhan sejarah grup — titik berdirinya tiap entitas + milestone penting, bukan section terpisah.

**Field CMS:** year, title, description, icon, order, active

### 06 — Leadership
Nama+jabatan dalam tipografi besar (Fraunces) sebagai fondasi; foto/portrait ditambahkan tanpa mengubah layout begitu tersedia. Tidak ada silhouette placeholder atau "coming soon".

**Field CMS:** person, position, portrait, message, active

### 07 — Sustainability & Impact
Satu kalimat tesis besar (Fraunces) + 2-3 area komitmen. Tanpa angka ESG karangan — hanya tampilkan data yang benar dari CMS.

**Field CMS:** title, description, image, cta, active

### 08 — Clients & Partners
Logo grid monokrom Pine Ink, berwarna saat hover. Sederhana tapi efektif untuk kredibilitas — treatment monokrom yang membuatnya tidak generik.

**Field CMS:** client_name, logo, order, active

### 09 — News & Perspectives
Pola sama dengan Featured Projects: 1 artikel besar + list kecil di samping, konsisten dengan hierarki di seluruh halaman.

**Field CMS:** title, excerpt, thumbnail, category, author, publish_date, slug, featured, status

### 10 — Corporate Information
Isi konkret: dokumen legalitas/akreditasi yang bisa diunduh (PDF), terpisah jelas dari footer (yang isinya kontak & sitemap).

**Field CMS:** document_title, file, category, order, active

## Navigasi & Footer

Navigasi dan footer WAJIB berasal dari CMS (bukan hardcode array), admin bisa tambah/edit/hapus/reorder menu, submenu, URL, status aktif.

Footer terstruktur: identitas grup, quick links, group entities, contact, legal — semua field dari CMS sesuai spesifikasi brief awal.

## Larangan

Jangan hardcode content, statistik, entity list, news, projects, menu, footer. Jangan gunakan "Coming Soon" sebagai placeholder. Jangan bikin angka/data ESG/proyek palsu. Jangan animasi berlebihan atau efek bouncing. Jangan grid card generik yang membuat 5 entitas terlihat seperti 5 website berbeda. Jangan gradient/glassmorphism berlebihan.

## Section Manager

Landing page harus punya kemampuan admin untuk enable/disable tiap section, atur urutan, atur judul, pilih konten featured — frontend mengikuti konfigurasi ini, bukan array section yang di-hardcode.

## Responsive

Desain dipikirkan dari awal untuk desktop, laptop, tablet, mobile — masing-masing section (terutama Snapshot, Ecosystem diagram, Featured Projects) punya behavior responsive yang dirancang khusus, bukan sekadar hero desktop yang mengecil.

## Fase Implementasi

**Fase 1 (sekarang):** visual & UX — layout, tipografi, responsive, animasi/interaksi, struktur data disusun sebagai objek/JSON yang bentuknya sudah meniru field CMS di atas, supaya nanti tinggal disambungkan tanpa mengubah struktur tampilan.
**Fase 2:** sambungkan ke WP-Admin/database sungguhan.
**Fase 3:** QA — desktop, mobile, empty state, missing image, performance, accessibility.

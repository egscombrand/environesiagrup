-- Direktur Utama & Dewan Direksi: the five people, their profiles, and the
-- section headings the tab shows (see src/lib/cms/leadership-content.ts and
-- src/lib/cms/leadership-profile.ts).
--
-- Run after 0037_leadership_profile.sql.
--
-- Each person is a leadership row: bio in the bio column, and the rest of the
-- modal's detail in profile. Photos and logos are the Storage paths copied from
-- /public. The group-entity leader is linked to the entity by its slug.
--
-- Safe to run more than once: "on conflict do nothing" never overwrites a row,
-- so edits made in wp-admin are kept.

insert into public.leadership (
  name, slug, position, type, photo_path, bio, entity_id, status, sort_order, profile
) values (
  $q$Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng.$q$, $q$direktur-utama$q$, $q$Director Environesia Group$q$, $q$direktur_utama$q$, $q$legacy/leadership/direktur-utama.png$q$, $q$Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng., dikenal sebagai Bangsap, merupakan praktisi bisnis lingkungan yang telah menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara. Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan serta Dosen Praktisi di Magister Pengelolaan Lingkungan UGM dan Sustainable Business BINUS University.$q$,
  null,
  'published', 10, $q${"descriptor":"Praktisi Bisnis Lingkungan","education":[{"level":"S1 Teknik Lingkungan","institution":"Universitas Islam Indonesia (UII)","degree":"S.T.","scholarship":"Beasiswa Abdul Kahar Muzakkir","logoPath":"legacy/pendidikan/logo-uii-asli.webp"},{"level":"S2 Magister Pengelolaan Lingkungan","institution":"Universitas Gadjah Mada (UGM)","degree":"M.Sc.","scholarship":"LPDP","logoPath":"legacy/pendidikan/logo-ugm-transparent.png"},{"level":"S2 Magister Teknik Lingkungan","institution":"Universitas Islam Indonesia (UII)","degree":"M.T.","logoPath":"legacy/pendidikan/logo-uii-asli.webp"},{"level":"Program Insinyur Teknik","institution":"Universitas Gadjah Mada (UGM)","degree":"Ir.","logoPath":"legacy/pendidikan/logo-ugm-transparent.png"},{"level":"S3 Program Doktor Manajemen & Bisnis","institution":"IPB University","note":"Menempuh pendidikan doktoral sebagai bagian dari penguatan kapasitas akademik, kepemimpinan, dan pengembangan bisnis berkelanjutan.","logoPath":"legacy/pendidikan/logo-ipb.png"}],"experience":["Ir. Saprian, S.T., M.Sc., M.T., IPM., ASEAN Eng. dikenal sebagai praktisi bisnis lingkungan dengan pengalaman menangani lebih dari 1.000 proyek di 38 provinsi dan 10 negara.","Ia merupakan Founder & CEO dari 5 entitas bisnis lingkungan dengan pengalaman dalam pengembangan dan pengelolaan usaha di bidang konsultansi dan laboratorium lingkungan, sertifikasi kompetensi, serta pendidikan dan pelatihan.","Pengalaman profesional tersebut mencakup pekerjaan bersama masyarakat, perusahaan, pemerintah, hingga mitra internasional dalam berbagai konteks pengelolaan lingkungan dan pengembangan bisnis."],"stats":[{"value":"1.000+","label":"Proyek"},{"value":"38","label":"Provinsi"},{"value":"10","label":"Negara"},{"value":"5","label":"Entitas Bisnis Lingkungan"}],"contributionLabel":"Kontribusi Profesional","contribution":["Bagi Bangsap, keberlanjutan lingkungan tidak cukup berhenti sebagai gagasan, tetapi perlu diterjemahkan menjadi solusi yang dapat digunakan, memberi manfaat, dan memiliki model bisnis yang mampu berjalan secara berkelanjutan."],"teaching":[{"institution":"Universitas Gadjah Mada (UGM)","program":"Magister Pengelolaan Lingkungan","description":"Aktivitas sebagai dosen praktisi menjadi ruang untuk menghubungkan teori akademik dengan pengalaman praktik lingkungan dan kasus nyata di lapangan.","logoPath":"legacy/pendidikan/logo-ugm-transparent.png"},{"institution":"BINUS University","program":"Sustainable Business","description":"Mengajarkan bisnis berkelanjutan dan penerapannya dalam praktik bisnis.","logoPath":"legacy/pendidikan/logo-binus-university.png"}],"photo":{"width":1314,"height":2154}}$q$::jsonb
) on conflict (slug) do nothing;

insert into public.leadership (
  name, slug, position, type, photo_path, bio, entity_id, status, sort_order, profile
) values (
  $q$Nurul Lahtifah, S.T.$q$, $q$dewan-nurul-lahtifah$q$, $q$Director Corporate Services and Innovation$q$, $q$direksi$q$, $q$legacy/mba-nurul.jpg$q$, null,
  null,
  'published', 20, $q${"education":[],"experience":[],"stats":[],"contribution":[],"teaching":[],"photo":{"width":801,"height":1426}}$q$::jsonb
) on conflict (slug) do nothing;

insert into public.leadership (
  name, slug, position, type, photo_path, bio, entity_id, status, sort_order, profile
) values (
  $q$Yusuf Wiryawan, S.T.M.Ling.M.T.$q$, $q$dewan-yusuf-wiryawan$q$, $q$Director of Operational$q$, $q$direksi$q$, $q$legacy/bang-ucup.jpg$q$, null,
  null,
  'published', 30, $q${"education":[],"experience":[],"stats":[],"contribution":[],"teaching":[],"photo":{"width":801,"height":1426}}$q$::jsonb
) on conflict (slug) do nothing;

insert into public.leadership (
  name, slug, position, type, photo_path, bio, entity_id, status, sort_order, profile
) values (
  $q$Ir. Ariyan Eka Putra, S.T.M.T.$q$, $q$dewan-ariyan-eka-putra$q$, $q$Director Business Development$q$, $q$direksi$q$, $q$legacy/bang-ariyan.jpg$q$, null,
  null,
  'published', 40, $q${"education":[],"experience":[],"stats":[],"contribution":[],"teaching":[],"photo":{"width":801,"height":1426}}$q$::jsonb
) on conflict (slug) do nothing;

insert into public.leadership (
  name, slug, position, type, photo_path, bio, entity_id, status, sort_order, profile
) values (
  $q$Fauzan Madani$q$, $q$entitas-fauzan-madani$q$, $q$Direktur$q$, $q$entitas_grup$q$, $q$legacy/bang-ojan.jpeg$q$, null,
  (select id from public.entities where slug = $q$bikin-indonesia-berdaya$q$),
  'published', 50, $q${"education":[],"experience":[],"stats":[],"contribution":[],"teaching":[],"photo":{"width":801,"height":1426}}$q$::jsonb
) on conflict (slug) do nothing;

insert into public.page_content (
  slug, section_group, title, items, status, sort_order
) values (
  'direktur', 'tentang-kami', $q$Direktur Utama & Dewan Direksi$q$, $q$[{"title":"Direktur Utama","description":""},{"title":"Dewan Direksi","description":""},{"title":"Leadership Entitas Grup","description":"Kepemimpinan pada entitas yang menjadi bagian dari Environesia Group."}]$q$::jsonb, 'published', 40
) on conflict (slug) do nothing;

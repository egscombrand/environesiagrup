-- Legalitas & Sertifikasi, moved out of src/lib/legalitas-data.ts and into the
-- database, so wp-admin can edit it. Structure is kept exactly as it was:
--   legal_entities  -> one per company in the group (2 today)
--   legal_cards     -> one per institution / document group, under an entity
--   legal_documents -> one per document, under a card
--
-- The seed below reproduces every entry of legalitas-data.ts with its original
-- id, so links and anchors keep working. It uses ON CONFLICT DO NOTHING, so
-- running it against a database that already has these rows changes nothing,
-- and it never deletes or overwrites data an admin has since edited.
--
-- Document files (documentUrl / documentType) are not in the seed: none existed
-- in the source data. They can be added later from wp-admin.

create table if not exists public.legal_entities (
  id text primary key,
  name text not null,
  short_name text not null,
  legal_name text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_cards (
  id text primary key,
  entity_id text not null references public.legal_entities (id) on delete cascade,
  category text not null check (category in ('Akta & AHU', 'Perizinan', 'ISO & Sistem Manajemen', 'Sertifikasi', 'Akreditasi', 'Keanggotaan', 'Lainnya')),
  logo text,
  logo_alt text not null,
  title text not null,
  subtitle text,
  intro jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legal_cards_entity_id_idx on public.legal_cards (entity_id);

create table if not exists public.legal_documents (
  id text primary key,
  card_id text not null references public.legal_cards (id) on delete cascade,
  title text not null,
  issuer text,
  fields jsonb not null default '[]'::jsonb,
  description text,
  document_url text,
  document_type text check (document_type in ('pdf', 'image')),
  external_url text,
  cta_label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legal_documents_card_id_idx on public.legal_documents (card_id);

create trigger set_legal_entities_updated_at
  before update on public.legal_entities
  for each row execute function public.set_updated_at();

create trigger set_legal_cards_updated_at
  before update on public.legal_cards
  for each row execute function public.set_updated_at();

create trigger set_legal_documents_updated_at
  before update on public.legal_documents
  for each row execute function public.set_updated_at();

alter table public.legal_entities enable row level security;
alter table public.legal_cards enable row level security;
alter table public.legal_documents enable row level security;

-- Legal information is public by nature: the public Legalitas page reads it.
-- Only staff may change it.
create policy "legal_entities_select_all" on public.legal_entities
  for select to anon, authenticated using (true);
create policy "legal_cards_select_all" on public.legal_cards
  for select to anon, authenticated using (true);
create policy "legal_documents_select_all" on public.legal_documents
  for select to anon, authenticated using (true);

create policy "legal_entities_write_staff" on public.legal_entities
  for all to authenticated using (public.is_admin_role()) with check (public.is_admin_role());
create policy "legal_cards_write_staff" on public.legal_cards
  for all to authenticated using (public.is_admin_role()) with check (public.is_admin_role());
create policy "legal_documents_write_staff" on public.legal_documents
  for all to authenticated using (public.is_admin_role()) with check (public.is_admin_role());

-- Seed: entities, then cards, then documents (order matters for the foreign keys).
insert into public.legal_entities (id, name, short_name, legal_name, sort_order) values
  ('environesia-global-saraya', 'Environesia Global Saraya', 'Environesia', null, 1),
  ('greenlab-indonesia', 'Greenlab Indonesia', 'Greenlab', 'PT Greenlab Indo Global', 2)
on conflict (id) do nothing;

insert into public.legal_cards (id, entity_id, category, logo, logo_alt, title, subtitle, intro, sort_order) values
  ('egs-akta', 'environesia-global-saraya', 'Akta & AHU', '/legalitas/garuda.svg', 'Garuda Pancasila', 'Akta & Dokumen Perusahaan', 'Legal Corporate Documents', '[]'::jsonb, 1),
  ('egs-csms-pln', 'environesia-global-saraya', 'Sertifikasi', '/legalitas/pln.svg', 'PLN', 'Contractor Safety Management System', 'PLN', '[]'::jsonb, 2),
  ('egs-ahu-ki', 'environesia-global-saraya', 'Akta & AHU', '/legalitas/pengayoman.svg', 'Pengayoman — Kementerian Hukum dan HAM', 'AHU & Kekayaan Intelektual', 'Kementerian Hukum dan HAM RI', '[]'::jsonb, 3),
  ('egs-csms-pjb', 'environesia-global-saraya', 'Sertifikasi', '/legalitas/pjb.svg', 'Pembangkit Jawa Bali', 'Pembangkit Jawa Bali CSMS', 'PJB', '[]'::jsonb, 4),
  ('egs-pajak', 'environesia-global-saraya', 'Lainnya', '/legalitas/pajak.svg', 'Direktorat Jenderal Pajak', 'Pajak', 'Direktorat Jenderal Pajak', '[]'::jsonb, 5),
  ('egs-iso', 'environesia-global-saraya', 'ISO & Sistem Manajemen', '/legalitas/bsi.svg', 'British Standards Institution (BSI)', 'Sistem Manajemen Terintegrasi', 'British Standards Institution (BSI)', '[]'::jsonb, 6),
  ('egs-amdal', 'environesia-global-saraya', 'Akreditasi', '/legalitas/amdal.svg', 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)', 'AMDAL', 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)', '[]'::jsonb, 7),
  ('egs-iujp', 'environesia-global-saraya', 'Perizinan', '/legalitas/energy_sumber_daya.svg', 'Kementerian Energi dan Sumber Daya Mineral (ESDM)', 'Izin Usaha Jasa Pertambangan', 'IUJP', '[]'::jsonb, 8),
  ('egs-skup', 'environesia-global-saraya', 'Perizinan', '/legalitas/energy_sumber_daya.svg', 'Kementerian Energi dan Sumber Daya Mineral (ESDM)', 'Surat Penunjang Kemampuan Penunjang Migas', 'SKUP', '[]'::jsonb, 9),
  ('egs-bnsp', 'environesia-global-saraya', 'Sertifikasi', '/legalitas/bnsp.svg', 'Badan Nasional Sertifikasi Profesi (BNSP)', 'Tempat Uji Kompetensi', 'BNSP', '[]'::jsonb, 10),
  ('egs-kemnaker', 'environesia-global-saraya', 'Sertifikasi', '/legalitas/kemnaker.svg', 'Kementerian Ketenagakerjaan RI', 'Kompetensi & K3', 'Kementerian Ketenagakerjaan RI', '[]'::jsonb, 11),
  ('egs-lpjk', 'environesia-global-saraya', 'Sertifikasi', '/legalitas/lpjk.svg', 'Lembaga Pengembangan Jasa Konstruksi (LPJK)', 'LPJK', 'Lembaga Pengembangan Jasa Konstruksi', '[]'::jsonb, 12),
  ('egs-inkindo', 'environesia-global-saraya', 'Keanggotaan', '/legalitas/inkindo.svg', 'Ikatan Nasional Konsultan Indonesia (INKINDO)', 'INKINDO', 'Ikatan Nasional Konsultan Indonesia', '[]'::jsonb, 13),
  ('egs-oss', 'environesia-global-saraya', 'Perizinan', '/legalitas/bkpm.svg', 'Badan Koordinasi Penanaman Modal (BKPM)', 'OSS & Perizinan Berusaha', 'Badan Koordinasi Penanaman Modal', '[]'::jsonb, 14),
  ('egs-kadin', 'environesia-global-saraya', 'Keanggotaan', '/legalitas/kadin.svg', 'Kamar Dagang dan Industri Indonesia (KADIN)', 'KADIN', 'Kamar Dagang dan Industri Indonesia', '[]'::jsonb, 15),
  ('glb-legalitas-perusahaan', 'greenlab-indonesia', 'Akta & AHU', '/legalitas/garuda.svg', 'Garuda Pancasila', 'Legalitas Perusahaan', null, '[{"label": "Nama Perusahaan", "value": "PT Greenlab Indo Global"}, {"label": "Telp/Fax/HP", "value": "(0274) 454 000 ext.2 / 0822 8888 9602"}, {"label": "Website", "value": "www.greenlab.co.id"}, {"label": "Email", "value": "info@greenlab.co.id"}, {"label": "NPWP", "value": "0846 1004 10542000"}]'::jsonb, 1),
  ('glb-akreditasi-kan', 'greenlab-indonesia', 'Akreditasi', '/legalitas/kan.svg', 'Komite Akreditasi Nasional (KAN)', 'Akreditasi Laboratorium (KAN)', null, '[]'::jsonb, 2),
  ('glb-kemnaker-pjk3', 'greenlab-indonesia', 'Sertifikasi', '/legalitas/kemnaker.svg', 'Kementerian Ketenagakerjaan RI', 'Penunjukan Resmi oleh KEMNAKER sebagai PJK3 LKBB', null, '[]'::jsonb, 3),
  ('glb-klhk', 'greenlab-indonesia', 'Sertifikasi', '/legalitas/amdal.svg', 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)', 'Laboratorium Teregistrasi KLHK', null, '[]'::jsonb, 4),
  ('glb-bsi-iso', 'greenlab-indonesia', 'ISO & Sistem Manajemen', '/legalitas/bsi.svg', 'British Standards Institution (BSI)', 'Tersertifikasi Internasional BSI', null, '[]'::jsonb, 5)
on conflict (id) do nothing;

insert into public.legal_documents (id, card_id, title, issuer, fields, description, external_url, cta_label, sort_order) values
  ('egs-akta-doc-1', 'egs-akta', 'Akte Pendirian Perusahaan', null, '[{"label": "Nomor", "value": "1"}, {"label": "Tanggal", "value": "3 Mei 2016"}, {"label": "Notaris", "value": "Asnahwati H. Herwidhi, S.H"}]'::jsonb, null, null, null, 1),
  ('egs-akta-doc-2', 'egs-akta', 'Akta Perubahan Perusahaan', null, '[{"label": "Nomor", "value": "29"}, {"label": "Tanggal", "value": "26 Januari 2017"}, {"label": "Notaris", "value": "Asnahwati H. Herwidhi, S.H."}]'::jsonb, null, null, null, 2),
  ('egs-csms-pln-doc-1', 'egs-csms-pln', 'Contractor Safety Management System (CSMS)', null, '[{"label": "Kategori", "value": "RISIKO EKSTRIM"}, {"label": "Nomor", "value": "001092/DIST/CSMS/VIII/2022"}]'::jsonb, null, null, null, 1),
  ('egs-ahu-ki-doc-1', 'egs-ahu-ki', 'Kep. Menkumham Akta Perubahan Perusahaan', null, '[{"label": "Nomor", "value": "AHU-002382.AH.01.02.Tahun 2017"}]'::jsonb, null, null, null, 1),
  ('egs-ahu-ki-doc-2', 'egs-ahu-ki', 'Keputusan Menkumham Akta Pendirian Perusahaan', null, '[{"label": "Nomor", "value": "AHU-002382.AH.01.01.Tahun 2016"}]'::jsonb, null, null, null, 2),
  ('egs-ahu-ki-doc-3', 'egs-ahu-ki', 'Direktorat Jenderal Kekayaan Intelektual', null, '[{"label": "Nomor", "value": "IDM000846557"}]'::jsonb, null, null, null, 3),
  ('egs-csms-pjb-doc-1', 'egs-csms-pjb', 'Pembangkit Jawa Bali Contractor Safety Management System (CSMS)', null, '[{"label": "Kategori", "value": "HIGH RISK"}, {"label": "Nomor", "value": "B0002-C20200015-UBRS-CSMSPJB"}]'::jsonb, null, null, null, 1),
  ('egs-pajak-doc-1', 'egs-pajak', 'Nomor Pokok Wajib Pajak (NPWP)', null, '[{"label": "Nomor", "value": "76.103.263.0-543.000"}]'::jsonb, null, null, null, 1),
  ('egs-pajak-doc-2', 'egs-pajak', 'Surat Pengukuhan Pengusaha Kena Pajak', null, '[{"label": "Nomor", "value": "S-45PKP/WPJ.23/KP.0103/2022"}]'::jsonb, null, null, null, 2),
  ('egs-iso-doc-1', 'egs-iso', 'ISO 9001:2015', null, '[{"label": "Nomor", "value": "FS 692190"}]'::jsonb, 'Sistem Manajemen Mutu', null, null, 1),
  ('egs-iso-doc-2', 'egs-iso', 'ISO 14001:2015', null, '[{"label": "Nomor", "value": "EMS 714286"}]'::jsonb, 'Sistem Manajemen Lingkungan', null, null, 2),
  ('egs-iso-doc-3', 'egs-iso', 'ISO 45001:2018', null, '[{"label": "Nomor", "value": "OHS 714284"}]'::jsonb, 'Sistem Manajemen K3', null, null, 3),
  ('egs-amdal-doc-1', 'egs-amdal', 'Lembaga Penyedia Jasa Penyusun AMDAL (LPJP)', null, '[{"label": "Nomor Registrasi", "value": "0174/LPJ/AMDAL-1/LRK/KLHK"}, {"label": "Nomor Pengesahan", "value": "S-79 /BSI/PUSFASTER/SET.1/4/2022"}]'::jsonb, null, null, null, 1),
  ('egs-iujp-doc-1', 'egs-iujp', 'Izin Usaha Jasa Pertambangan (IUJP)', 'Badan Koordinasi Penanaman Modal', '[{"label": "Nomor", "value": "154/1/IUJP/PMDN/2018"}]'::jsonb, null, null, null, 1),
  ('egs-skup-doc-1', 'egs-skup', 'Surat Penunjang Kemampuan Penunjang Migas (SKUP)', null, '[{"label": "Nomor", "value": "2246/19.07/DBM/2018"}]'::jsonb, null, null, null, 1),
  ('egs-bnsp-doc-1', 'egs-bnsp', 'Pelatihan Tempat Uji Kompetensi', null, '[{"label": "Nomor", "value": "520/LSP/LSK-K3/VIII/2018"}]'::jsonb, null, null, null, 1),
  ('egs-kemnaker-doc-1', 'egs-kemnaker', 'Pelatihan Bidang Sistem Manajemen K3 dan Keahlian K3', null, '[{"label": "Nomor", "value": "299/BINWASK3-PNL3/XI/2018"}]'::jsonb, null, null, null, 1),
  ('egs-kemnaker-doc-2', 'egs-kemnaker', 'Pelatihan Bidang Kesehatan Kerja', null, '[{"label": "Nomor", "value": "KEP/423/BINWASK3-PNK3/KK/IV/2019"}]'::jsonb, null, null, null, 2),
  ('egs-kemnaker-doc-3', 'egs-kemnaker', 'Pelatihan Bidang Lingkungan Kerja dan Bahan Berbahaya', null, '[{"label": "Nomor", "value": "478/BINWASK3-PNL3/IV/2019"}]'::jsonb, null, null, null, 3),
  ('egs-lpjk-doc-1', 'egs-lpjk', 'Jasa Konsultansi Lainnya', null, '[{"label": "Nomor", "value": "4-3404-04-008-1-12-077252"}]'::jsonb, null, null, null, 1),
  ('egs-lpjk-doc-2', 'egs-lpjk', 'Jasa Perencanaan Tata Ruang', null, '[{"label": "Nomor", "value": "1-3404-03-008-1-12-077252"}]'::jsonb, null, null, null, 2),
  ('egs-lpjk-doc-3', 'egs-lpjk', 'Jasa Perencana Rekayasa', null, '[{"label": "Nomor", "value": "1-3404-02-008-1-12-077252"}]'::jsonb, null, null, null, 3),
  ('egs-lpjk-doc-4', 'egs-lpjk', 'Jasa Konsultan Spesialis', null, '[{"label": "Nomor", "value": "3-3404-05-008-1-12-077252"}]'::jsonb, null, null, null, 4),
  ('egs-inkindo-doc-1', 'egs-inkindo', 'Nomor Keanggotaan', null, '[{"label": "Nomor", "value": "16516/P/0236.DIY"}]'::jsonb, null, null, null, 1),
  ('egs-inkindo-doc-2', 'egs-inkindo', 'Jasa Konsultansi Manajemen', null, '[{"label": "Nomor", "value": "1.MS-34.04-22-1722"}]'::jsonb, null, null, null, 2),
  ('egs-inkindo-doc-3', 'egs-inkindo', 'Jasa Konsultansi Industri Pariwisata (MICE)', null, '[{"label": "Nomor", "value": "4.02-34.04-22-1722"}]'::jsonb, null, null, null, 3),
  ('egs-inkindo-doc-4', 'egs-inkindo', 'Jasa Khusus', null, '[{"label": "Nomor", "value": "1.SC-34.04-22-1722"}]'::jsonb, null, null, null, 4),
  ('egs-inkindo-doc-5', 'egs-inkindo', 'Jasa Studi Penelitian dan Bantuan Teknik', null, '[{"label": "Nomor", "value": "1.SI-34.04-22-1722"}]'::jsonb, null, null, null, 5),
  ('egs-inkindo-doc-6', 'egs-inkindo', 'Jasa Survey', null, '[{"label": "Nomor", "value": "1.SS-34.04-22-1722"}]'::jsonb, null, null, null, 6),
  ('egs-oss-doc-1', 'egs-oss', 'Lembaga Online Single Submission (OSS)', null, '[{"label": "Nomor Induk Berusaha", "value": "0220205221878"}]'::jsonb, 'Pelayanan Perizinan Berusaha Terintegrasi Secara Elektronik', null, null, 1),
  ('egs-oss-doc-2', 'egs-oss', 'Izin Lingkungan', null, '[{"label": "Nomor", "value": "660.3/146/2020"}]'::jsonb, null, null, null, 2),
  ('egs-oss-doc-3', 'egs-oss', 'Surat Izin Usaha Perdagangan', null, '[{"label": "Nomor", "value": "503/003490/PK/VIII/2017"}]'::jsonb, null, null, null, 3),
  ('egs-oss-doc-4', 'egs-oss', 'Izin Usaha Jasa Konstruksi', null, '[{"label": "Nomor", "value": "1-1204-1-00726-077252"}]'::jsonb, null, null, null, 4),
  ('egs-kadin-doc-1', 'egs-kadin', 'Nomor Keanggotaan', null, '[{"label": "Nomor", "value": "20403-16000020"}]'::jsonb, null, null, null, 1),
  ('egs-kadin-doc-2', 'egs-kadin', 'Jasa Studi, Penelitian dan Bantuan Teknik', null, '[{"label": "Nomor", "value": "I.SI.20403-17-1722"}]'::jsonb, null, null, null, 2),
  ('egs-kadin-doc-3', 'egs-kadin', 'Jasa Konsultansi Manajemen', null, '[{"label": "Nomor", "value": "I.MS.20403-17-1722"}]'::jsonb, null, null, null, 3),
  ('egs-kadin-doc-4', 'egs-kadin', 'Jasa Survey', null, '[{"label": "Nomor", "value": "I.SS-34.04-19-1722"}]'::jsonb, null, null, null, 4),
  ('glb-legalitas-perusahaan-doc-1', 'glb-legalitas-perusahaan', 'Akta Pendirian Perusahaan', null, '[{"label": "Notaris", "value": "Asnahwati H Herwidhi, S.H"}, {"label": "Nomor", "value": "42"}, {"label": "Tanggal", "value": "26 Maret 2018"}]'::jsonb, null, null, null, 1),
  ('glb-legalitas-perusahaan-doc-2', 'glb-legalitas-perusahaan', 'Akta Perubahan Perusahaan', null, '[{"label": "Notaris", "value": "Sri Peny Nugrohowati, S.H."}, {"label": "Nomor", "value": "22"}, {"label": "Tanggal", "value": "20 Oktober 2022"}]'::jsonb, null, null, null, 2),
  ('glb-akreditasi-kan-doc-1', 'glb-akreditasi-kan', 'Laboratorium Terakreditasi', 'Komite Akreditasi Nasional (KAN)', '[{"label": "Nomor", "value": "LP-1342-IDN"}]'::jsonb, 'Laboratorium Terakreditasi (LP-1342-IDN) ISO/IEC 17025:2017 "Persyaratan Umum Kompetensi Laboratorium Pengujian dan Laboratorium Kalibrasi" dari Komite Akreditasi Nasional (KAN).', null, 'Cek Sertifikat Akreditasi KAN', 1),
  ('glb-kemnaker-pjk3-doc-1', 'glb-kemnaker-pjk3', 'SKP PJK3 Bidang Riksa Uji Lingkungan Kerja dan Bahan Berbahaya', 'Kementerian Ketenagakerjaan Republik Indonesia', '[{"label": "Nomor", "value": "5/1069/AS.01.02/IX/2023"}]'::jsonb, null, null, null, 1),
  ('glb-klhk-doc-1', 'glb-klhk', 'Laboratorium Lingkungan Teregistrasi', null, '[{"label": "Nomor Registrasi", "value": "00149/LPJ/LABLING-1/LRK/KLHK"}]'::jsonb, 'Laboratorium Lingkungan Teregistrasi dari Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia berdasarkan Peraturan Menteri Lingkungan Hidup Nomor 6 Tahun 2009.', null, null, 1),
  ('glb-bsi-iso-doc-1', 'glb-bsi-iso', 'ISO 14001:2015', 'British Standards Institution', '[{"label": "Nomor", "value": "EMS 703934"}]'::jsonb, 'Environmental Management', null, null, 1),
  ('glb-bsi-iso-doc-2', 'glb-bsi-iso', 'ISO 9001:2015', 'British Standards Institution', '[{"label": "Nomor", "value": "FS 703935"}]'::jsonb, 'Quality Management', null, null, 2),
  ('glb-bsi-iso-doc-3', 'glb-bsi-iso', 'ISO 45001:2018', 'British Standards Institution', '[{"label": "Nomor", "value": "OHS 703933"}]'::jsonb, 'Occupational Health and Safety Management', 'https://www.bsigroup.com/en-GB/products-and-services/assessment-and-certification/validation-and-verification/client-directory-profile/PT_GRE-0047708467-000', 'Cek Sertifikat ISO BSI', 3)
on conflict (id) do nothing;

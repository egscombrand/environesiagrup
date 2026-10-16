-- Fills the Entity Explorer columns (0043) for the five known entities, from
-- the same copy that was hardcoded in
-- src/components/bisnis-layanan/ecosystem-exhibition.tsx (BRAND_CONTENT) and
-- entity-profile-data.ts (roleInGroup), now kept as the code fallback in
-- src/lib/cms/entity-explorer-content.ts. Each showcase image was already
-- copied to Storage by scripts/import-public-media.ts.
--
-- A missing website is also filled in from the same source — except
-- GreenLab's, which already has a real custom domain and is left untouched.
--
-- Safe to run more than once: every update sets the same values again.
-- Does not touch any entity not listed here, and does not insert new entities.

update public.entities set
  explorer_category = $q$Environmental Consulting & Sustainability$q$,
  explorer_description = $q$Environesia berfokus pada konsultansi dan pendampingan lingkungan untuk membantu organisasi memahami, mengelola, dan memenuhi kebutuhan lingkungan dalam pengembangan proyek dan kegiatan usaha.$q$,
  explorer_contribution = $q$Membantu organisasi memahami kebutuhan lingkungan, memenuhi kewajiban yang berlaku, dan mengelola aspek lingkungan dalam pengembangan kegiatan usaha.$q$,
  explorer_focus = ARRAY[$q$Consulting$q$, $q$Assessment$q$, $q$Compliance$q$, $q$Monitoring$q$]::text[],
  explorer_services = ARRAY[$q$Environmental Consulting$q$, $q$Environmental Assessment$q$, $q$Compliance$q$, $q$Monitoring$q$]::text[],
  explorer_role = $q$Environesia menjadi bagian yang berfokus pada konsultansi dan pendampingan lingkungan, menghubungkan kebutuhan proyek dengan kajian teknis, regulasi, dan praktik pengelolaan lingkungan.$q$,
  explorer_image_path = $q$legacy/environesiagrup/enviro.png$q$,
  website = case when website is null or website = '' then $q$environesia.co.id$q$ else website end
where slug = $q$environesia$q$;

update public.entities set
  explorer_category = $q$Environmental Laboratory & Testing$q$,
  explorer_description = $q$GreenLab berfokus pada pengujian dan analisis laboratorium untuk menghasilkan data yang mendukung kebutuhan teknis, regulasi, dan pengambilan keputusan.$q$,
  explorer_contribution = $q$Menyediakan data hasil pengujian dan analisis yang dapat mendukung kebutuhan teknis, regulasi, serta pengambilan keputusan.$q$,
  explorer_focus = ARRAY[$q$Laboratory$q$, $q$Testing$q$, $q$Analysis$q$]::text[],
  explorer_services = ARRAY[$q$Laboratory$q$, $q$Testing$q$, $q$Analysis$q$, $q$Environmental Testing$q$]::text[],
  explorer_role = $q$GreenLab berperan sebagai laboratorium pengujian dan analisis dalam ekosistem, menyediakan data teknis lingkungan dan K3 yang mendukung kepatuhan serta pengambilan keputusan proyek-proyek di dalam maupun di luar grup.$q$,
  explorer_image_path = $q$legacy/environesiagrup/greenlab.png$q$
where slug = $q$greenlab$q$;

update public.entities set
  explorer_category = $q$Training & Professional Development$q$,
  explorer_description = $q$GreenSkill berfokus pada pengembangan kompetensi melalui pembelajaran, pelatihan, dan pengembangan profesional yang relevan dengan kebutuhan lingkungan dan industri.$q$,
  explorer_contribution = $q$Membantu individu dan organisasi mengembangkan kompetensi yang relevan dengan kebutuhan lingkungan dan dunia kerja.$q$,
  explorer_focus = ARRAY[$q$Training$q$, $q$Learning$q$, $q$Development$q$]::text[],
  explorer_services = ARRAY[$q$Training$q$, $q$Learning$q$, $q$Development$q$, $q$Professional Development$q$]::text[],
  explorer_role = $q$GreenSkill berperan mengembangkan kompetensi dan kapasitas sumber daya manusia di bidang lingkungan, melalui pelatihan dan program pengembangan profesional yang mendukung kebutuhan tenaga kerja kompeten di dalam ekosistem.$q$,
  explorer_image_path = $q$legacy/environesiagrup/greenskill.png$q$,
  website = case when website is null or website = '' then $q$greenskill.id$q$ else website end
where slug = $q$greenskill$q$;

update public.entities set
  explorer_category = $q$Competency Certification$q$,
  explorer_description = $q$LSP Praktisi Lingkungan Indonesia berfokus pada sertifikasi kompetensi profesional di bidang lingkungan melalui proses asesmen dan skema sertifikasi yang relevan.$q$,
  explorer_contribution = $q$Mendukung pengakuan kompetensi profesional melalui proses asesmen dan sertifikasi yang relevan di bidang lingkungan.$q$,
  explorer_focus = ARRAY[$q$Competency$q$, $q$Assessment$q$, $q$Certification$q$]::text[],
  explorer_services = ARRAY[$q$Competency$q$, $q$Assessment$q$, $q$Certification$q$, $q$Professional Certification$q$]::text[],
  explorer_role = $q$LSP Praktisi Lingkungan Indonesia berperan memberikan pengakuan resmi atas kompetensi profesional lingkungan melalui proses asesmen dan sertifikasi, melengkapi pelatihan GreenSkill dengan standar kompetensi yang diakui secara nasional.$q$,
  explorer_image_path = $q$legacy/environesiagrup/lsp.png$q$,
  website = case when website is null or website = '' then $q$lsp-praktisilingkungan.id$q$ else website end
where slug = $q$lsp-praktisi-lingkungan$q$;

update public.entities set
  explorer_category = $q$Apparel & Professional Uniform$q$,
  explorer_description = $q$Bikin Indonesia Berdaya mendukung kebutuhan apparel, seragam, dan pakaian kerja untuk organisasi, perusahaan, dan aktivitas profesional.$q$,
  explorer_contribution = $q$Mendukung kebutuhan apparel dan pakaian kerja yang sesuai untuk kebutuhan organisasi, perusahaan, dan aktivitas profesional.$q$,
  explorer_focus = ARRAY[$q$Apparel$q$, $q$Uniform$q$, $q$Workwear$q$]::text[],
  explorer_services = ARRAY[$q$Apparel$q$, $q$Uniform$q$, $q$Workwear$q$, $q$Custom Apparel$q$]::text[],
  explorer_role = $q$Bikin Indonesia Berdaya berperan sebagai bagian pendukung kebutuhan organisasi dalam ekosistem, menyediakan apparel dan seragam kerja yang melengkapi operasional entitas lain maupun kebutuhan eksternal.$q$,
  explorer_image_path = $q$legacy/environesiagrup/kinco.png$q$,
  website = case when website is null or website = '' then $q$bikin.co$q$ else website end
where slug = $q$bikin-indonesia-berdaya$q$;

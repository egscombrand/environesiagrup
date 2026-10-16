-- Adds Bangsap ("Bangsap: Bangun Strategi & Perspektif") as the sixth entity
-- in the Kenali Perusahaan dalam Ekosistem Kami exhibition
-- (src/components/bisnis-layanan/ecosystem-exhibition.tsx), plus two new
-- generic social-link columns (youtube/tiktok) every entity can use, even
-- though only Bangsap has values for them today.
--
-- `lini = 'penunjang'`, matching Bikin Indonesia Berdaya (both are
-- supporting lines around the four core environmental-consulting entities,
-- which are all `lini = 'inti'`).
--
-- No `logo_path`: the only asset provided (bangsap.jpeg) is a full
-- illustrated scene, not a clean small logo mark like the other five
-- entities each have in `logos/entitas-*.png` — forcing it into the
-- header's small logo slot (h-6/h-7) would render as an illegible sliver.
-- It's used instead as `explorer_image_path` and as this entity's first
-- real Story scene (see the story_scenes insert below), both genuine,
-- visible uses of the real photo rather than a fabricated logo.
--
-- Safe to run more than once: the entities insert is a no-op on conflict,
-- and the story_scenes insert is guarded by a NOT EXISTS check.

alter table public.entities
  add column if not exists social_youtube text,
  add column if not exists social_tiktok text;

insert into public.entities (
  name, slug, lini, short_description, explorer_category, explorer_description,
  explorer_contribution, explorer_focus, explorer_services, explorer_role,
  explorer_image_path, social_youtube, social_tiktok, status, sort_order
) values (
  $q$Bangsap: Bangun Strategi & Perspektif$q$,
  $q$bangsap$q$,
  'penunjang',
  $q$Platform media dan edukasi lingkungan melalui konten, diskusi, dan podcast.$q$,
  $q$Media, Edukasi Lingkungan & Podcast$q$,
  $q$Bangsap adalah platform media dan edukasi lingkungan yang mengemas isu lingkungan dengan cara ringan, kritis, dan relevan. Melalui konten, diskusi, dan podcast, Bangsap menghubungkan fakta dan data agar isu lingkungan lebih mudah dipahami serta membuka perspektif baru bagi masyarakat.$q$,
  $q$Menghubungkan fakta dan data lingkungan dengan masyarakat melalui konten, diskusi, dan podcast yang ringan, kritis, dan relevan.$q$,
  ARRAY[$q$Media$q$, $q$Edukasi Lingkungan$q$, $q$Podcast$q$]::text[],
  ARRAY[$q$Konten Media$q$, $q$Edukasi Lingkungan$q$, $q$Podcast & Diskusi$q$]::text[],
  $q$Bangsap berperan sebagai kanal media dan edukasi dalam ekosistem, mengemas isu lingkungan melalui konten, diskusi, dan podcast agar lebih mudah dipahami masyarakat dan membuka perspektif baru di luar cara pandang teknis.$q$,
  $q$legacy/environesiagrup/bangsap.jpeg$q$,
  $q$https://www.youtube.com/@Bangsap.Podcast$q$,
  $q$https://www.tiktok.com/@abangsap_$q$,
  'published',
  6
)
on conflict (slug) do nothing;

insert into public.story_scenes (entity_id, image_path, sort_order, status)
select e.id, $q$legacy/environesiagrup/bangsap.jpeg$q$, 0, 'published'
from public.entities e
where e.slug = $q$bangsap$q$
  and not exists (
    select 1 from public.story_scenes s
    where s.entity_id = e.id and s.image_path = $q$legacy/environesiagrup/bangsap.jpeg$q$
  );

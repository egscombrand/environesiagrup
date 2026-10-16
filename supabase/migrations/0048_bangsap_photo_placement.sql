-- Corrects Bangsap's photo placement from 0047. bangsap.jpeg is the
-- brand's own foto utama/logo — it belongs in `logo_path` (the same field
-- every other entity's logo uses, rendered beside the brand name in the
-- Kenali Perusahaan exhibition's header), not doubling as a gallery photo
-- too.
--
-- The exhibition's "Galeri {name}" carousel (story_scenes) is a separate,
-- independently admin-managed field from logo_path — it should start
-- empty (shown as branded placeholders, per the exhibition's existing
-- "no fabricated photos" rule) until a real, distinct gallery photo is
-- added through this entity's Story editor in wp-admin, rather than
-- reusing the logo photo there.
--
-- Safe to run more than once.

update public.entities
set logo_path = $q$legacy/environesiagrup/bangsap.jpeg$q$
where slug = $q$bangsap$q$;

delete from public.story_scenes
where entity_id = (select id from public.entities where slug = $q$bangsap$q$)
  and image_path = $q$legacy/environesiagrup/bangsap.jpeg$q$;

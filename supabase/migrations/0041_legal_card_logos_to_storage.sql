-- Legalitas & Sertifikasi: the 20 legal_cards logos were seeded (0027) as raw
-- /public paths. The files are already in Storage (scripts/import-public-media.ts),
-- so this points each card at its Storage path instead.
--
-- src/lib/cms/legal.ts resolves a logo through publicMediaUrl only when it does
-- not start with "/", so a card is never broken while this has not run yet, and
-- never broken again afterwards.
--
-- Safe to run more than once: each statement only touches rows that still hold
-- the old /public path.

update public.legal_cards set logo = 'legacy/legalitas/garuda.svg' where logo = '/legalitas/garuda.svg';
update public.legal_cards set logo = 'legacy/legalitas/pln.svg' where logo = '/legalitas/pln.svg';
update public.legal_cards set logo = 'legacy/legalitas/pengayoman.svg' where logo = '/legalitas/pengayoman.svg';
update public.legal_cards set logo = 'legacy/legalitas/pjb.svg' where logo = '/legalitas/pjb.svg';
update public.legal_cards set logo = 'legacy/legalitas/pajak.svg' where logo = '/legalitas/pajak.svg';
update public.legal_cards set logo = 'legacy/legalitas/bsi.svg' where logo = '/legalitas/bsi.svg';
update public.legal_cards set logo = 'legacy/legalitas/amdal.svg' where logo = '/legalitas/amdal.svg';
update public.legal_cards set logo = 'legacy/legalitas/energy-sumber-daya.svg' where logo = '/legalitas/energy_sumber_daya.svg';
update public.legal_cards set logo = 'legacy/legalitas/bnsp.svg' where logo = '/legalitas/bnsp.svg';
update public.legal_cards set logo = 'legacy/legalitas/kemnaker.svg' where logo = '/legalitas/kemnaker.svg';
update public.legal_cards set logo = 'legacy/legalitas/lpjk.svg' where logo = '/legalitas/lpjk.svg';
update public.legal_cards set logo = 'legacy/legalitas/inkindo.svg' where logo = '/legalitas/inkindo.svg';
update public.legal_cards set logo = 'legacy/legalitas/bkpm.svg' where logo = '/legalitas/bkpm.svg';
update public.legal_cards set logo = 'legacy/legalitas/kadin.svg' where logo = '/legalitas/kadin.svg';
update public.legal_cards set logo = 'legacy/legalitas/kan.svg' where logo = '/legalitas/kan.svg';

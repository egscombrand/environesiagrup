import { getPublishedMilestones } from '@/lib/cms/milestones';
import { getPublishedEntities } from '@/lib/cms/entities';
import { getPublishedLeadership } from '@/lib/cms/leadership';
import { getSiteSettings } from '@/lib/cms/settings';
import { TentangKamiHero } from '@/components/tentang-kami/hero-banner';
import { MaknaLogoSection } from '@/components/tentang-kami/makna-logo-section';
import { TentangKamiTabsClient } from '@/components/tentang-kami/tabs-controller';
import { PerjalananKamiSection } from '@/components/tentang-kami/perjalanan-kami-section';
import { VisiMisiSection } from '@/components/tentang-kami/sections/visi-misi-section';
import { StrukturOrganisasiSection } from '@/components/tentang-kami/sections/struktur-organisasi-section';
import { DirekturSection } from '@/components/tentang-kami/sections/direktur-section';
import { PenghargaanSection } from '@/components/tentang-kami/sections/penghargaan-section';
import { LegalitasSection } from '@/components/tentang-kami/sections/legalitas-section';

/**
 * The one "Tentang Kami" experience — hero, Makna Logo, and the tab system
 * — rendered identically whichever URL got the visitor here: the hub
 * (`/tentang-kami`) or one specific tab's own route (`/tentang-kami/sejarah`,
 * `/tentang-kami/direktur`, …). Every tab route calls this with its own
 * slug as `initialTab` instead of rendering its section alone, so a direct
 * link, a bookmark, or a hard refresh always lands on the full parent page
 * with the right tab pre-selected — never a bare page missing the hero,
 * Makna Logo, or the nav around it. Switching tabs afterwards never
 * navigates again; it's the same client-side swap either way.
 */
export async function TentangKamiHubView({ locale, initialTab }: { locale: string; initialTab: string }) {
  const [milestones, entities, dewanDireksi, settings] = await Promise.all([
    getPublishedMilestones(),
    getPublishedEntities(),
    getPublishedLeadership('direksi'),
    getSiteSettings(),
  ]);

  const tabsContent = {
    sejarah: await PerjalananKamiSection({ locale, milestones }),
    'visi-misi-tatanilai': <VisiMisiSection locale={locale} />,
    'struktur-organisasi': await StrukturOrganisasiSection({ locale, entities }),
    direktur: await DirekturSection({ locale, dewanDireksi }),
    penghargaan: <PenghargaanSection locale={locale} />,
    legalitas: <LegalitasSection locale={locale} />,
  };

  return (
    <>
      {/* 01 — Hero: Tentang Environesia Group */}
      <TentangKamiHero locale={locale} />

      {/* 02 — Makna Logo, directly below the intro, not one of the tabs */}
      <MaknaLogoSection logoUrl={settings.logoUrl ?? '/brand/environesia-group.png'} logoAlt={settings.site_name} />

      {/* 03 — Single unified navigation rail + conditional tab content */}
      <TentangKamiTabsClient locale={locale} initialTab={initialTab} tabs={tabsContent} />
    </>
  );
}

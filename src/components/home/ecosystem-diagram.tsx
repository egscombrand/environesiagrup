import { getPublishedEntities } from '@/lib/cms/entities';
import { getSiteSettings } from '@/lib/cms/settings';
import { getPublishedStoryScenesByEntity } from '@/lib/cms/story-scenes';
import { getPublishedNavigationUrlsBySlug } from '@/lib/cms/navigation';
import { Section } from '@/components/layout/section';
import { messagesFor } from '@/i18n/messages';
import { EcosystemDiagramClient } from './ecosystem-diagram-client';

export async function EcosystemDiagram({ locale, title }: { locale: string; title?: string }) {
  const t = messagesFor(locale);
  const [entities, settings, companyUrlsBySlug] = await Promise.all([
    getPublishedEntities(),
    getSiteSettings(),
    getPublishedNavigationUrlsBySlug('header'),
  ]);

  if (entities.length === 0) {
    return null;
  }

  const scenesByEntity = await getPublishedStoryScenesByEntity(entities.map((entity) => entity.id));

  return (
    <Section className="bg-canvas">
      <EcosystemDiagramClient
        entities={entities}
        scenesByEntity={scenesByEntity}
        companyUrlsBySlug={companyUrlsBySlug}
        locale={locale}
        siteName={settings.site_name}
        logoUrl={settings.logoUrl}
        copy={{
          presentingLabel: settings.ecosystem_eyebrow || t.beranda.ekosistemEyebrow,
          openingHeading: title ?? t.beranda.ekosistemWelcomeHeading,
          openingStatement1: settings.ecosystem_opening_statement_1 || t.beranda.ekosistemOpeningStatement1,
          openingStatement2: settings.ecosystem_opening_statement_2 || t.beranda.ekosistemOpeningStatement2,
          continueLabel: settings.ecosystem_opening_cta_label || t.beranda.ekosistemOpeningCta,
          skipLabel: t.beranda.ekosistemSkipLabel,
          discoveryIntro1: settings.ecosystem_discovery_intro_1 || t.beranda.ekosistemDiscoveryIntro1,
          discoveryIntro2: settings.ecosystem_discovery_intro_2 || t.beranda.ekosistemDiscoveryIntro2,
          exploreLabelTemplate: t.beranda.ekosistemExploreLabel,
          profileLabelTemplate: t.beranda.ekosistemLihatProfil,
          backLabel: t.beranda.ekosistemBackToEcosystem,
          closeLabel: t.beranda.ekosistemCloseDetail,
          companyPreviousLabel: t.beranda.ekosistemPrevious,
          companyNextLabel: t.beranda.ekosistemNext,
          scenePreviousLabel: t.beranda.ekosistemScenePrevious,
          sceneNextLabel: t.beranda.ekosistemSceneNext,
          closingHeadingTemplate: settings.ecosystem_closing_heading || t.beranda.ekosistemClosingHeading,
          closingSubtext: settings.ecosystem_closing_subtext || t.beranda.ekosistemClosingSubtext,
          closingCtaLabel: settings.ecosystem_closing_cta_label || t.beranda.ekosistemClosingCta,
        }}
      />
    </Section>
  );
}

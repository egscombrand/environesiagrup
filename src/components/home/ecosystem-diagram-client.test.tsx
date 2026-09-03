import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, afterEach } from 'vitest';
import { EcosystemDiagramClient, type EcosystemDiscoveryCopy } from './ecosystem-diagram-client';
import { makeEntity } from '@/lib/cms/fixtures';
import type { StoryScene } from '@/lib/cms/story-scenes';

const copy: EcosystemDiscoveryCopy = {
  presentingLabel: 'Presenting',
  openingHeading: 'Discover Environesia Group',
  openingStatement1: 'Not from a single company.\nExpertise, not headcount.',
  openingStatement2: 'It comes together.\nOne ecosystem.',
  continueLabel: 'Continue',
  skipLabel: 'Skip',
  discoveryIntro1: 'Good. Let’s get started.',
  discoveryIntro2: 'Where would you like to begin?',
  exploreLabelTemplate: 'Meet {name}',
  profileLabelTemplate: 'View {name}’s Profile',
  backLabel: 'Return to Ecosystem',
  closeLabel: 'Close company detail',
  companyPreviousLabel: 'Previous Company',
  companyNextLabel: 'Next Company',
  scenePreviousLabel: 'Previous',
  sceneNextLabel: 'Next',
  closingHeadingTemplate: '{count} Companies.\nDifferent Expertise.\nOne Ecosystem.',
  closingSubtext: 'Discover how each part contributes.',
  closingCtaLabel: 'Explore Again',
};

const revealLines = [...copy.openingStatement1.split('\n'), ...copy.openingStatement2.split('\n')];

function makeScene(overrides: Partial<StoryScene> & { entity_id: string }): StoryScene {
  return {
    id: `scene-${Math.random().toString(36).slice(2)}`,
    sort_order: 0,
    headline: null,
    description: null,
    image_path: null,
    imageUrl: undefined,
    cta_label: null,
    cta_url: null,
    status: 'published',
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

const entities = [
  makeEntity({
    id: 'e1',
    name: 'Environesia',
    slug: 'environesia',
    tagline: 'Environmental consulting',
    short_description: 'Konsultasi lingkungan.',
    sort_order: 1,
  }),
  makeEntity({
    id: 'e2',
    name: 'GreenLab',
    slug: 'greenlab',
    tagline: 'Testing and sampling',
    short_description: 'Pengujian dan sampling.',
    sort_order: 2,
  }),
  makeEntity({
    id: 'e3',
    name: 'GreenSkill',
    slug: 'greenskill',
    tagline: null,
    short_description: 'Pelatihan.',
    sort_order: 3,
  }),
];

// Mirrors what getPublishedNavigationUrlsBySlug() would build from
// published navigation items whose own Slug field an admin has set to an
// entity's slug — deliberately keyed by `slug`, not `id` or `name`, since
// that's the only identifier the real lookup uses.
const companyUrlsBySlug: Record<string, string> = {
  environesia: '/bisnis-layanan/environesia',
  greenlab: '/bisnis-layanan/greenlab',
  greenskill: '/bisnis-layanan/greenskill',
};

const scenesByEntity: Record<string, StoryScene[]> = {
  e1: [
    makeScene({ entity_id: 'e1', sort_order: 0, headline: 'Scene One', description: 'Environesia scene one text.' }),
    makeScene({ entity_id: 'e1', sort_order: 1, headline: 'Scene Two', description: 'Environesia scene two text.' }),
  ],
  e2: [makeScene({ entity_id: 'e2', sort_order: 0, headline: 'GreenLab Scene', description: 'GreenLab scene text.' })],
  // e3 deliberately has no scenes — exercises the empty-scenes fallback.
};

function mockReducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

let restore: (() => void) | undefined;
afterEach(() => {
  restore?.();
  restore = undefined;
});

// A tiny real duration for the auto-advancing reveal/company-intro phases —
// not a faked clock (framer-motion's own RAF-driven scheduling stays on
// real time regardless, so faking `setTimeout` globally risks a mismatch;
// a short real wait sidesteps that entirely). The precise pacing and
// per-step behavior of those phases are covered by their own dedicated
// test files; this integration suite only needs them to resolve fast.
const FAST_STEP_MS = 20;

function renderClient(entityList = entities, scenes = scenesByEntity, urlsBySlug = companyUrlsBySlug) {
  return render(
    <EcosystemDiagramClient
      entities={entityList}
      scenesByEntity={scenes}
      companyUrlsBySlug={urlsBySlug}
      locale="id"
      siteName="Environesia Company Group"
      copy={copy}
      stepDurationMs={FAST_STEP_MS}
    />
  );
}

// For the Skip-button wiring tests specifically: a duration long enough
// that the click reliably beats the auto-advance timer (Skip's own
// behavior — that it fires immediately regardless of the timer — is
// verified precisely in ecosystem-progressive-reveal.test.tsx and
// ecosystem-company-intro.test.tsx).
function renderClientSlow(entityList = entities, scenes = scenesByEntity) {
  return render(
    <EcosystemDiagramClient
      entities={entityList}
      scenesByEntity={scenes}
      companyUrlsBySlug={companyUrlsBySlug}
      locale="id"
      siteName="Environesia Company Group"
      copy={copy}
      stepDurationMs={60_000}
    />
  );
}

// A moderate (not instant, not minutes-long) duration: fast enough to let a
// test actually walk the reveal's four beats to reach the company
// introduction, slow enough that a click fired the instant it lands there
// reliably beats that phase's own freshly-started auto-advance timer.
function renderClientModerate(entityList = entities, scenes = scenesByEntity) {
  return render(
    <EcosystemDiagramClient
      entities={entityList}
      scenesByEntity={scenes}
      companyUrlsBySlug={companyUrlsBySlug}
      locale="id"
      siteName="Environesia Company Group"
      copy={copy}
      stepDurationMs={200}
    />
  );
}

// AnimatePresence's exiting panels can linger in the DOM under jsdom (no
// real animation-completion signal) — but not always deterministically, so
// this only waits when there's actually something present to wait out
// (`waitForElementToBeRemoved` throws if given an already-absent element).
async function waitForRemovalIfPresent(getElement: () => HTMLElement | null) {
  if (getElement()) {
    await waitForElementToBeRemoved(getElement);
  }
}

// The overture's one click, then simply letting the (test-speed) reveal and
// company introduction run their own course into the full composition —
// with `FAST_STEP_MS`, that's quick and avoids racing a Skip click against
// the auto-advance timer. Skip's own behavior gets its own dedicated tests
// (with a deliberately long duration, so the click reliably wins) below and
// in ecosystem-progressive-reveal.test.tsx / ecosystem-company-intro.test.tsx.
async function openEcosystem(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: copy.continueLabel }));
  await screen.findByText(copy.discoveryIntro1, {}, { timeout: 3000 });
}

async function openEnvironesiaStory(user: ReturnType<typeof userEvent.setup>) {
  await openEcosystem(user);
  await user.click(screen.getByRole('button', { name: /^Environesia/ }));
}

describe('EcosystemDiagramClient — brand overture', () => {
  it('shows the mark, presenting label, and heading together — nothing gated behind an extra click', () => {
    renderClient();

    expect(screen.getByText('Environesia Company Group')).toBeInTheDocument();
    expect(screen.getByText(copy.presentingLabel)).toBeInTheDocument();
    expect(screen.getByText(copy.openingHeading)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^GreenLab/ })).not.toBeInTheDocument();
  });

  it('a single click moves straight into the automatic reveal — the first statement, not a second overture step', async () => {
    const user = userEvent.setup();
    renderClient();

    await user.click(screen.getByRole('button', { name: copy.continueLabel }));

    expect(screen.getByText(revealLines[0])).toBeInTheDocument();
    expect(screen.getByText(`01 / ${String(revealLines.length).padStart(2, '0')}`)).toBeInTheDocument();
  });

  it('is keyboard-operable (Enter, no pointer)', async () => {
    const user = userEvent.setup();
    renderClient();

    screen.getByRole('button', { name: copy.continueLabel }).focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText(revealLines[0])).toBeInTheDocument();
  });
});

describe('EcosystemDiagramClient — progressive reveal', () => {
  // The reveal and company-introduction components' own auto-advance
  // behavior (per-line/per-company, in order, with no click) is covered in
  // full by their dedicated test files (ecosystem-progressive-reveal.test.tsx,
  // ecosystem-company-intro.test.tsx). This integration suite only needs to
  // confirm the *wiring* between phases is correct, using the fast
  // `stepDurationMs` from `renderClient` so it doesn't wait out real pacing.
  it('left to run on its own, the reveal finishes into the company introduction', async () => {
    const user = userEvent.setup();
    renderClient();
    await user.click(screen.getByRole('button', { name: copy.continueLabel }));

    expect(await screen.findByText('01 / 03')).toBeInTheDocument();
    expect(screen.getByText('Environesia')).toBeInTheDocument();
  });

  it('Skip jumps straight from the reveal to the full composition', async () => {
    const user = userEvent.setup();
    renderClientSlow();
    await user.click(screen.getByRole('button', { name: copy.continueLabel }));

    await user.click(screen.getByRole('button', { name: new RegExp(copy.skipLabel) }));
    await waitForRemovalIfPresent(() => screen.queryByText(revealLines[0]));

    expect(screen.getByText(copy.discoveryIntro1)).toBeInTheDocument();
    for (const entity of entities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
  });
});

describe('EcosystemDiagramClient — company introduction', () => {
  // Skip escapes the *current* auto-phase straight to the full composition
  // — it never stops at the company introduction. Reaching it for real
  // requires the (fast, test-speed) reveal to actually finish.
  async function reachCompanyIntro(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: copy.continueLabel }));
    await screen.findByText('01 / 03', {}, { timeout: 3000 });
    // The reveal panel's own exit animation can still be mid-fade in the
    // DOM at this point, which would make a same-labelled Skip button
    // ambiguous — wait for it to actually be gone.
    await waitForRemovalIfPresent(() => screen.queryByText(revealLines[revealLines.length - 1]));
  }

  it('introduces one company at a time with real content and a progress indicator', async () => {
    const user = userEvent.setup();
    renderClientModerate();
    await reachCompanyIntro(user);

    expect(screen.getByText('Environesia')).toBeInTheDocument();
    expect(screen.getByText('Konsultasi lingkungan.')).toBeInTheDocument();
    expect(screen.queryByText(copy.discoveryIntro1)).not.toBeInTheDocument();
  });

  it('left to run on its own, the company introduction finishes into the full composition', async () => {
    const user = userEvent.setup();
    renderClient();
    await reachCompanyIntro(user);

    await screen.findByText(copy.discoveryIntro1, {}, { timeout: 3000 });
    for (const entity of entities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
  });

  it('Skip jumps straight from the company introduction to the full composition', async () => {
    const user = userEvent.setup();
    renderClientModerate();
    await reachCompanyIntro(user);

    await user.click(screen.getByRole('button', { name: new RegExp(copy.skipLabel) }));

    expect(await screen.findByText(copy.discoveryIntro1)).toBeInTheDocument();
    for (const entity of entities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
  });
});

describe('EcosystemDiagramClient — ecosystem composition', () => {
  it('adapts to a 2-entity and a 9-entity set without throwing', async () => {
    const two = entities.slice(0, 2);
    const nine = Array.from({ length: 9 }, (_, i) => makeEntity({ id: `n${i}`, name: `Entity ${i}`, sort_order: i }));

    const { unmount } = renderClient(two, {});
    unmount();

    const user = userEvent.setup();
    renderClient(nine, {});
    await openEcosystem(user);
    for (const entity of nine) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
  });

  it('renders every active company in one sequence — no first-N slicing, no pagination', async () => {
    const many = Array.from({ length: 15 }, (_, i) =>
      makeEntity({ id: `m${i}`, name: `Company ${String.fromCharCode(65 + i)}`, sort_order: i })
    );
    const user = userEvent.setup();
    renderClient(many, {});

    await openEcosystem(user);

    for (const entity of many) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeInTheDocument();
    }
    expect(screen.queryByRole('button', { name: /more|load|show all/i })).not.toBeInTheDocument();
  });

  it('shows the closing statement with the real, dynamically-spelled company count', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);

    expect(screen.getByText('Tiga Companies.')).toBeInTheDocument();
    expect(screen.getByText('Different Expertise.')).toBeInTheDocument();
    expect(screen.getByText('One Ecosystem.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(copy.closingCtaLabel) })).toBeInTheDocument();
  });

  it('a company selected and closed, then a different company selected, both open cleanly with independent state (rotation-leak regression)', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);

    await user.click(screen.getByRole('button', { name: /^Environesia/ }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: copy.closeLabel }));
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));

    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));
    expect(within(await screen.findByRole('dialog')).getByRole('heading', { name: 'GreenLab' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: copy.closeLabel }));
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));

    for (const entity of entities) {
      expect(screen.getByRole('button', { name: new RegExp(entity.name) })).toBeEnabled();
    }
  });
});

describe('EcosystemDiagramClient — company story', () => {
  it('opens with the first scene, real name/positioning, and a company index', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEnvironesiaStory(user);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Environesia' })).toBeInTheDocument();
    expect(within(dialog).getByText('Environmental consulting')).toBeInTheDocument();
    expect(within(dialog).getByText('Scene One')).toBeInTheDocument();
    expect(within(dialog).getByText('Environesia scene one text.')).toBeInTheDocument();
    expect(within(dialog).getByText('01 / 03')).toBeInTheDocument();
  });

  it('scene Next/Previous move within the story, bounded at both ends (no wraparound)', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEnvironesiaStory(user);

    expect(screen.getByRole('button', { name: /^← Previous$/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /^Next →$/ }));
    expect(await screen.findByText('Scene Two')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Next →$/ })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /^← Previous$/ }));
    expect(await screen.findByText('Scene One')).toBeInTheDocument();
  });

  it('a single-scene company shows no scene navigation', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));

    expect(await screen.findByText('GreenLab Scene')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Next →$/ })).not.toBeInTheDocument();
  });

  it('a company with no authored scenes falls back to its short_description as one implicit scene', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^GreenSkill/ }));

    // "Pelatihan." also appears on GreenSkill's own (inert, but still
    // mounted) composition node — scope the query to the dialog to disambiguate.
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Pelatihan.')).toBeInTheDocument();
  });

  it('company Previous/Next switch companies and reset to the first scene', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEnvironesiaStory(user);

    await user.click(screen.getByRole('button', { name: /^Next →$/ }));
    expect(await screen.findByText('Scene Two')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: new RegExp(copy.companyNextLabel) }));
    expect(await screen.findByRole('heading', { name: 'GreenLab' })).toBeInTheDocument();
    expect(screen.getByText('GreenLab Scene')).toBeInTheDocument();
  });

  it('closes via the × control and returns focus to the triggering node', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);

    const trigger = screen.getByRole('button', { name: /^GreenLab/ });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: copy.closeLabel }));

    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));
    expect(trigger).toHaveFocus();
  });

  it('closes via "Return to Ecosystem", Escape, and clicking the scrim', async () => {
    const user = userEvent.setup();
    renderClient();

    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));
    await user.click(screen.getByRole('button', { name: new RegExp(copy.backLabel) }));
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));

    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));
    await user.keyboard('{Escape}');
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));

    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));
    const scrim = (await screen.findByRole('dialog')).parentElement!;
    await user.click(scrim);
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));
  });

  it('the real CTA to the entity page and, when a scene has one, its own CTA both render', async () => {
    const withCta: Record<string, StoryScene[]> = {
      e1: [
        makeScene({
          entity_id: 'e1',
          headline: 'Scene With CTA',
          cta_label: 'See the lab',
          cta_url: '/id/entitas/environesia/lab',
        }),
      ],
    };
    const user = userEvent.setup();
    renderClient(entities, withCta);
    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^Environesia/ }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /View Environesia’s Profile/ })).toHaveAttribute(
      'href',
      '/id/bisnis-layanan/environesia'
    );
    expect(within(dialog).getByRole('link', { name: /See the lab/ })).toHaveAttribute(
      'href',
      '/id/entitas/environesia/lab'
    );
  });

  it('does not show company Previous/Next for a single-company set', async () => {
    const user = userEvent.setup();
    renderClient([entities[0]], scenesByEntity);
    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^Environesia/ }));

    await screen.findByRole('dialog');
    expect(screen.queryByRole('button', { name: new RegExp(copy.companyNextLabel) })).not.toBeInTheDocument();
  });

  it('the profile CTA is dynamic per company, not hardcoded to one page', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEcosystem(user);

    await user.click(screen.getByRole('button', { name: /^Environesia/ }));
    let dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /Profile/ })).toHaveAttribute(
      'href',
      '/id/bisnis-layanan/environesia'
    );
    await user.click(screen.getByRole('button', { name: copy.closeLabel }));
    await waitForRemovalIfPresent(() => screen.queryByRole('dialog'));

    await user.click(screen.getByRole('button', { name: /^GreenLab/ }));
    dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /Profile/ })).toHaveAttribute(
      'href',
      '/id/bisnis-layanan/greenlab'
    );
  });

  it('resolves the URL by entity slug from the navigation map — even when that URL text looks nothing like the slug', async () => {
    // A real case: the entity's own slug is `lsp-praktisi-lingkungan`, but
    // the navigation item an admin linked to it (by setting that item's own
    // Slug field to `lsp-praktisi-lingkungan`) has a URL that reads nothing
    // like it. Nothing in the component computes this — it's purely a
    // lookup by entity.slug into whatever the map says.
    const lsp = makeEntity({
      id: 'e-lsp',
      name: 'LSP Praktisi Lingkungan Indonesia',
      slug: 'lsp-praktisi-lingkungan',
    });
    const user = userEvent.setup();
    renderClient([...entities, lsp], scenesByEntity, {
      ...companyUrlsBySlug,
      'lsp-praktisi-lingkungan': '/bisnis-layanan/lsp-pli',
    });
    await openEcosystem(user);

    await user.click(screen.getByRole('button', { name: /^LSP Praktisi Lingkungan Indonesia/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /Profile/ })).toHaveAttribute(
      'href',
      '/id/bisnis-layanan/lsp-pli'
    );
  });

  it('shows no profile CTA (never a broken link) when no navigation item links to this entity', async () => {
    const unlinked = makeEntity({ id: 'e-unlinked', name: 'Unlinked Co', slug: 'unlinked-co' });
    const user = userEvent.setup();
    renderClient([...entities, unlinked], scenesByEntity, companyUrlsBySlug);
    await openEcosystem(user);

    await user.click(screen.getByRole('button', { name: /^Unlinked Co/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).queryByRole('link', { name: /Profile/ })).not.toBeInTheDocument();
    // The rest of the story still works normally — closing and returning
    // to the ecosystem is unaffected by the missing CTA.
    expect(within(dialog).getByRole('button', { name: new RegExp(copy.backLabel) })).toBeInTheDocument();
  });
});

describe('EcosystemDiagramClient — accessibility', () => {
  it('the composition is inert while the story overlay is open', async () => {
    const user = userEvent.setup();
    renderClient();
    await openEnvironesiaStory(user);

    const compositionNode = screen.getByRole('dialog').ownerDocument.querySelector('[inert] button');
    expect(compositionNode).not.toBeNull();
  });

  it('the whole flow stays fully functional under prefers-reduced-motion', async () => {
    restore = mockReducedMotion();
    const user = userEvent.setup();
    renderClient();

    await openEcosystem(user);
    await user.click(screen.getByRole('button', { name: /^Environesia/ }));

    expect(within(await screen.findByRole('dialog')).getByText('Scene One')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EcosystemCompanyIntro } from './ecosystem-company-intro';
import { makeEntity } from '@/lib/cms/fixtures';

const entities = [
  makeEntity({ id: 'e1', name: 'Environesia', tagline: 'Environmental consulting', short_description: 'Konsultasi lingkungan.' }),
  makeEntity({ id: 'e2', name: 'GreenLab', tagline: 'Testing and sampling', short_description: 'Pengujian dan sampling.' }),
  makeEntity({ id: 'e3', name: 'GreenSkill', tagline: null, short_description: 'Pelatihan.' }),
];

// A tiny real duration, not a faked clock — see the note in
// ecosystem-progressive-reveal.test.tsx for why fake timers are avoided here.
const FAST_MS = 20;

describe('EcosystemCompanyIntro', () => {
  it('shows the first company — visual, name, tagline, description — and a 01/0N indicator on mount', () => {
    render(
      <EcosystemCompanyIntro entities={entities} skipLabel="Skip" onComplete={() => {}} onSkip={() => {}} stepDurationMs={FAST_MS} />
    );

    expect(screen.getByText('01 / 03')).toBeInTheDocument();
    expect(screen.getByText('Environesia')).toBeInTheDocument();
    expect(screen.getByText('Environmental consulting')).toBeInTheDocument();
    expect(screen.getByText('Konsultasi lingkungan.')).toBeInTheDocument();
  });

  it('auto-advances through every company on its own, in order, then calls onComplete', async () => {
    const onComplete = vi.fn();
    render(
      <EcosystemCompanyIntro entities={entities} skipLabel="Skip" onComplete={onComplete} onSkip={() => {}} stepDurationMs={FAST_MS} />
    );

    for (const entity of entities.slice(1)) {
      expect(await screen.findByText(entity.name)).toBeInTheDocument();
      expect(screen.getByText(`0${entities.indexOf(entity) + 1} / 03`)).toBeInTheDocument();
    }
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  });

  it('clicking Skip calls onSkip immediately, without waiting for the timer', async () => {
    const onSkip = vi.fn();
    const user = userEvent.setup();
    render(
      <EcosystemCompanyIntro entities={entities} skipLabel="Skip" onComplete={() => {}} onSkip={onSkip} stepDurationMs={60_000} />
    );

    await user.click(screen.getByRole('button', { name: /Skip/ }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('a single-company set still calls onComplete once its one beat finishes', async () => {
    const onComplete = vi.fn();
    render(
      <EcosystemCompanyIntro
        entities={[entities[0]]}
        skipLabel="Skip"
        onComplete={onComplete}
        onSkip={() => {}}
        stepDurationMs={FAST_MS}
      />
    );

    expect(screen.getByText('01 / 01')).toBeInTheDocument();
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  });
});

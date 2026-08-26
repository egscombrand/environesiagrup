import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EntityCard } from './entity-card';
import { makeEntity } from '@/lib/cms/fixtures';

const entity = makeEntity({
  name: 'GreenLab',
  slug: 'greenlab',
  short_description: 'Laboratorium & sampling.',
});

describe('EntityCard', () => {
  it('renders the entity name and description', () => {
    render(<EntityCard entity={entity} locale="id" />);
    expect(screen.getByText('GreenLab')).toBeInTheDocument();
    expect(screen.getByText('Laboratorium & sampling.')).toBeInTheDocument();
  });

  it('links to the locale-prefixed detail page', () => {
    render(<EntityCard entity={entity} locale="en" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/entitas/greenlab');
  });

  it('exposes only the entity name as the accessible name, not the concatenated card text', () => {
    render(<EntityCard entity={entity} locale="id" />);
    expect(screen.getByRole('link', { name: 'GreenLab' })).toBeInTheDocument();
  });
});

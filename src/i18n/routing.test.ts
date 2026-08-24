import { describe, expect, it } from 'vitest';
import { routing } from './routing';

describe('routing', () => {
  it('defines id and en locales with id as default', () => {
    expect(routing.locales).toEqual(['id', 'en']);
    expect(routing.defaultLocale).toBe('id');
  });
});

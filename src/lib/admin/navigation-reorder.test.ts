import { describe, expect, it } from 'vitest';
import { validateReorderScope } from './navigation-reorder';

describe('validateReorderScope', () => {
  it('accepts the same ids in a different order', () => {
    expect(validateReorderScope(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true);
  });

  it('rejects a list missing an existing id', () => {
    expect(validateReorderScope(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
  });

  it('rejects a list containing a foreign id', () => {
    expect(validateReorderScope(['a', 'b'], ['a', 'b', 'z'])).toBe(false);
  });

  it('rejects a list with a duplicate id', () => {
    expect(validateReorderScope(['a', 'b'], ['a', 'a'])).toBe(false);
  });

  it('accepts two empty lists', () => {
    expect(validateReorderScope([], [])).toBe(true);
  });
});

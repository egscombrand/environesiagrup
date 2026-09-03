import { describe, expect, it } from 'vitest';
import { getEntity, nextEntity, previousEntity, spellCount } from './ecosystem-discovery';
import { makeEntity } from './cms/fixtures';

const entities = [
  makeEntity({ id: 'e1', name: 'Environesia', sort_order: 1 }),
  makeEntity({ id: 'e2', name: 'GreenLab', sort_order: 2 }),
  makeEntity({ id: 'e3', name: 'GreenSkill', sort_order: 3 }),
];

describe('nextEntity', () => {
  it('returns the following entity', () => {
    expect(nextEntity(entities, 'e1').id).toBe('e2');
    expect(nextEntity(entities, 'e2').id).toBe('e3');
  });

  it('wraps from the last entity back to the first', () => {
    expect(nextEntity(entities, 'e3').id).toBe('e1');
  });

  it('falls back to the first entity for a stale/unknown id', () => {
    expect(nextEntity(entities, 'missing').id).toBe('e1');
  });

  it('is adaptive to 2 through 12 entities', () => {
    for (let count = 2; count <= 12; count += 1) {
      const many = Array.from({ length: count }, (_, i) => makeEntity({ id: `x${i}`, sort_order: i }));
      expect(nextEntity(many, `x${count - 1}`).id).toBe('x0');
    }
  });
});

describe('previousEntity', () => {
  it('returns the preceding entity', () => {
    expect(previousEntity(entities, 'e3').id).toBe('e2');
    expect(previousEntity(entities, 'e2').id).toBe('e1');
  });

  it('wraps from the first entity back to the last', () => {
    expect(previousEntity(entities, 'e1').id).toBe('e3');
  });

  it('falls back to the first entity for a stale/unknown id', () => {
    expect(previousEntity(entities, 'missing').id).toBe('e1');
  });
});

describe('getEntity', () => {
  it('finds an entity by id', () => {
    expect(getEntity(entities, 'e2')?.name).toBe('GreenLab');
  });

  it('returns undefined for an unknown id, never throws', () => {
    expect(getEntity(entities, 'missing')).toBeUndefined();
  });
});

describe('spellCount', () => {
  it('spells out small counts per locale', () => {
    expect(spellCount(5, 'id')).toBe('Lima');
    expect(spellCount(5, 'en')).toBe('Five');
    expect(spellCount(5, 'zh')).toBe('五');
  });

  it('falls back to the numeral beyond ten', () => {
    expect(spellCount(11, 'id')).toBe('11');
  });

  it('falls back to English for an unknown locale', () => {
    expect(spellCount(3, 'fr')).toBe('Three');
  });
});

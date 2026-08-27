import { describe, expect, it } from 'vitest';
import { navigationLabel } from './navigation';

const node = {
  label: 'Entitas',
  label_en: 'Entities',
  label_zh: '旗下企业',
} as Parameters<typeof navigationLabel>[0];

describe('navigationLabel', () => {
  it('returns the label for the requested locale', () => {
    expect(navigationLabel(node, 'id')).toBe('Entitas');
    expect(navigationLabel(node, 'en')).toBe('Entities');
    expect(navigationLabel(node, 'zh')).toBe('旗下企业');
  });

  it('falls back to Indonesian when a translation is missing', () => {
    const untranslated = { label: 'Karier', label_en: null, label_zh: null } as typeof node;
    expect(navigationLabel(untranslated, 'zh')).toBe('Karier');
  });

  it('falls back to Indonesian for an unknown locale', () => {
    expect(navigationLabel(node, 'pt')).toBe('Entitas');
  });
});

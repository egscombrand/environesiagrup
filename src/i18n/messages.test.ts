import { describe, expect, it } from 'vitest';
import { messagesFor, LOCALE_MESSAGES } from './messages';

function flatKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? flatKeys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

describe('messages', () => {
  it('gives every locale exactly the same key set', () => {
    const [id, en, zh] = [LOCALE_MESSAGES.id, LOCALE_MESSAGES.en, LOCALE_MESSAGES.zh].map((m) =>
      flatKeys(m).sort()
    );
    expect(en).toEqual(id);
    expect(zh).toEqual(id);
  });

  it('leaves no value empty in any locale', () => {
    for (const [locale, messages] of Object.entries(LOCALE_MESSAGES)) {
      const empty = flatKeys(messages).filter((key) => {
        const value = key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], messages);
        return typeof value !== 'string' || value.trim() === '';
      });
      expect({ locale, empty }).toEqual({ locale, empty: [] });
    }
  });

  it('resolves a known locale and falls back to Indonesian for anything else', () => {
    expect(messagesFor('zh').nav.menu).toBe(LOCALE_MESSAGES.zh.nav.menu);
    expect(messagesFor('pt').nav.menu).toBe(LOCALE_MESSAGES.id.nav.menu);
  });
});

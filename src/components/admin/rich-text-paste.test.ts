import { describe, expect, it } from 'vitest';
import { detectPlainTextList, plainTextListToHtml } from './rich-text-paste';

describe('detectPlainTextList', () => {
  it('recognizes a numbered list ("1. ", "2) ", …) pasted as plain text', () => {
    const detected = detectPlainTextList('1. Persyaratan pertama\n2. Persyaratan kedua\n3. Persyaratan ketiga');
    expect(detected).toEqual({
      tag: 'ol',
      items: ['Persyaratan pertama', 'Persyaratan kedua', 'Persyaratan ketiga'],
    });
  });

  it('recognizes a bullet list ("-", "*", "•") pasted as plain text', () => {
    const detected = detectPlainTextList('• Persyaratan pertama\n• Persyaratan kedua\n• Persyaratan ketiga');
    expect(detected).toEqual({
      tag: 'ul',
      items: ['Persyaratan pertama', 'Persyaratan kedua', 'Persyaratan ketiga'],
    });
  });

  it('accepts "2)" style numbering as well as "2."', () => {
    const detected = detectPlainTextList('1) Pertama\n2) Kedua');
    expect(detected?.tag).toBe('ol');
  });

  it('ignores blank lines between list items', () => {
    const detected = detectPlainTextList('- Satu\n\n- Dua\n\n- Tiga');
    expect(detected?.items).toEqual(['Satu', 'Dua', 'Tiga']);
  });

  it('never flags a single line, even if it looks like a list item — not confident enough on its own', () => {
    expect(detectPlainTextList('1. Satu-satunya baris')).toBeNull();
  });

  it('never flags ordinary prose that is not a list', () => {
    expect(detectPlainTextList('Ini kalimat biasa.\nIni kalimat kedua, bukan daftar.')).toBeNull();
  });

  it('never flags mixed/inconsistent lines (not all bullet, not all numbered)', () => {
    expect(detectPlainTextList('- Satu\n2. Dua')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(detectPlainTextList('')).toBeNull();
  });
});

describe('plainTextListToHtml', () => {
  it('builds real <ol><li> markup', () => {
    expect(plainTextListToHtml({ tag: 'ol', items: ['Satu', 'Dua'] })).toBe('<ol><li>Satu</li><li>Dua</li></ol>');
  });

  it('builds real <ul><li> markup', () => {
    expect(plainTextListToHtml({ tag: 'ul', items: ['Satu'] })).toBe('<ul><li>Satu</li></ul>');
  });

  it('escapes HTML-significant characters in the item text', () => {
    expect(plainTextListToHtml({ tag: 'ul', items: ['A < B & C > D'] })).toBe('<ul><li>A &lt; B &amp; C &gt; D</li></ul>');
  });
});

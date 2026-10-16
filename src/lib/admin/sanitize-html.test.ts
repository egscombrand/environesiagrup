import { describe, expect, it } from 'vitest';
import { sanitizeRichTextHtml } from './sanitize-html';

describe('sanitizeRichTextHtml', () => {
  it('keeps every tag the rich text editor toolbar can produce', () => {
    const html =
      '<p>Teks <strong>tebal</strong> <em>miring</em> <u>garis bawah</u></p>' +
      '<h2>Judul</h2><h3>Sub judul</h3>' +
      '<ul><li>Satu</li></ul><ol><li>Dua</li></ol>' +
      '<blockquote>Kutipan</blockquote>' +
      '<p>Tautan <a href="https://example.com">ke sini</a></p>';
    const result = sanitizeRichTextHtml(html);
    for (const tag of ['p', 'strong', 'em', 'u', 'h2', 'h3', 'ul', 'li', 'ol', 'blockquote', 'a']) {
      expect(result).toContain(`<${tag}`);
    }
    expect(result).toContain('href="https://example.com"');
  });

  it('strips scripts and event handler attributes entirely', () => {
    const result = sanitizeRichTextHtml('<p onclick="alert(1)">hi</p><script>alert(2)</script><img src=x onerror=alert(3)>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('<img');
    expect(result).toContain('hi');
  });

  it('strips tags and attributes the editor cannot produce (iframes, styles, classes)', () => {
    const result = sanitizeRichTextHtml('<p class="x" style="color:red">text</p><iframe src="evil"></iframe>');
    expect(result).not.toContain('<iframe');
    expect(result).not.toContain('style=');
    expect(result).not.toContain('class=');
    expect(result).toContain('text');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeRichTextHtml('  <p>x</p>  ')).toBe('<p>x</p>');
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeRichTextHtml('')).toBe('');
  });
});

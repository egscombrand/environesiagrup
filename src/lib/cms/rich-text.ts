/**
 * A tiny, shared "rich text" convention for a plain-text database column:
 * paragraphs are separated by a blank line, and `**…**` marks bold text.
 * Used wherever a page's editor needs more than one paragraph or an inline
 * emphasis, without storing HTML from the database.
 */

/** Splits a block of text into paragraphs. */
export function paragraphsOf(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Splits one paragraph into plain and bold segments for `**…**`. */
export function segmentsOf(paragraph: string): { text: string; bold: boolean }[] {
  return paragraph
    .split(/(\*\*[^*]+\*\*)/)
    .filter((part) => part.length > 0)
    .map((part) => (part.startsWith('**') && part.endsWith('**') ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false }));
}

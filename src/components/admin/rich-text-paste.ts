const BULLET_LINE = /^\s*[-*•]\s+(.+)$/;
const NUMBERED_LINE = /^\s*\d+[.)]\s+(.+)$/;

export type DetectedPlainTextList = { tag: 'ul' | 'ol'; items: string[] };

/**
 * Recognizes a bullet or numbered list in plain text that carries no real
 * list markup of its own — e.g. pasted from a source that only put
 * "1. First\n2. Second" on the clipboard as text, unlike Word or Google
 * Docs, which also put real `<ol><li>` HTML there (handled separately, by
 * just letting the editor's normal rich paste path parse that HTML). Needs
 * at least two matching lines, all of the same kind, so an ordinary
 * sentence that happens to start with "1." is never mistaken for a list.
 */
export function detectPlainTextList(text: string): DetectedPlainTextList | null {
  const lines = text.split(/\r\n|\r|\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return null;

  if (lines.every((line) => BULLET_LINE.test(line))) {
    return { tag: 'ul', items: lines.map((line) => line.match(BULLET_LINE)![1].trim()) };
  }
  if (lines.every((line) => NUMBERED_LINE.test(line))) {
    return { tag: 'ol', items: lines.map((line) => line.match(NUMBERED_LINE)![1].trim()) };
  }
  return null;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The real `<ul>/<ol><li>` markup for a detected list, ready to parse as HTML. */
export function plainTextListToHtml(detected: DetectedPlainTextList): string {
  const items = detected.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<${detected.tag}>${items}</${detected.tag}>`;
}

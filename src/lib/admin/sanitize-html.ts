import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML from the WYSIWYG rich text editor (src/components/admin/
 * rich-text-editor.tsx) — called both server-side, right before a job's
 * general/specific recruitment HTML is stored, and again right before it's
 * rendered on the public site. Neither trusts the other: a compromised or
 * buggy client could send arbitrary HTML straight to the save action, and
 * stored data could in principle come from somewhere other than this editor
 * later, so both ends sanitize independently.
 *
 * The allow-list is exactly what the editor's own toolbar can produce —
 * nothing else (no images, scripts, iframes, inline styles, or event
 * handler attributes).
 */
export function sanitizeRichTextHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  }).trim();
}

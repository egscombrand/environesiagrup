import { sanitizeRichTextHtml } from '@/lib/admin/sanitize-html';

/**
 * The site's body-copy type scale (headings/paragraphs/lists/links/quotes),
 * as Tailwind arbitrary child selectors instead of a generic typography
 * plugin (not installed here) — mirrors src/components/cms/rich-text.tsx's
 * per-element mapping exactly, so switching a field from that Markdown
 * renderer to this HTML one (e.g. when a resource's richtext field becomes
 * the WYSIWYG editor's 'html' type) never changes how the page looks.
 */
export const ARTICLE_HTML_CLASS = [
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-h2 [&_h2]:text-ink',
  '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-h3 [&_h3]:text-ink',
  '[&_p]:mt-4 [&_p]:text-body [&_p]:text-slate',
  '[&_a]:text-forest [&_a]:underline [&_a]:underline-offset-4',
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-body [&_ul]:text-slate',
  '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:text-body [&_ol]:text-slate',
  '[&_li]:pl-1',
  '[&_strong]:font-medium [&_strong]:text-ink',
  '[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-line [&_blockquote]:pl-4 [&_blockquote]:text-body [&_blockquote]:text-slate [&_blockquote]:italic',
].join(' ');

/**
 * Renders HTML from the WYSIWYG rich text editor (job postings' General/
 * Specific Recruitment, and every resource whose field uses the 'html'
 * type) on the public site. Sanitized again here, right before it reaches
 * the browser — independent of the sanitization already done when it was
 * saved (see lib/admin/sanitize-html.ts) — so a page never trusts that the
 * stored value is safe just because it came from the admin.
 */
export function SanitizedHtml({ html, className }: { html: string; className?: string }) {
  const safe = sanitizeRichTextHtml(html);
  if (!safe) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}

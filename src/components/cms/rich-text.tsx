import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

// Renders admin-authored Markdown (post/project body copy) safely: no raw
// HTML pass-through, no script execution — rehype-sanitize strips anything
// outside its allowlist before this ever reaches the DOM. This is
// deliberately not MDX-from-the-database: compiled MDX would let an editor
// embed arbitrary JSX/components, which sanitized Markdown cannot do.
//
// Elements are mapped to the site's own type scale/tokens (globals.css)
// rather than a generic prose plugin, since project.md locks a bespoke
// typographic system (specific heading sizes, mono labels, etc.).
const components: Components = {
  h2: ({ children }) => <h2 className="mt-10 font-display text-h2 text-ink">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 font-display text-h3 text-ink">{children}</h3>,
  p: ({ children }) => <p className="mt-4 text-body text-slate">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="text-forest underline underline-offset-4" rel="noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-slate">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-body text-slate">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-line pl-4 text-body text-slate italic">{children}</blockquote>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element -- body copy images are arbitrary remote/storage URLs, not known at build time
    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} className="mt-4 rounded-[14px]" />
  ),
};

export function RichText({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary';

// One shared padding/radius/transition scale for every button on the public
// site (design system: Primary Blue #2A7793 / Bright Teal #01B3A1 — see
// globals.css's --color-ink/--color-forest). `py-[14px]` top + an extra 4px
// at the bottom (`pb-[18px]`) and `px-[30px]` are the spec's literal values,
// kept asymmetric on purpose rather than rounded to a symmetric Tailwind
// step. `rounded-full` matches every pill CTA already on the site (see
// ecosystem-exhibition.tsx's "Kunjungi {name}" link).
const BASE =
  'inline-flex w-fit items-center gap-2 rounded-full pt-[14px] pb-[18px] px-[30px] text-small font-semibold transition-colors duration-200 motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-white hover:bg-moss disabled:bg-stone disabled:text-slate aria-disabled:bg-stone aria-disabled:text-slate',
  secondary:
    'border border-forest bg-transparent text-ink hover:bg-forest/5 disabled:border-stone disabled:text-slate aria-disabled:border-stone aria-disabled:text-slate',
};

function Arrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  /** Trailing arrow glyph, the spec's "Lorem Ipsum →" shape — on by default, since that's the common case on this site. */
  showArrow?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

/**
 * The one button component for the public site — primary (solid teal),
 * secondary (teal outline), and a disabled state, per the Environesia
 * Group design system. Renders a Next.js `Link` when given `href` (internal
 * routes), a plain `<a>` for an external URL, or a native `<button>`
 * otherwise — same visual system either way.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', showArrow = true, children, className, ...rest } = props;
  const classes = `${BASE} ${VARIANT[variant]} group ${className ?? ''}`;
  const arrow = showArrow ? <Arrow className="group-hover:translate-x-0.5" /> : null;

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
          {arrow}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
        {arrow}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {children}
      {arrow}
    </button>
  );
}

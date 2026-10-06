import type { CSSProperties, ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
  id?: string;
  /** Inline style merged onto the inner max-width container — lets one
   * call site override its default 1280px cap (e.g. to give a two-column
   * layout more room) without touching every other Section usage. Inline
   * style, not an extra class, so it reliably wins regardless of
   * Tailwind's own class-ordering for the same property. */
  innerStyle?: CSSProperties;
};

export function Section({ children, className = '', as: Tag = 'section', id, innerStyle }: SectionProps) {
  return (
    <Tag id={id} className={`py-14 md:py-24 ${className}`.trim()}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-12" style={innerStyle}>
        {children}
      </div>
    </Tag>
  );
}

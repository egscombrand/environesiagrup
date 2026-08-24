import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
  id?: string;
};

export function Section({ children, className = '', as: Tag = 'section', id }: SectionProps) {
  return (
    <Tag id={id} className={`py-14 md:py-24 ${className}`.trim()}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">{children}</div>
    </Tag>
  );
}

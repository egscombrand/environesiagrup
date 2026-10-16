import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e3e8ee] px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f6f9]">
        <Icon className="h-5 w-5 text-[#64748b]" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="mt-4 font-display text-h3 text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-small text-[#64748b]">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

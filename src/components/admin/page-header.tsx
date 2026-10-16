import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">{eyebrow}</p> : null}
        <h1 className="mt-1 font-display text-h2 text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-small text-[#64748b]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

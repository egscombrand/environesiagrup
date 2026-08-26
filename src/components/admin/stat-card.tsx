import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Positive/negative optional trend, e.g. { value: '+3 this week', direction: 'up' }. */
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
}) {
  return (
    <div className="rounded-[14px] border border-line bg-paper p-5">
      <div className="flex items-start justify-between">
        <p className="font-mono text-label uppercase text-slate">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-slate" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <p className="mt-3 font-display text-h2 text-ink">{value}</p>
      {trend ? (
        <p
          className={`mt-1 text-small ${
            trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-danger' : 'text-slate'
          }`}
        >
          {trend.value}
        </p>
      ) : null}
    </div>
  );
}

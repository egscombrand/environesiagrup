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
    <div className="rounded-[12px] border border-[#e3e8ee] bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-[#64748b]" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <p className="mt-3 font-display text-h2 text-ink">{value}</p>
      {trend ? (
        <p
          className={`mt-1 text-small ${
            trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-danger' : 'text-[#64748b]'
          }`}
        >
          {trend.value}
        </p>
      ) : null}
    </div>
  );
}

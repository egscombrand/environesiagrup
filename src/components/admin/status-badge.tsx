const DOT_STYLES: Record<string, string> = {
  published: 'bg-success',
  draft: 'bg-slate',
  archived: 'bg-danger',
};

const TEXT_STYLES: Record<string, string> = {
  published: 'text-success',
  draft: 'text-[#64748b]',
  archived: 'text-danger',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status] ?? DOT_STYLES.draft}`} aria-hidden="true" />
      <span className={TEXT_STYLES[status] ?? TEXT_STYLES.draft}>{status}</span>
    </span>
  );
}

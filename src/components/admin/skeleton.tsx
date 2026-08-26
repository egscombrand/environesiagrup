export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-[6px] bg-stone ${className}`} aria-hidden="true" />;
}

export function TableSkeleton({ columns = 4, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-paper" role="status" aria-label="Memuat data">
      <div className="border-b border-line px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="border-b border-line last:border-0">
              {Array.from({ length: columns }).map((_, col) => (
                <td key={col} className="px-4 py-4">
                  <Skeleton className="h-4 w-full max-w-[160px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-[14px] border border-line bg-paper p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-16" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

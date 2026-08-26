'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const OPTIONS = ['draft', 'published', 'archived'];

export function StatusSelect({
  status,
  onChange,
}: {
  status: string;
  onChange: (status: 'draft' | 'published' | 'archived') => Promise<{ error?: string } | void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as 'draft' | 'published' | 'archived';
        startTransition(async () => {
          await onChange(next);
          router.refresh();
        });
      }}
      className="rounded-[8px] border border-line bg-paper px-2 py-1 text-small text-ink disabled:opacity-60"
    >
      {OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

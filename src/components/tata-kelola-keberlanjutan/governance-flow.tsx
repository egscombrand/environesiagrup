/**
 * A short sequence of steps shown as one connected line: horizontal on desktop,
 * vertical on mobile. Each step can carry an optional description. Used for
 * processes that run in order, such as risk management.
 *
 * Tailwind needs complete class names, so the desktop column count is mapped
 * from a fixed set rather than built from a string.
 */
const DESKTOP_COLUMNS = {
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
} as const;

export function GovernanceFlow({
  steps,
}: {
  steps: readonly { label: string; description?: string }[];
}) {
  const columns = steps.length === 5 ? DESKTOP_COLUMNS[5] : DESKTOP_COLUMNS[4];

  return (
    <div className="relative">
      <span
        className="absolute left-[5px] top-[5px] hidden h-px w-[calc(100%-5px)] bg-[#DDE5E7] md:block"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-[10px] left-[5px] top-[10px] w-px bg-[#DDE5E7] md:hidden"
        aria-hidden="true"
      />
      <ol className={`relative grid grid-cols-1 gap-7 md:gap-6 ${columns}`}>
        {steps.map((step, index) => (
          <li key={`${index}-${step.label}`} className="relative min-w-0 pl-7 md:pl-0 md:pr-4 md:pt-6">
            <span className="absolute left-0 top-[2px] h-[11px] w-[11px] rounded-full border border-[#01B3A1] bg-white md:top-0" aria-hidden="true" />
            <span className="block text-[12px] font-semibold tabular-nums tracking-[0.1em] text-[#01B3A1]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="mt-1 break-words text-[15px] font-bold uppercase tracking-[0.04em] text-[#0B2B22] md:text-[14px]">
              {step.label}
            </p>
            {step.description ? (
              <p className="mt-1.5 text-small text-[#444444]">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

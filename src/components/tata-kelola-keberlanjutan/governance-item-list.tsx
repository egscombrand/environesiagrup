/**
 * A numbered list of short statements, each with a title and a description. Two
 * columns on desktop and one on mobile, with a hairline above every item. Used
 * for frameworks that are a set of parallel points rather than a sequence.
 */
export function GovernanceItemList({
  items,
}: {
  items: readonly { title: string; description: string }[];
}) {
  return (
    <ol className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 md:gap-y-9">
      {items.map((item, index) => (
        <li key={`${index}-${item.title}`} className="group min-w-0 border-t border-[#DDE5E7] pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-[12px] font-semibold tabular-nums tracking-[0.1em] text-[#01B3A1] transition-colors duration-300 group-hover:text-[#2A7793] motion-reduce:transition-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="break-words text-h3 font-bold text-[#1A1A1A] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">
              {item.title}
            </h3>
          </div>
          <p className="mt-2.5 pl-[1.9rem] text-body text-[#444444]">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Section 2 of every Tata Kelola & Keberlanjutan page: a short context paragraph
 * that sets up the content below it. The block is full width and white, the same
 * as the navigation that follows, so the two read as one continuous band.
 * Shared so every page spaces and sizes it the same way.
 */
export function GovernanceContext({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white px-6 pt-12 font-landing-body md:px-8 md:pt-14">
      <div className="mx-auto max-w-[1200px]">
        <p className="max-w-[680px] pb-2 text-body text-[#444444] md:pb-3">{children}</p>
      </div>
    </div>
  );
}

/**
 * A closing paragraph at the end of a Tata Kelola page. With a label it is a
 * labelled block with a hairline above it (e.g. "KOMITMEN ETIKA"). Without one
 * it is a small disclaimer under the same hairline.
 */
export function GovernanceNote({ label, text }: { label: string | null; text: string }) {
  if (label) {
    return (
      <div className="mt-14 border-t border-[#DDE5E7] pt-10 md:mt-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#666666]">{label}</p>
        <p className="mt-4 max-w-[760px] text-body text-[#444444]">{text}</p>
      </div>
    );
  }

  return (
    <p className="mt-14 max-w-[760px] border-t border-[#DDE5E7] pt-8 text-[13px] leading-[1.7] text-[#666666] md:mt-16">{text}</p>
  );
}

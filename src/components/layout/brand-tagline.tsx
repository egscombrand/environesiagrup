import { BRAND_TAGLINE_LEAD, BRAND_TAGLINE_REST } from '@/lib/site';

// Reproduces the two-weight treatment the logo artwork uses: the lead is
// heavier than the remainder.
export function BrandTagline({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      <span className="font-semibold">{BRAND_TAGLINE_LEAD}</span> {BRAND_TAGLINE_REST}
    </p>
  );
}

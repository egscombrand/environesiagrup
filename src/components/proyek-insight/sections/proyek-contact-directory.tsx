import { messagesFor } from '@/i18n/messages';
import { ENTITY_PROFILES } from '@/components/bisnis-layanan/entity-profile-data';

const PRIMARY = '#2A7793';
const TEXT = '#444444';
const MUTED = '#666666';
const BORDER = '#E5E7EB';

const BRANDS = [
  { slug: 'environesia-consultant', name: 'Environesia Consultant' },
  { slug: 'greenlab', name: 'GreenLab' },
  { slug: 'greenskill', name: 'GreenSkill' },
  { slug: 'lsp-praktisi-lingkungan', name: 'LSP Praktisi Lingkungan Indonesia' },
  { slug: 'bikin-indonesia-berdaya', name: 'Bikin Indonesia Berdaya' },
];

/**
 * A small information note under Daftar Proyek: what to do if a project is
 * missing or out of date, plus a plain contact directory of the group's
 * brands. Links go to each brand's official website — no promotional copy.
 */
export function ProyekContactDirectory({ locale }: { locale: string }) {
  const t = messagesFor(locale);

  return (
    <section aria-labelledby="belum-menemukan-proyek" className="mt-14">
      <h2
        id="belum-menemukan-proyek"
        className="text-[26px] font-bold leading-[1.25] sm:text-[28px]"
        style={{ color: PRIMARY }}
      >
        {t.proyek.belumMenemukanJudul}
      </h2>
      <p className="mt-3 max-w-[650px] text-body" style={{ color: TEXT }}>
        {t.proyek.belumMenemukanDeskripsi}
      </p>

      <div className="mt-6 overflow-hidden rounded-[16px] border" style={{ borderColor: BORDER, backgroundColor: BORDER }}>
        <ul className="grid grid-cols-1 gap-px sm:grid-cols-2">
          {BRANDS.map((brand, i) => {
            const profile = ENTITY_PROFILES[brand.slug];
            const host = new URL(profile.ctaUrl).host;
            const spanFull = i === BRANDS.length - 1 && BRANDS.length % 2 === 1;

            return (
              <li key={brand.slug} className={`bg-white px-5 py-5 sm:px-6 ${spanFull ? 'sm:col-span-2' : ''}`}>
                <p className="text-[16px] font-semibold leading-[1.35]" style={{ color: PRIMARY }}>
                  {brand.name}
                </p>
                <p className="mt-1 text-small" style={{ color: MUTED }}>
                  {t.proyek.kontakCakupan[brand.slug]}
                </p>
                <a
                  href={profile.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[14px] font-medium underline-offset-4 hover:underline"
                  style={{ color: PRIMARY }}
                >
                  {t.proyek.kontakLabel} · {host}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

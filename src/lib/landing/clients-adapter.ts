// Clients & Partners has no CMS backing anywhere in this project — no table,
// no admin resource, no query function (confirmed by a full-codebase audit).
// This adapter exists so the section is genuinely "CMS-ready" per the
// landing-page blueprint's Data Source -> Adapter -> Section Data -> UI
// Component architecture: swapping this for a real getPublishedClients()
// later requires zero changes to clients-partners.tsx.
//
// Migration requirement for Phase 2: a `clients` table (client_name, logo,
// order, active) plus an admin resource config, following the exact same
// pattern as entities/pillars/leadership.
//
// Deliberately returns an empty array rather than invented company names —
// fabricating plausible-sounding clients would be exactly the kind of false
// business claim the blueprint prohibits elsewhere (fake projects, fake ESG
// numbers). The section renders its own honest empty state until real data
// exists.
export type ClientLogo = {
  id: string;
  name: string;
  logoUrl?: string;
  order: number;
};

export async function getClientsAndPartners(): Promise<ClientLogo[]> {
  return [];
}

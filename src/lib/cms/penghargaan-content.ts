/**
 * Penghargaan as the tab shows it today: a heading, an intro paragraph, and an
 * honest "coming soon" state, since no real award has been given yet. The
 * "coming soon" text itself stays in the component — it is a fixed empty
 * state, not per-award content, so there is nothing here to seed it from.
 */
export type PenghargaanContent = {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
};

export const PENGHARGAAN_FALLBACK: PenghargaanContent = {
  title: 'Penghargaan',
  description: 'Pengakuan dan apresiasi untuk grup.',
  metaTitle: 'Penghargaan',
  metaDescription: 'Pengakuan dan apresiasi untuk Environesia.',
};

import { describe, expect, it, vi } from 'vitest';

const redirect = vi.fn();
vi.mock('next/navigation', () => ({ redirect: (...args: unknown[]) => redirect(...args) }));

const { default: ProyekPage } = await import('./page');

describe('ProyekPage (legacy /proyek)', () => {
  it('redirects to the real Proyek & Insight hub instead of rendering the old plain list', async () => {
    await ProyekPage({ params: Promise.resolve({ locale: 'id' }) });
    expect(redirect).toHaveBeenCalledWith('/id/proyek-insight');
  });

  it('redirects within the requested locale', async () => {
    await ProyekPage({ params: Promise.resolve({ locale: 'en' }) });
    expect(redirect).toHaveBeenCalledWith('/en/proyek-insight');
  });
});

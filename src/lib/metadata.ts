import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_NAME = 'Environesia';

const OG_LOCALES: Record<string, string> = {
  id: 'id_ID',
  en: 'en_US',
  zh: 'zh_CN',
};

export function ogLocale(locale: string) {
  return OG_LOCALES[locale] ?? locale;
}

function localePath(locale: string, path: string) {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function buildMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description?: string | null;
  locale: string;
  path: string;
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((candidate) => [candidate, localePath(candidate, path)])
  );
  const resolvedDescription = description ?? undefined;

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical: localePath(locale, path),
      languages,
    },
    openGraph: {
      title,
      description: resolvedDescription,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: 'website',
    },
  };
}

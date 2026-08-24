import { getCollection } from '@/lib/content';
import { HeroSlider } from './hero-slider';
import type { HeroSlideEntry } from '@/lib/content-types';

export function HeroSection({ locale }: { locale: string }) {
  const slides = getCollection<HeroSlideEntry>('hero')
    .map((entry) => entry.data)
    .sort((a, b) => a.urutan - b.urutan);

  return <HeroSlider slides={slides} locale={locale} />;
}

import { getPublishedHeroSlides } from '@/lib/cms/hero';
import { HeroSlider } from './hero-slider';

export async function HeroSection({ locale }: { locale: string }) {
  const slides = await getPublishedHeroSlides();

  return <HeroSlider slides={slides} locale={locale} />;
}

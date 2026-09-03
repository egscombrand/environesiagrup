import { getPublishedHeroSlides } from '@/lib/cms/hero';
import { HeroSlider } from './hero-slider';

export async function HeroSection() {
  const slides = await getPublishedHeroSlides();
  return <HeroSlider slides={slides} />;
}

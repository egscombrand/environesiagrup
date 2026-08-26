import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { publicMediaUrl } from './media';

type HeroSlideRow = Database['public']['Tables']['hero_slides']['Row'];

export type HeroSlide = HeroSlideRow & {
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  videoPosterUrl?: string;
};

function mapHeroSlide(row: HeroSlideRow): HeroSlide {
  return {
    ...row,
    desktopImageUrl: publicMediaUrl(row.desktop_image_path),
    mobileImageUrl: publicMediaUrl(row.mobile_image_path),
    videoPosterUrl: publicMediaUrl(row.video_poster_path),
  };
}

export async function getPublishedHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load hero slides: ${error.message}`);
  return (data ?? []).map(mapHeroSlide);
}

export async function listHeroSlidesForAdmin(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to load hero slides: ${error.message}`);
  return (data ?? []).map(mapHeroSlide);
}

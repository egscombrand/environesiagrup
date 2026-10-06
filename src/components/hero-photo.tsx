import Image from 'next/image';

/**
 * The full-bleed photo layer behind a page hero, with a desktop and a phone
 * version of the same building photo. Both images are rendered and CSS shows
 * the one for the current width (`md` breakpoint), so no viewport JavaScript is
 * needed. Both are lazy-loaded: a `display: none` image is never fetched, so a
 * phone never downloads the large desktop file and a desktop never downloads the
 * phone crop. The caller positions this inside its own hero box.
 */
export function HeroPhoto({
  desktopSrc = '/BannerS2.jpg',
  mobileSrc = '/banermobile.jpg',
  alt = '',
}: {
  desktopSrc?: string;
  mobileSrc?: string;
  alt?: string;
}) {
  return (
    <>
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        quality={100}
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />
      <Image
        src={mobileSrc}
        alt={alt}
        fill
        quality={100}
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
    </>
  );
}

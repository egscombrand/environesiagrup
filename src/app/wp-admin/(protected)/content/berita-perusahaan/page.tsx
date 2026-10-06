import { redirect } from 'next/navigation';

// Berita Perusahaan is managed from the single Siaran Pers menu now. Old
// bookmarks to this admin route land on it.
export default function BeritaPerusahaanRedirect() {
  redirect('/wp-admin/content/siaran-pers');
}

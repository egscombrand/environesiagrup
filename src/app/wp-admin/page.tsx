import { redirect } from 'next/navigation';

export default function WpAdminIndexPage() {
  redirect('/wp-admin/dashboard');
}

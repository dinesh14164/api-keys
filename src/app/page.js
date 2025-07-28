import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboards page
  redirect('/dashboards');
}

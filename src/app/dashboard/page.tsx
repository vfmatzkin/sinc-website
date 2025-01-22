import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/signin');
  }

  return <div>Welcome to your dashboard, {user.name}!</div>;
}

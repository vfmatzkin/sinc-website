import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="text-gray-900 dark:text-gray-100">
      Welcome to your dashboard, {user.name}!
    </div>
  );
}

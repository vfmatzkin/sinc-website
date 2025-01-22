import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import ProfileActions from './ProfileActions';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div>
        <p>Please log in to view your profile</p>
        <Link href="/api/auth/signin">Sign In</Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl mb-6 text-gray-900 dark:text-white font-bold">Your Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6">
        <div className="mb-4 text-gray-900 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">Name:</strong> {user?.name}
        </div>
        <div className="mb-4 text-gray-900 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">Email:</strong> {user?.email}
        </div>
        <div className="mb-4 text-gray-900 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">Phone:</strong> {user?.phone || 'Not provided'}
        </div>
        <div className="mb-4 text-gray-900 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">Institution:</strong> {user?.institution || 'Not provided'}
        </div>
        <div className="mb-4 text-gray-900 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">Staff Status:</strong> {user?.staffVerificationStatus}
        </div>
        
        <ProfileActions />
      </div>
    </div>
  );
}
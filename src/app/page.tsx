import { getCurrentUser } from '@/lib/auth';

export default async function Home() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error('Error on home page:', error);
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        Welcome to sinc(i)
      </h1>
      {user ? (
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Hello, {user.name}! Explore our research platform.
        </p>
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Sign in to access full platform features.
        </p>
      )}
    </div>
  )
}

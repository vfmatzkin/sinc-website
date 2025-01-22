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
          Hello, {user.name}!
        </p>
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Sign in to access full platform features.
        </p>
      )}
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 dark:bg-gray-800 rounded shadow-md">
        <p className="text-lg text-gray-800 dark:text-gray-200">
        Research at sinc(i) aims to develop new algorithms for machine learning, data mining, signal processing and complex systems, providing innovative technologies for advancing healthcare, bioinformatics, precision agriculture, autonomous systems and human-computer interfaces. Research facilities are located in the Facultad de Ingeniería y Ciencias Hídricas building, Universidad Nacional del Litoral, on the University Campus.
        </p>
      </div>
    </div>
  )
}

'use client';

import Link from 'next/link';

export default function ProfileActions() {
  const handleDeleteRequest = async () => {
    // Implement deletion request logic here
    console.log('Delete account requested');
  };

  return (
    <div className="mt-6">
      <Link 
        href="/complete-registration" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Edit Profile
      </Link>
      
      <button 
        onClick={handleDeleteRequest}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Request Account Deletion
      </button>
    </div>
  );
}

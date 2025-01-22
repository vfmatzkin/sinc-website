'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CompleteRegistration() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    phone: '',
    institution: '',
    department: '',
    isStaff: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        // Handle error
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (!session) {
    return <div>Please log in first</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-6">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Institution</label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => setFormData({...formData, institution: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isStaff}
              onChange={(e) => setFormData({...formData, isStaff: e.target.checked})}
              className="mr-2"
            />
            I am a staff member
          </label>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}
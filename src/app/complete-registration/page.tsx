'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function CompleteRegistration() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    institution: '',
    department: '',
    isStaff: false,
    firstName: '',
    lastName: '',
    bio: '',
    website: '',
    employeeId: '',
    officeNumber: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const userData = await response.json();
          // Split full name into first and last name
          const [firstName = '', lastName = ''] = (userData.name || '').split(' ');
          
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            phone: userData.phone || '',
            institution: userData.institution || '',
            department: userData.department || '',
            bio: userData.bio || '',
            website: userData.profile?.customLinks?.website || '',
            isStaff: userData.role === 'STAFF',
            employeeId: '', // These fields don't exist in the schema yet
            officeNumber: ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Use replace instead of push to avoid navigation issues
        router.replace('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Protected route check
  if (!session) {
    // Redirect to login with the current page as callback
    router.replace(`/auth/signin?callbackUrl=${encodeURIComponent('/complete-registration')}`);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Complete Your Profile
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Staff Information Section */}
            <div>
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.isStaff}
                  onChange={(e) => setFormData({ ...formData, isStaff: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <span>I am a staff member</span>
              </label>
            </div>

            {formData.isStaff && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Staff Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Office Number
                    </label>
                    <input
                      type="text"
                      value={formData.officeNumber}
                      onChange={(e) => setFormData({ ...formData, officeNumber: e.target.value })}
                      className="w-full border dark:border-gray-600 rounded-md p-2 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md text-white text-lg font-medium relative
                  ${isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Complete Registration</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                    </div>
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
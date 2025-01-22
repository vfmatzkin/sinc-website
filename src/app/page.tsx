'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const [content, setContent] = useState({
    title: '',
    signInPrompt: '',
    description: '',
  });

  const isLoading = status === 'loading';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [welcomeRes, signInRes, descRes] = await Promise.all([
          fetch(`/api/content?key=welcome.title&lang=${language}`),
          fetch(`/api/content?key=welcome.signin_prompt&lang=${language}`),
          fetch(`/api/content?key=home.description&lang=${language}`),
        ]);

        const [welcomeData, signInData, descData] = await Promise.all([
          welcomeRes.json(),
          signInRes.json(),
          descRes.json(),
        ]);

        setContent({
          title: welcomeData.content || 'Welcome',
          signInPrompt: signInData.content || 'Please sign in',
          description: descData.content || '',
        });
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [language]);

  return (
    <div className="relative min-h-screen w-full text-center">
      <img
        src="images/background.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ minHeight: '100vh' }}
      />
      <div className="relative z-10 pt-20 px-4 min-h-screen flex flex-col items-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
          {content.title}
        </h1>
        {session ? (
          <p className="text-2xl text-gray-700 dark:text-gray-200">
            {`Hello, ${session.user.name}!`}
          </p>
        ) : (
          <p className="text-2xl text-gray-700 dark:text-gray-200">
            {content.signInPrompt}
          </p>
        )}
        <div className="max-w-2xl mt-10 p-8 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}
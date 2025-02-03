'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const [content, setContent] = useState({
    title: '',
    signInPrompt: '',
    description: '',
  });

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
    <div className="relative w-full">
      <div className="absolute inset-0 h-[calc(100vh-10rem)]">
        <Image
          src="/images/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm h-[calc(100vh-10rem)]">
        <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            {content.title}
          </h1>
          {session ? (
            <p className="text-2xl text-gray-700 dark:text-gray-200 text-center mb-8">
              {`👋🏽 ${session.user.name}!`}
            </p>
          ) : (
            <p className="text-2xl text-gray-700 dark:text-gray-200 text-center mb-8">
              {content.signInPrompt}
            </p>
          )}
          <div className="max-w-2xl w-full p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm">
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
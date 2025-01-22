'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [language, setLanguageState] = useState('EN');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const initializeLanguage = async () => {
      setIsLoading(true);
      try {
        if (session) { // Check if user is logged in
          // Fetch user's saved language preference
          const response = await fetch('/api/users/language');
          const data = await response.json();
          if (data.language) {
            setLanguageState(data.language);
          } else {
            // Fallback to URL parameter or browser language if no preference is set
            const urlLang = searchParams.get('lang')?.toUpperCase();
            if (urlLang === 'EN' || urlLang === 'ES') {
              setLanguageState(urlLang);
            } else {
              const browserLang = navigator.language.split('-')[0].toUpperCase();
              setLanguageState(browserLang === 'ES' ? 'ES' : 'EN');
            }
          }
        } else { // If no user is logged in
          // Check URL parameter first
          const urlLang = searchParams.get('lang')?.toUpperCase();
          if (urlLang === 'EN' || urlLang === 'ES') {
            setLanguageState(urlLang);
          } else {
            // Finally, check browser language
            const browserLang = navigator.language.split('-')[0].toUpperCase();
            setLanguageState(browserLang === 'ES' ? 'ES' : 'EN');
          }
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
      setIsLoading(false);
    };

    initializeLanguage();
  }, [searchParams, session]); // Added `session` to dependencies

  const setLanguage = async (lang: string) => {
    setIsLoading(true);
    if (session?.user) {
      try {
        await fetch('/api/users/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang }),
        });
      } catch (error) {
        console.error('Error setting language:', error);
      }
    }

    setLanguageState(lang);
    setIsLoading(false);

    // Update the URL with the new lang parameter
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    const newPath = `${url.pathname}?${url.searchParams.toString()}`;
    router.replace(newPath); // Navigate to the updated URL without reloading
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Globe size={20} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setLanguage('EN');
              setIsOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              language === 'EN' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              setLanguage('ES');
              setIsOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              language === 'ES' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            Español
          </button>
        </div>
      )}
    </div>
  );
}
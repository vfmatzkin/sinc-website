'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

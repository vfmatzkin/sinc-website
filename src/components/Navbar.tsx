'use client';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  AlertCircle // replaced AlertTriangle with AlertCircle
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
  >
    {children}
  </Link>
);

export default function Navbar({ session }: { session: Session | null }) {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // new state for opacity
  const [isHovered, setIsHovered] = useState(false); // new state for hover

  useEffect(() => {
    setMounted(true);
  }, []); // Removed auto-close timers here

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isHovered && showAlert) {
      timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowAlert(false), 500);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isHovered, showAlert]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2"
          >
            {mounted ? (
              <Image 
                src={theme === 'dark' ? "/images/sinc-logo-b.webp" : "/images/sinc-logo-w.webp"} 
                alt="Logo" 
                className="h-12 w-auto" 
                width={128} 
                height={64} 
              />
            ) : (
              <Image 
                src="/images/sinc-logo-w.webp" 
                alt="Logo" 
                className="h-12 w-auto" 
                width={128} 
                height={64} 
              />
            )}
          </Link>

          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className={` 
            ${isMenuOpen ? 'block' : 'hidden'}
            md:flex md:items-center md:space-x-4 
            absolute md:relative top-full left-0 
            w-full md:w-auto 
            bg-white dark:bg-gray-900 
            md:bg-transparent 
            shadow-md md:shadow-none 
            py-4 md:py-0
          `}>
            <NavLink href="/"><Home size={16} /> Home</NavLink>
            <NavLink href="/staff">Staff Directory</NavLink>
            {session && session.user?.registrationComplete && (
              <>
                <NavLink href="/profile"><User size={16} /> Profile</NavLink>
                <NavLink href="/dashboard">Dashboard</NavLink>
              </>
            )}
          </div>

          {/* Authentication and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            {session && (
              session.user?.registrationComplete ? (
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )
            )}
            {!session && (
              <Link 
                href="/auth/signin"
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <LogIn size={16} /> Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
      {session && !session.user?.registrationComplete && showAlert && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed top-20 right-4 z-50 bg-red-100 ${
            isHovered ? 'bg-opacity-100' : 'bg-opacity-90'
          } border border-red-400 text-red-800 px-6 py-3 rounded flex items-center gap-3 shadow-lg transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <AlertCircle size={24} className="text-red-600" />
          <span>Your account is pending verification by the administrator. Please check back later.</span>
          <button
            onClick={() => setShowAlert(false)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
'use client';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import { 
  Home, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
  >
    {children}
  </Link>
);

export default function Navbar({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2"
        >
          sinc(i)
        </Link>

        {/* Mobile Menu Toggle */}
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
          
          {session && (
            <>
              <NavLink href="/profile"><User size={16} /> Profile</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </>
          )}
        </div>

        {/* Authentication and Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {session ? (
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
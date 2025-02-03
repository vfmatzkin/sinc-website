'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/components/LanguageProvider';
import type { Session } from 'next-auth';

interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

export function Providers({ 
  children, 
  session 
}: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/components/LanguageProvider';

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode, 
  session: any 
}) {
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
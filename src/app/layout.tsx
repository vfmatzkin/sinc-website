import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Navbar from '@/components/Navbar'
import { Providers } from './providers'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'sinc(i)',
  description: 'Research Institute for Signals, Systems and Computational Intelligence',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Session retrieval error:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col`}
      >
        <Providers session={session}>
          <LanguageProvider>
            <div className="flex flex-col h-screen">
              <Navbar session={session} />
              <main className="flex-1">
                {children}
              </main>
              <footer className="bg-gray-100 py-3">
                <div className="container mx-auto text-center text-gray-600">
                  © {new Date().getFullYear()} sinc(i)
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  )
}
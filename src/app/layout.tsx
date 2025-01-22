import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Navbar from '@/components/Navbar'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'sinc(i) Platform',
  description: 'Research and Collaboration Platform',
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
        className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}
      >
        <Providers session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar session={session} />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 py-6 mt-auto">
              <div className="container mx-auto text-center text-gray-600">
                © {new Date().getFullYear()} sinc(i) Platform. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
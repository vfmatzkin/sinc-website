import NextAuth from 'next-auth';
import type { AuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { Role, StaffVerificationStatus } from '@prisma/client';

// Ensure TypeScript recognizes the updated types in src/types/next-auth.d.ts

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      staffStatus: StaffVerificationStatus;
      languagePreference: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: AuthOptions = {
  // Increase debug level
  debug: process.env.NODE_ENV === 'development',
  
  // Use Prisma adapter
  adapter: PrismaAdapter(prisma) as any,
  
  // Configure providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      
      // Additional authorization parameters
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          scope: 'openid profile email'
        }
      }
    })
  ],
  
  // Session strategy
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Callbacks for additional configuration
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            language: true
          }
        });

        session.user.id = user.id;
        session.user.role = dbUser?.role || 'USER';
        session.user.staffStatus = dbUser?.staffVerificationStatus || 'UNVERIFIED';
        session.user.languagePreference = dbUser?.language?.language || 'EN';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
          // Create new user with default settings
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              role: 'USER',
              staffVerificationStatus: 'UNVERIFIED',
              language: {
                create: {
                  language: 'EN'
                }
              }
            }
          });
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  
  // Add comprehensive error handling
  events: {
    async signIn(message) {
      console.log('Sign in event:', message);
    },
    async signOut(message) {
      console.log('Sign out event:', message);
    },
    async createUser(message) {
      console.log('User created:', message);
    },
    async linkAccount(message) {
      console.log('Account linked:', message);
    },
    async session(message) {
      console.log('Session updated:', message);
    }
  },

  // Add pages configuration
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
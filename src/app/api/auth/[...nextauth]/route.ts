// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  // Increase debug level
  debug: true,
  
  // Use Prisma adapter
  adapter: PrismaAdapter(prisma),
  
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
  },
  
  // Callbacks for additional configuration
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
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
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
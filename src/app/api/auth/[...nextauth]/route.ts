import NextAuth from 'next-auth';
import type { AuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { Role, StaffVerificationStatus } from '@prisma/client';


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
  debug: true, // Temporarily increase debug level to see what's happening
  
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
        if (!user.email) return false;

        console.log("Signing in user:", { user, account, profile });

        // First try to find user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        if (existingUser) {
          // If user exists but doesn't have this OAuth account linked
          const hasProvider = existingUser.accounts.some(
            acc => acc.provider === account?.provider
          );

          if (!hasProvider && account) {
            // Link the new OAuth account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: profile?.sub || user.id,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
              }
            });
          }
          return true;
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
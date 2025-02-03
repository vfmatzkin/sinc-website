import NextAuth from 'next-auth';
import type { AuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { Role, StaffVerificationStatus, Prisma } from '@prisma/client';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      staffStatus: StaffVerificationStatus;
      languagePreference: string;
      registrationComplete: boolean;
    } & DefaultSession['user'];
  }
}

export const authOptions: AuthOptions = {
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Callbacks for additional configuration
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          role: true,
          staffVerificationStatus: true,
          registrationComplete: true,
          language: {
            select: {
              language: true
            }
          }
        }
      });

      if (!dbUser) {
        throw new Error('User not found');
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: dbUser.role ?? Role.USER,
          staffStatus: dbUser.staffVerificationStatus ?? StaffVerificationStatus.UNVERIFIED,
          languagePreference: dbUser.language?.language || 'EN',
          registrationComplete: dbUser.registrationComplete
        }
      };
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      if (account?.provider === "google") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          const userData = {
            email: user.email,
            name: user.name ?? "",
            role: Role.USER,
            registrationComplete: false,
          } as const;

          existingUser = await prisma.user.create({
            data: userData
          });

          // Redirect to complete registration page
          return `/complete-registration?userId=${existingUser.id}`;
        }

        // Check if the user is pending verification
        if (existingUser.staffVerificationStatus === 'PENDING') {
          // Redirect to sign-in page with error message
          const url = new URL('/auth/signin', process.env.NEXTAUTH_URL);
          url.searchParams.set('error', 'PendingVerification');
          return url.toString();
        }

        // Link the account to the user
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token,
            expires_at: account.expires_at,
            id_token: account.id_token,
            refresh_token: account.refresh_token,
            scope: account.scope,
            token_type: account.token_type,
          },
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the homepage if the user is verified
      if (url.startsWith(baseUrl)) {
        return baseUrl;
      }
      // Otherwise, redirect to the sign-in page with the error message
      return url;
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
    newUser: '/complete-registration',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
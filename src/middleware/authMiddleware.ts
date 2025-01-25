import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes patterns
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/admin',
  ];

  // Check if the current path should be protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const session = await getServerSession(authOptions);

    if (!session) {
      const url = new URL(`/auth/signin`, request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};

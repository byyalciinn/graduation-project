import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a basic proxy - you can enhance it with NextAuth session checks
export function proxy(request: NextRequest) {
  // Allow access to public routes
  const publicPaths = ['/login', '/register', '/api/auth', '/api/register'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For now, allow all routes - you can add session checking here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};

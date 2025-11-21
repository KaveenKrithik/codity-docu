import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check for session cookie
    const session = request.cookies.get('sb-access-token');
    
    if (!session) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

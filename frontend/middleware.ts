import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('registry_session');
  
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
      
      // Check if session is expired
      if (Date.now() - sessionData.loginTime > SESSION_DURATION) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = isAuthenticated(request);
  
  // If user is authenticated and trying to access root, redirect to dashboard
  if (isAuth && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not authenticated and trying to access dashboard, redirect to root
  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};
